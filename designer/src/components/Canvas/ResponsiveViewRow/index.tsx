import { type PointerEvent, useMemo } from 'react'
import { Box, Button, Text } from '@root/components/common'
import { FrameSurface } from '@root/components/Flows/FrameSurface'
import { VIEWPORT_PRESETS } from '@root/constants/canvas/viewportPresets'
import { CanvasViewContext } from '@root/contexts/CanvasViewContext/context'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { getDeviceFrameLayout } from '@root/utils/canvas/deviceFrames/getDeviceFrameLayout'
import { getBreakpointForWidth } from '@root/utils/layout/getBreakpointForWidth'

import { DesignNodeWrapper } from '../DesignNodeWrapper'
import { DeviceFrame } from '../DeviceFrame'
import { useResponsiveViewStore } from '../stores/responsiveViewStore'

import styles from './styles.module.scss'

export interface ResponsiveViewRowProps {
  flowId: string
  isFrameSelectionVisible: boolean
  width: number
  nodes: DesignNode[]
}

export const ResponsiveViewRow = ({
  flowId,
  width,
  nodes,
  isFrameSelectionVisible,
}: ResponsiveViewRowProps) => {
  const { translate } = useBuilderI18n()
  const areDeviceFramesVisible = useResponsiveViewStore((state) => state.areDeviceFramesVisible)
  const activeWidth = useEditorStore((state) => state.canvasWidth)
  const setCanvasWidth = useEditorStore((state) => state.setCanvasWidth)
  const context = useMemo(() => ({ id: `${flowId}:${width}`, width }), [flowId, width])
  const preset = VIEWPORT_PRESETS.find((item) => item.key === getBreakpointForWidth(width))

  const handleClick = () => {
    const state = useEditorStore.getState()

    if (!nodes.some((node) => node.id === state.editingFlowScreenId)) {
      state.editFlowScreen(nodes.find((node) => !node.overlay)?.id ?? null)
    }

    setCanvasWidth(width)
  }

  const handlePointerDownCapture = (event: PointerEvent) => {
    if ((event.target as Element).closest('[data-frame-selection-control]')) {
      setCanvasWidth(width)

      return
    }

    const target = (event.target as Element).closest<HTMLElement>(
      '[data-frame-surface], [data-design-modal]',
    )

    const frameId = target?.dataset.frameSurface ?? target?.dataset.designModal
    const state = useEditorStore.getState()

    if (event.ctrlKey || event.metaKey) {
      setCanvasWidth(width)

      return
    }

    if (frameId && frameId !== state.editingFlowScreenId) {
      state.editFlowScreen(frameId)
    }

    handleClick()
  }

  const handleFocusCapture = (event: React.FocusEvent) => {
    if (
      (event.target as Element).closest('[data-frame-selection-control]') ||
      useEditorStore.getState().selectedFrameIds.length
    ) {
      setCanvasWidth(width)

      return
    }

    handleClick()
  }

  return (
    <CanvasViewContext.Provider value={context}>
      <Box
        className={styles.responsiveViewRow}
        data-device-frames-visible={areDeviceFramesVisible}
        data-view-active={activeWidth === width}
        data-view-id={context.id}
        data-view-width={width}
        style={getDeviceFrameLayout(width).style}
        onFocusCapture={handleFocusCapture}
        onPointerDownCapture={handlePointerDownCapture}
      >
        <Box data-canvas-control data-view-heading className={styles.responsiveViewRow__heading}>
          <Button
            aria-label={`${translate(preset?.label ?? 'responsive.view')} · ${width} px`}
            aria-pressed={activeWidth === width}
            className={styles.responsiveViewRow__label}
            variant='ghost'
            onClick={handleClick}
          >
            <Text className={styles.responsiveViewRow__name} weight={600}>
              {translate(preset?.label ?? 'responsive.view')}
            </Text>
            <Text className={styles.responsiveViewRow__width} color='secondary'>
              ({width}px)
            </Text>
          </Button>
        </Box>
        <Box className={styles.responsiveViewRow__frames}>
          {nodes.map((node) =>
            node.overlay ? (
              <DesignNodeWrapper key={node.id} node={node} />
            ) : (
              <FrameSurface key={node.id} isSelectionVisible={isFrameSelectionVisible} node={node}>
                <DeviceFrame width={width}>
                  <DesignNodeWrapper node={node} />
                </DeviceFrame>
              </FrameSurface>
            ),
          )}
        </Box>
      </Box>
    </CanvasViewContext.Provider>
  )
}
