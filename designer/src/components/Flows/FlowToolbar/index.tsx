import { DeviceFramesToggle } from '@root/components/Canvas/DeviceFramesToggle'
import { Box, Button, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { ReferenceButton } from '@root/components/References/ReferenceButton'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import { focusFrame } from '@root/utils/canvas/navigation'
import { getAllNodes } from '@root/utils/flows/flowModel'
import { getNextFrameLabel } from '@root/utils/frames/frameWorkspace'

import styles from './styles.module.scss'

export interface FlowToolbarProps {
  onManageBehaviors: () => void
}

export const FlowToolbar = ({ onManageBehaviors }: FlowToolbarProps) => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const activeId = useEditorStore((state) => state.editingFlowScreenId)
  const editScreen = useEditorStore((state) => state.editFlowScreen)
  const selectedFrameIds = useEditorStore((state) => state.selectedFrameIds)
  const previewMode = useEditorStore((state) => state.previewMode)
  const addFlow = useEditorStore((state) => state.addFlow)
  const addScreen = useEditorStore((state) => state.addFlowScreen)
  const all = getAllNodes(nodes)
  const flows = all.filter((node) => node.flow)

  const handleAddScreen = () => {
    const owner =
      flows.find((flow) => flow.flow?.screens.some((screen) => screen.nodeId === activeId)) ??
      flows[0]

    if (owner) {
      addScreen(owner.id, 'screen', getNextFrameLabel(nodes, translate('flow.newFrameName')))
    } else {
      addFlow(
        translate('flow.screenGroup'),
        getNextFrameLabel(nodes, translate('flow.newFrameName')),
      )
    }
  }

  const handleSelectScreen = (id: string) => {
    editScreen(id)

    focusFrame(id)
  }

  if (previewMode) {
    return null
  }

  const handleAddScreenClick = handleAddScreen

  return (
    <Box aria-label={translate('flow.screens')} className={styles.flowToolbar}>
      <Box className={styles.flowToolbar__screens}>
        {flows
          .flatMap((flow) => flow.flow!.screens.filter((screen) => screen.kind === 'screen'))
          .map((screen) => {
            const node = all.find((item) => item.id === screen.nodeId)

            return (
              <EditorTooltip key={screen.nodeId} label={node?.label}>
                <Button
                  aria-label={node?.label}
                  aria-pressed={activeId === screen.nodeId}
                  className={styles.flowToolbar__screen}
                  data-frame-selected={selectedFrameIds.includes(screen.nodeId)}
                  size='sm'
                  variant='ghost'
                  onClick={() => handleSelectScreen(screen.nodeId)}
                >
                  {selectedFrameIds.includes(screen.nodeId) ? (
                    <EditorIcon aria-hidden name='selected' size={16} />
                  ) : (
                    <EditorIcon aria-hidden name='screen' size={16} />
                  )}
                  <Text className={styles.flowToolbar__name}>
                    {node?.label ?? translate('flow.screen')}
                  </Text>
                </Button>
              </EditorTooltip>
            )
          })}
      </Box>
      <Box className={styles.flowToolbar__actions}>
        <DeviceFramesToggle />
        <ReferenceButton />
        <EditorTooltip label={translate('header.allBehaviors')}>
          <Button
            aria-label={translate('header.allBehaviors')}
            className={styles.flowToolbar__behaviors}
            size='sm'
            variant='ghost'
            onClick={onManageBehaviors}
          >
            <EditorIcon aria-hidden name='note' size={16} />
            <Text className={styles.flowToolbar__actionLabel}>
              {translate('header.allBehaviors')}
            </Text>
          </Button>
        </EditorTooltip>
        <Button
          className={styles.flowToolbar__add}
          size='sm'
          variant='outline'
          onClick={handleAddScreenClick}
        >
          <EditorIcon aria-hidden name='add' size={16} />
          {translate('flow.addScreen')}
        </Button>
      </Box>
    </Box>
  )
}
