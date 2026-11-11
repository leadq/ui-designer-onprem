import { createElement, Fragment, type ReactNode, useCallback } from 'react'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { getAllNodes, getFlowOwner } from '@root/utils/flows/flowModel'
import { getOverlaySurface } from '@root/utils/flows/getOverlaySurface'

import { DesignWindow } from '../DesignWindow'

import { useOverlayReturnFocus } from './useOverlayReturnFocus'

export interface PreviewWindowProps {
  node: DesignNode
  children: ReactNode
}

export const PreviewWindow = ({ node, children }: PreviewWindowProps) => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const previewMode = useEditorStore((state) => state.previewMode)
  const triggerId = useEditorStore((state) => state.prototypeOverlayTriggerIds[node.id])
  const hiddenIds = useEditorStore((state) => state.prototypeHiddenNodeIds)
  const runInteractions = useEditorStore((state) => state.runNodeInteractions)
  const owner = getFlowOwner(nodes, node.id)

  const isWindow = owner?.flow?.screens.some(
    (screen) => screen.nodeId === node.id && screen.kind === 'overlay',
  )

  const handleClose = useCallback(
    () =>
      runInteractions(node.id, 'click', [
        { id: 'window-close', trigger: 'click', action: 'closeOverlay', targetNodeId: node.id },
      ]),
    [node.id, runInteractions],
  )

  const getReturnFocus = useCallback(() => {
    if (!triggerId) {
      return null
    }

    const trigger = document.querySelector<HTMLElement>(`[data-node-id="${CSS.escape(triggerId)}"]`)

    return trigger?.matches('button, input, select, textarea, a[href], [tabindex]')
      ? trigger
      : (trigger?.querySelector<HTMLElement>(
          'button, input, select, textarea, a[href], [tabindex]',
        ) ?? null)
  }, [triggerId])

  const isOwnerHidden = Boolean(
    (owner && hiddenIds.includes(owner.id)) ||
    (node.overlay && hiddenIds.includes(node.overlay.ownerFrameId)),
  )

  const opened = Boolean(isWindow && previewMode && !hiddenIds.includes(node.id) && !isOwnerHidden)

  const hasOtherOpenModal = Boolean(
    isWindow &&
    previewMode &&
    getAllNodes(nodes).some((other) => {
      if (
        other.id === node.id ||
        hiddenIds.includes(other.id) ||
        other.overlay?.presentation === 'notification'
      ) {
        return false
      }

      const flow = getFlowOwner(nodes, other.id)

      return (
        flow?.flow?.screens.some(
          (screen) => screen.nodeId === other.id && screen.kind === 'overlay',
        ) &&
        !hiddenIds.includes(flow.id) &&
        (!other.overlay || !hiddenIds.includes(other.overlay.ownerFrameId))
      )
    }),
  )

  useOverlayReturnFocus(
    opened,
    getReturnFocus,
    node.overlay?.presentation !== 'notification' && !hasOtherOpenModal,
  )

  if (!isWindow) {
    return createElement(Fragment, null, children)
  }

  if (!previewMode) {
    return node.overlay ? (
      <DesignWindow node={node}>{children}</DesignWindow>
    ) : (
      createElement(Fragment, null, children)
    )
  }

  const Surface = getOverlaySurface(node, registry)

  return Surface ? (
    <Surface
      closeLabel={translate('general.close')}
      designMode={false}
      opened={opened}
      title={node.label ?? ''}
      withBackdrop={node.overlay?.withBackdrop !== false}
      onClose={handleClose}
    >
      {children}
    </Surface>
  ) : (
    createElement(Fragment, null, children)
  )
}
