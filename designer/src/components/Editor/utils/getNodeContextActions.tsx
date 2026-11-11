import { EditorIcon } from '@root/components/common/EditorIcon'
import type { BuilderI18nContextValue } from '@root/contexts/BuilderI18nContext/context'
import { registry } from '@root/registry'
import { useActionEditorStore } from '@root/stores/actionEditorStore'
import { useEditorStore } from '@root/stores/editor'
import type { ContextMenuAction } from '@root/types/contextMenu'
import type { DesignNode } from '@root/types/document'
import { getAlignmentLayoutPatch } from '@root/utils/layout/getAlignmentLayoutPatch'

interface NodeContextOptions {
  node: DesignNode | null | undefined
  nodeId: string | null
  parent: DesignNode | null | undefined
  width: number | null
  isFrame: boolean
  hasMultiSelection: boolean
  selection: string[]
  frames: Set<string>
  modifier: string
  translate: BuilderI18nContextValue['translate']
}

export const getNodeContextActions = ({
  node,
  nodeId,
  parent,
  width,
  isFrame,
  hasMultiSelection,
  selection,
  frames,
  modifier,
  translate,
}: NodeContextOptions) => {
  const store = useEditorStore.getState
  const design: ContextMenuAction[] = []
  const flow: ContextMenuAction[] = []
  const structure: ContextMenuAction[] = []
  const general: ContextMenuAction[] = []

  if (node && nodeId) {
    if (!hasMultiSelection && !isFrame && !node.overlay && parent) {
      for (const [id, axis, alignment, label, iconName] of [
        ['left', 'horizontal', 'start', 'context.alignLeft', 'alignLeft'],
        ['horizontal', 'horizontal', 'center', 'context.centerHorizontal', 'alignCenterHorizontal'],
        ['right', 'horizontal', 'end', 'context.alignRight', 'alignRight'],
        ['vertical', 'vertical', 'center', 'context.centerVertical', 'alignCenterVertical'],
      ] as const) {
        design.push({
          id,
          label: translate(label),
          icon: <EditorIcon name={iconName} size={16} />,
          disabled: !getAlignmentLayoutPatch(node, parent, axis, width, registry, alignment),
          onSelect: () => store().alignNode(nodeId, axis, alignment),
        })
      }
    }

    if (!isFrame && !node.overlay) {
      design.push({
        id: 'state',
        label: translate('componentState.title'),
        icon: <EditorIcon name='visibility' size={16} />,
        onSelect: () => useActionEditorStore.getState().openState(selection),
      })
    }

    if (node.type !== 'designerFrame') {
      design.push({
        id: 'save',
        label: translate('savedDesign.saveAction'),
        icon: <EditorIcon name='save' size={16} />,
        onSelect: () => store().requestSaveDesign(selection),
      })
    }

    if (node.type !== 'designerFrame') {
      flow.push({
        id: 'connect',
        label: translate('action.add'),
        icon: <EditorIcon name='arrowRight' size={16} />,
        onSelect: () => useActionEditorStore.getState().open(nodeId),
      })
    }

    if (!hasMultiSelection && !isFrame) {
      structure.push({
        id: 'wrap',
        label: translate('context.wrap'),
        icon: <EditorIcon name='wrap' size={16} />,
        onSelect: () => store().wrapInContainer(nodeId),
      })
    }

    if (!hasMultiSelection && parent && !frames.has(parent.id)) {
      structure.push({
        id: 'moveOut',
        label: translate('context.moveOut'),
        icon: <EditorIcon name='moveOut' size={16} />,
        onSelect: () => store().moveNodeOutOfContainer(nodeId),
      })
    }

    if (
      !hasMultiSelection &&
      !isFrame &&
      registry[node.type]?.isContainer &&
      node.children.length
    ) {
      structure.push({
        id: 'unwrap',
        label: translate('context.unwrap'),
        icon: <EditorIcon name='unwrap' size={16} />,
        onSelect: () => store().unwrapContainer(nodeId),
      })
    }

    if (!isFrame) {
      general.push({
        id: 'copy',
        label: translate('context.copy'),
        icon: <EditorIcon name='copy' size={16} />,
        shortcut: `${modifier}C`,
        disabled: hasMultiSelection,
        onSelect: () => store().copyNode(nodeId),
      })
    }
  }

  return { design, flow, structure, general }
}
