import type { CSSProperties } from 'react'
import { getAdapter } from '@root/adapters'
import { useCanvasView } from '@root/contexts/CanvasViewContext/hooks/useCanvasView'
import { useItemData } from '@root/contexts/ItemDataContext/hooks/useItemData'
import { getBoundProps } from '@root/contexts/ItemDataContext/utils/getBoundProps'
import { useBoundText } from '@root/hooks/useBoundText'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { getAdapterBackgroundColor } from '@root/utils/colorTokens/getAdapterBackgroundColor'
import { evaluateStateRule } from '@root/utils/conditions/componentState'
import { getTogglePeers } from '@root/utils/conditions/toggleBindings'
import { getNodeSizingStyle } from '@root/utils/layout/getNodeSizingStyle'
import { isDesignNodeHidden } from '@root/utils/rendering/isDesignNodeHidden'
import { getPropsAtWidth } from '@root/utils/responsive/getPropsAtWidth'

import { useSlotElements } from './useSlotElements'

export const useNodeRendererState = (
  node: DesignNode,
  layoutParent: DesignNode | undefined,
  isDragging: boolean,
  selectionProxyId: string | undefined,
) => {
  const showContainerBorders = useEditorStore((state) => state.outlineMode !== 'selection')

  const isSelected = useEditorStore((state) =>
    state.selectedNodeIds.includes(selectionProxyId ?? node.id),
  )

  const adapterId = useEditorStore((state) => state.adapterId)
  const globalWidth = useEditorStore((state) => state.canvasWidth)
  const view = useCanvasView()
  const canvasWidth = view?.width ?? globalWidth
  const previewMode = useEditorStore((state) => state.previewMode)
  const prototypeHiddenNodeIds = useEditorStore((state) => state.prototypeHiddenNodeIds)
  const boundVisibility = useEditorStore((state) => state.prototypeFieldVisibility[node.id])

  const stateVisible = useEditorStore((state) =>
    node.stateRules?.visibleWhen
      ? evaluateStateRule(node.stateRules.visibleWhen, state.prototypeValues)
      : undefined,
  )

  const stateEnabled = useEditorStore((state) =>
    node.stateRules?.enabledWhen
      ? evaluateStateRule(node.stateRules.enabledWhen, state.prototypeValues)
      : undefined,
  )

  const prototypeValue = useEditorStore((state) => state.prototypeValues[node.id])
  const runNodeInteractions = useEditorStore((state) => state.runNodeInteractions)
  const setPrototypeValue = useEditorStore((state) => state.setPrototypeValue)
  const item = useItemData()
  const boundText = useBoundText(node)
  const resolvedProps = getPropsAtWidth(node, canvasWidth, registry[node.type])

  const boundProps = getBoundProps(
    boundText === undefined ? resolvedProps : { ...resolvedProps, children: boundText },
    item,
  )

  const slotElements = useSlotElements(node, selectionProxyId)

  const isDesignHidden = useEditorStore((state) =>
    isDesignNodeHidden(state.nodes, node, state.editingFlowScreenId, state.previewMode),
  )

  const hasTogglePeers = useEditorStore((state) =>
    Boolean(
      state.previewMode &&
      typeof registry[node.type]?.previewValue?.emptyValue === 'boolean' &&
      getTogglePeers(state.nodes, node.id).length,
    ),
  )

  const meta = registry[node.type]

  const isPrototypeHidden =
    previewMode &&
    (stateVisible !== undefined
      ? !stateVisible
      : boundVisibility !== undefined
        ? !boundVisibility
        : prototypeHiddenNodeIds.includes(node.id))

  const hasClickInteraction = node.interactions?.some((item) => item.trigger === 'click')
  const hasChangeInteraction = node.interactions?.some((item) => item.trigger === 'change')

  const frameSurface =
    node.type === 'designerFrame'
      ? ({
          '--designer-frame-background': getAdapterBackgroundColor(getAdapter(adapterId)),
        } as CSSProperties)
      : {}

  const mergedStyle: CSSProperties = {
    ...frameSurface,
    ...getNodeSizingStyle(node, layoutParent, canvasWidth, registry),
    ...(!previewMode ? { userSelect: 'none' as const } : {}),
    ...(showContainerBorders && !previewMode && meta?.isContainer
      ? { outline: '1px dashed var(--designer-border-light)', outlineOffset: '-1px' }
      : {}),
    ...(isDragging ? { opacity: 0.3, outline: '2px dashed var(--designer-info)' } : {}),
    ...(isPrototypeHidden || isDesignHidden ? { display: 'none' } : {}),
  }

  // Pass rootClassName so each adapter can apply it to its root DOM element.
  // This is the library-agnostic contract — the mechanism is adapter's responsibility.
  const rootClassName = `design-node-${node.id}`

  const componentProps: Record<string, unknown> = {
    ...boundProps,
    ...(previewMode && stateEnabled !== undefined ? { disabled: !stateEnabled } : {}),
  }

  if (
    previewMode &&
    !item &&
    meta?.previewValue &&
    typeof meta.previewValue.emptyValue === 'boolean' &&
    typeof prototypeValue === 'boolean' &&
    (node.toggleBinding?.visibleNodeId ||
      node.toggleBinding?.visibleNodeIds?.length ||
      hasTogglePeers)
  ) {
    delete componentProps[meta.previewValue.defaultProp]

    componentProps[meta.previewValue.prop] = prototypeValue
  }

  const interactionProps = previewMode
    ? {
        ...(hasClickInteraction
          ? { onClick: () => runNodeInteractions(node.id, 'click', node.interactions) }
          : {}),
        ...(hasChangeInteraction || meta?.previewValue
          ? {
              [meta?.previewValue?.eventProp ?? 'onChange']: (...args: unknown[]) => {
                const value = meta?.previewValue?.read(...args)

                if (!item && value !== undefined) {
                  setPrototypeValue(node.id, value)
                }

                if (hasChangeInteraction) {
                  runNodeInteractions(node.id, 'change', node.interactions)
                }
              },
            }
          : {}),
      }
    : {}

  return {
    meta,
    isSelected,
    previewMode,
    boundProps,
    slotElements,
    rootClassName,
    componentProps,
    interactionProps,
    mergedStyle,
  }
}
