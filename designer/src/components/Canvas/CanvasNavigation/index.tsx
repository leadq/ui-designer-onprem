import { Box, Button, Stack, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { InfoPopover } from '@root/components/common/InfoPopover'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { fitCanvas } from '@root/utils/canvas/navigation'

import styles from './styles.module.scss'

export interface CanvasNavigationProps {
  isHandTool: boolean
  onHandToolChange: (value: boolean) => void
}

export const CanvasNavigation = ({ isHandTool, onHandToolChange }: CanvasNavigationProps) => {
  const { translate } = useBuilderI18n()

  return (
    <Box className={styles.canvasNavigation}>
      <EditorTooltip label={translate('canvas.selectToolHint')}>
        <Button
          aria-label={translate('canvas.selectTool')}
          aria-pressed={!isHandTool}
          size='sm'
          variant={!isHandTool ? 'light' : 'ghost'}
          onClick={() => onHandToolChange(false)}
        >
          <EditorIcon name='pointer' size={17} />
        </Button>
      </EditorTooltip>
      <EditorTooltip label={translate('canvas.handToolHint')}>
        <Button
          aria-label={translate('canvas.handTool')}
          aria-pressed={isHandTool}
          size='sm'
          variant={isHandTool ? 'light' : 'ghost'}
          onClick={() => onHandToolChange(!isHandTool)}
        >
          <EditorIcon name='pan' size={17} />
        </Button>
      </EditorTooltip>
      <InfoPopover
        icon='mouse'
        isTitleVisible={false}
        label={translate('canvas.shortcutsTitle')}
        triggerLabel={translate('canvas.shortcuts')}
      >
        <Stack gap='sm'>
          <Box>
            <Text size='sm' weight={600}>
              {translate('canvas.panTitle')}
            </Text>
            <Text color='secondary' size='sm'>
              {translate('canvas.panHint')}
            </Text>
          </Box>
          <Box>
            <Text size='sm' weight={600}>
              {translate('canvas.horizontalScrollTitle')}
            </Text>
            <Text color='secondary' size='sm'>
              {translate('canvas.horizontalScrollHint')}
            </Text>
          </Box>
          <Box>
            <Text size='sm' weight={600}>
              {translate('canvas.zoomShortcutTitle')}
            </Text>
            <Text color='secondary' size='sm'>
              {translate('canvas.zoomShortcutHint')}
            </Text>
          </Box>
        </Stack>
      </InfoPopover>
      <Button size='sm' variant='ghost' onClick={() => fitCanvas(true)}>
        <EditorIcon name='screen' size={16} />
        {translate('canvas.fitFlow')}
      </Button>
    </Box>
  )
}
