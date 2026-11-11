import type { DesignNode } from '@root/types/document'
import { remapStateRules } from '@root/utils/conditions/componentState'
import { reconcileFlows } from '@root/utils/flows/flowModel'
import { v4 as uuidv4 } from 'uuid'

/** Creates an independent snapshot, preserving interactions inside the selected group only. */
export const getClonedNodesForReuse = (
  nodes: DesignNode[],
  preservedIds: ReadonlyMap<string, string> = new Map(),
): DesignNode[] => {
  const plainNodes = JSON.parse(JSON.stringify(nodes)) as DesignNode[]
  const idMap = new Map<string, string>()

  const collectIds = (items: DesignNode[]): void => {
    for (const item of items) {
      idMap.set(item.id, uuidv4())

      collectIds(item.children)

      Object.values(item.slots ?? {}).forEach(collectIds)
    }
  }

  collectIds(plainNodes)

  preservedIds.forEach((value, key) => {
    if (idMap.has(key)) {
      idMap.set(key, value)
    }
  })

  const getCloneNode = (node: DesignNode): DesignNode => ({
    ...node,
    id: idMap.get(node.id) ?? uuidv4(),
    props:
      typeof node.props.initialItemId === 'string'
        ? {
            ...node.props,
            initialItemId: idMap.get(node.props.initialItemId) ?? node.props.initialItemId,
          }
        : node.props,
    stateRules: remapStateRules(node.stateRules, idMap),
    textBinding:
      node.textBinding && idMap.has(node.textBinding.sourceNodeId)
        ? { ...node.textBinding, sourceNodeId: idMap.get(node.textBinding.sourceNodeId)! }
        : undefined,
    ...(node.toggleBinding
      ? {
          toggleBinding: {
            ...(node.toggleBinding.hiddenWhenCheckedNodeIds
              ? {
                  hiddenWhenCheckedNodeIds: node.toggleBinding.hiddenWhenCheckedNodeIds.flatMap(
                    (id) => (idMap.has(id) ? [idMap.get(id)!] : []),
                  ),
                }
              : {}),
            ...(node.toggleBinding.visibleNodeIds
              ? {
                  visibleNodeIds: node.toggleBinding.visibleNodeIds.flatMap((id) =>
                    idMap.has(id) ? [idMap.get(id)!] : [],
                  ),
                }
              : {}),
            visibleNodeId: node.toggleBinding.visibleNodeId
              ? idMap.get(node.toggleBinding.visibleNodeId)
              : undefined,
            exclusiveWith: node.toggleBinding.exclusiveWith.flatMap((id) =>
              idMap.has(id) ? [idMap.get(id)!] : [],
            ),
          },
        }
      : {}),
    ...(node.flow
      ? {
          flow: {
            ...node.flow,
            startScreenId: idMap.get(node.flow.startScreenId) ?? '',
            screens: node.flow.screens.map((screen) => ({
              ...screen,
              nodeId: idMap.get(screen.nodeId) ?? screen.nodeId,
            })),
          },
        }
      : {}),
    ...(node.overlay
      ? {
          overlay: {
            ...node.overlay,
            ownerFrameId: idMap.get(node.overlay.ownerFrameId) ?? node.overlay.ownerFrameId,
          },
        }
      : {}),
    annotations: node.annotations?.map((annotation) => ({ ...annotation, id: uuidv4() })),
    interactions: node.interactions?.flatMap((interaction) => {
      const targetNodeId = idMap.get(interaction.targetNodeId)

      const fieldId =
        interaction.condition?.source.kind === 'field'
          ? idMap.get(interaction.condition.source.nodeId)
          : undefined

      const otherwiseId = interaction.otherwise
        ? idMap.get(interaction.otherwise.targetNodeId)
        : undefined

      if (
        !targetNodeId ||
        (interaction.otherwise && !otherwiseId) ||
        (interaction.condition?.source.kind === 'field' && !fieldId)
      ) {
        return []
      }

      return [
        {
          ...interaction,
          id: uuidv4(),
          targetNodeId,
          ...(interaction.condition
            ? {
                condition: {
                  ...interaction.condition,
                  source:
                    interaction.condition.source.kind === 'field'
                      ? { kind: 'field' as const, nodeId: fieldId! }
                      : interaction.condition.source,
                },
              }
            : {}),
          ...(interaction.otherwise
            ? { otherwise: { ...interaction.otherwise, targetNodeId: otherwiseId! } }
            : {}),
        },
      ]
    }),
    children: node.children.map(getCloneNode),
    ...(node.slots
      ? {
          slots: Object.fromEntries(
            Object.entries(node.slots).map(([key, items]) => [key, items.map(getCloneNode)]),
          ),
        }
      : {}),
  })

  const copies = plainNodes.map(getCloneNode)

  // Reusable fragments cannot keep frame ownership outside their copied tree.
  reconcileFlows(copies)

  return copies
}
