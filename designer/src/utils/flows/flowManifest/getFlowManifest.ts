import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import {
  getConditionNodes,
  getExamples,
  getInitialValues,
} from '@root/utils/conditions/conditionModel'
import {
  getInitialToggleValues,
  getToggleManifest,
  getToggleVisibility,
} from '@root/utils/conditions/toggleBindings'

import { getInitialHiddenIds } from '../flowModel'
import { getFlowScopes } from '../flowScopes'

import { getFlowGraph } from './getFlowGraph'

const FLOW_MANIFEST_VERSION = 5

/** Data only: no adapter, router, validation service or form framework assumptions. */
export const getFlowManifest = (nodes: DesignNode[], registry: Registry = {}) => {
  const initialValues = getInitialToggleValues(nodes, getInitialValues(nodes, registry))
  const { all, flows, states, connections, contexts } = getFlowGraph(nodes)
  const { pages, formScopes, issues, getPageId } = getFlowScopes(states, connections, contexts)

  return {
    version: FLOW_MANIFEST_VERSION,
    execution: 'declarative-preview' as const,
    visibility: 'keep-mounted' as const,
    fieldBehaviors: {
      ...getToggleManifest(nodes),
      initialVisibility: getToggleVisibility(nodes, initialValues),
    },
    stateMachine: {
      model: 'visibility-set' as const,
      initial: { hiddenNodeIds: [...new Set(getInitialHiddenIds(nodes))] },
      dispatch: 'source-node-and-trigger' as const,
      ruleOrder: 'connection-order' as const,
      effectOrder: 'listed-order' as const,
      guards: 'typed-comparisons' as const,
      evaluation: 'once-per-interaction-before-effects' as const,
      propagation: 'native-react-bubbling' as const,
      fieldUpdates: 'value-then-exclusions-then-bound-visibility-before-change-rules' as const,
    },
    exampleResults: getExamples(nodes),
    componentStates: all
      .filter((node) => node.stateRules)
      .map((node) => ({
        targetNodeId: node.id,
        ...node.stateRules,
        evaluation: 'on-every-field-change' as const,
        invalidInput: 'hidden-or-disabled' as const,
      })),
    textBindings: all.flatMap((node) =>
      node.textBinding
        ? [
            {
              targetNodeId: node.id,
              targetProp: 'children',
              sourceNodeId: node.textBinding.sourceNodeId,
              emptyText: String(node.props.children ?? ''),
            },
          ]
        : [],
    ),
    fieldInputs: getConditionNodes(nodes).flatMap((node) => {
      const binding = registry[node.type]?.previewValue

      return binding
        ? [
            {
              nodeId: node.id,
              prop: binding.prop,
              defaultProp: binding.defaultProp,
              eventProp: binding.eventProp,
              initialValue: initialValues[node.id] ?? null,
            },
          ]
        : []
    }),
    flows,
    pages,
    states: states.map((state) => ({
      ...state,
      pageId: getPageId(state.overlay?.ownerFrameId ?? state.id),
      baseScreenIds: [...(contexts.get(state.id) ?? [])].sort(),
      ...(state.kind === 'overlay'
        ? {
            dismiss: {
              triggers:
                state.overlay?.presentation === 'notification'
                  ? ['closeButton']
                  : ['escape', 'backdrop', 'closeButton'],
              effects: [{ operation: 'hide' as const, nodeIds: [state.id] }],
              restoreFocusTo: 'opening-node' as const,
            },
          }
        : {}),
    })),
    nodes: all.map((node) => ({
      id: node.id,
      parentId:
        all.find((parent) =>
          [...parent.children, ...Object.values(parent.slots ?? {}).flat()].includes(node),
        )?.id ?? null,
      type: node.type,
      ...(node.type === 'designerFrame'
        ? {
            role: 'screen-context' as const,
            contentNodeIds: node.children.map((child) => child.id),
          }
        : node.type === 'designerFlow'
          ? { role: 'flow-context' as const }
          : {}),
      name: node.label ?? node.id,
      notes: node.notes ?? '',
      annotations: node.annotations ?? [],
      initiallyHidden: node.prototypeHidden ?? false,
    })),
    connections: connections.map((rule) => ({
      ...rule,
      sourcePageIds: [
        ...new Set(
          [...(contexts.get(rule.sourceStateId ?? '') ?? [])].map(getPageId).filter(Boolean),
        ),
      ],
      targetPageId: getPageId(rule.targetNodeId),
    })),
    formScopes,
    issues,
  }
}
