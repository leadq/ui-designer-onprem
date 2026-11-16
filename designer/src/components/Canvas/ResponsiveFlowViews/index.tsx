import { useEffect } from 'react'
import { useResponsiveViewStore } from '@root/components/Canvas/stores/responsiveViewStore'
import { Box, Button, Menu, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { BREAKPOINT_MAP } from '@root/constants/breakpoints'
import { VIEWPORT_PRESETS } from '@root/constants/canvas/viewportPresets'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { getFlowOwner } from '@root/utils/flows/flowModel'

import { ResponsiveViewRow } from '../ResponsiveViewRow'

import styles from './styles.module.scss'

export interface ResponsiveFlowViewsProps {
  flow: DesignNode
  nodes: DesignNode[]
}

const DEFAULT_WIDTHS: number[] = [BREAKPOINT_MAP.xl]

export const ResponsiveFlowViews = ({ flow, nodes }: ResponsiveFlowViewsProps) => {
  const { translate } = useBuilderI18n()
  const widths = useResponsiveViewStore((state) => state.widthsByFlow[flow.id] ?? DEFAULT_WIDTHS)
  const addView = useResponsiveViewStore((state) => state.addView)
  const activeWidth = useEditorStore((state) => state.canvasWidth) ?? BREAKPOINT_MAP.xl
  const activeFrame = useEditorStore((state) => state.editingFlowScreenId)
  const isActiveFlow = getFlowOwner(nodes, activeFrame ?? '')?.id === flow.id
  const setCanvasWidth = useEditorStore((state) => state.setCanvasWidth)
  const ids = new Set(flow.flow?.screens.map((screen) => screen.nodeId))
  const frames = nodes.filter((node) => ids.has(node.id))
  const hasMultipleFlows = nodes.filter((node) => node.flow?.layout === 'root').length > 1

  useEffect(() => {
    if (isActiveFlow && !widths.includes(activeWidth)) {
      addView(flow.id, activeWidth)
    }
  }, [activeWidth, addView, flow.id, isActiveFlow, widths])

  const handleAddView = (width: number) => {
    if (width && !widths.includes(width)) {
      addView(flow.id, width)

      useEditorStore.getState().editFlowScreen(flow.flow?.startScreenId ?? null)

      setCanvasWidth(width)
    }
  }

  return (
    <Box className={styles.responsiveFlowViews} data-flow-views={flow.id}>
      {hasMultipleFlows ? (
        <Text className={styles.responsiveFlowViews__title} weight={600}>
          {flow.label}
        </Text>
      ) : null}
      {[...widths]
        .sort((first, second) => second - first)
        .map((width, index) => (
          <ResponsiveViewRow
            key={width}
            flowId={flow.id}
            isFrameSelectionVisible={index === 0}
            nodes={frames}
            width={width}
          />
        ))}
      <Box
        data-canvas-control
        data-designer-chrome
        data-view-add
        className={styles.responsiveFlowViews__add}
      >
        <Menu position='bottom-start' width={236}>
          <Menu.Target>
            <Button
              isFullWidth
              aria-label={translate('responsive.addView')}
              className={styles.responsiveFlowViews__addButton}
              isDisabled={VIEWPORT_PRESETS.every((item) => widths.includes(item.width))}
              variant='outline'
            >
              + {translate('responsive.addView')}
              <EditorIcon name='chevronDown' size='1em' />
            </Button>
          </Menu.Target>
          <Menu.Dropdown data-canvas-control>
            {VIEWPORT_PRESETS.filter((item) => !widths.includes(item.width)).map((item) => (
              <Menu.Item
                key={item.width}
                data-view-option={item.width}
                onClick={() => handleAddView(item.width)}
              >
                {translate(item.label)}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Box>
    </Box>
  )
}
