import { type ChangeEvent, type KeyboardEvent, useEffect, useState } from 'react'
import { Box, Group, Input, Text } from '@root/components/common'
import { ViewportSelect } from '@root/components/Editor/ViewportSelect'
import { VIEWPORT_PRESETS } from '@root/constants/canvas/viewportPresets'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'

import styles from './styles.module.scss'

const MIN_CANVAS_WIDTH = 320
const MAX_CANVAS_WIDTH = 1920
const DEFAULT_CANVAS_WIDTH = 1440

export const ResponsiveToolbar = () => {
  const { translate } = useBuilderI18n()
  const isPreview = useEditorStore((state) => state.previewMode)
  const canvasWidth = useEditorStore((state) => state.canvasWidth)
  const setCanvasWidth = useEditorStore((state) => state.setCanvasWidth)
  const [customWidth, setCustomWidth] = useState<string>(canvasWidth ? String(canvasWidth) : '')

  // Sync custom width input when canvasWidth changes from presets
  useEffect(() => {
    if (canvasWidth) {
      setCustomWidth(String(canvasWidth))
    }
  }, [canvasWidth])

  const handleCustomWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomWidth(event.target.value)
  }

  const handleCustomWidthBlur = () => {
    let width = parseInt(customWidth, 10)

    if (!isNaN(width)) {
      if (width < MIN_CANVAS_WIDTH) {
        width = MIN_CANVAS_WIDTH
      }

      if (width > MAX_CANVAS_WIDTH) {
        width = MAX_CANVAS_WIDTH
      }

      setCustomWidth(String(width))

      setCanvasWidth(width)
    } else {
      setCustomWidth(canvasWidth ? String(canvasWidth) : '')
    }
  }

  const handleCustomWidthKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleCustomWidthBlur()
    }
  }

  if (!isPreview) {
    return null
  }

  return (
    <Box data-designer-chrome className={styles.toolbar}>
      <Group isWrapping className={styles.toolbar__controls} gap='xs'>
        <Box className={styles.toolbar__deviceSelect}>
          <ViewportSelect
            value={VIEWPORT_PRESETS.find((preset) => preset.width === canvasWidth)?.key ?? 'custom'}
            customWidth={
              VIEWPORT_PRESETS.some((preset) => preset.width === canvasWidth)
                ? undefined
                : (canvasWidth ?? DEFAULT_CANVAS_WIDTH)
            }
            onChange={(key) =>
              setCanvasWidth(VIEWPORT_PRESETS.find((preset) => preset.key === key)!.width)
            }
          />
        </Box>

        <Box className={styles.toolbar__divider} />

        <Box className={styles.toolbar__inputGroup}>
          <Input
            aria-label={translate('toolbar.customWidth')}
            className={styles.toolbar__widthInput}
            placeholder='100%'
            value={customWidth}
            onBlur={handleCustomWidthBlur}
            onChange={handleCustomWidthChange}
            onKeyDown={handleCustomWidthKeyDown}
          />
          <Text color='secondary' size='xs'>
            px
          </Text>
        </Box>
      </Group>
    </Box>
  )
}
