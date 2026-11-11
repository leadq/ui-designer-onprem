import { Box, Button } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { fitCanvas } from '@root/utils/canvas/navigation'
import { getNextCanvasScale, getZoomLevelFromScale, MIN_ZOOM_LEVEL } from '@root/utils/canvas/zoom'

import styles from './styles.module.scss'

const MAX_ZOOM_LEVEL = 2
const PERCENT_SCALE = 100

export interface CanvasZoomControlsProps {
  zoom: number
  onZoomChange: (zoom: number) => void
}

export const CanvasZoomControls = ({ zoom, onZoomChange }: CanvasZoomControlsProps) => {
  const { translate } = useBuilderI18n()
  const level = getZoomLevelFromScale(zoom)
  const handleFitToScreen = () => fitCanvas(true)
  const handleFitToScreenClick = handleFitToScreen

  return (
    <Box className={styles.canvasZoomControls}>
      <EditorTooltip label={translate('toolbar.fit')} position='left'>
        <Button
          aria-label={translate('toolbar.fit')}
          className={styles.canvasZoomControls__button}
          size='sm'
          variant='ghost'
          onClick={handleFitToScreenClick}
        >
          <EditorIcon aria-hidden='true' name='fit' size={18} strokeWidth={1.8} />
        </Button>
      </EditorTooltip>
      <Box aria-hidden='true' className={styles.canvasZoomControls__divider} />
      <EditorTooltip label={translate('canvas.zoomOut')} position='left'>
        <Button
          aria-label={translate('canvas.zoomOut')}
          className={styles.canvasZoomControls__button}
          isDisabled={level <= MIN_ZOOM_LEVEL + Number.EPSILON}
          size='sm'
          variant='ghost'
          onClick={() => onZoomChange(getNextCanvasScale(zoom, -1))}
        >
          −
        </Button>
      </EditorTooltip>
      <EditorTooltip label={translate('canvas.resetZoom')} position='left'>
        <Button
          aria-label={translate('canvas.resetZoom')}
          className={styles.canvasZoomControls__value}
          size='sm'
          variant='ghost'
          onClick={() => onZoomChange(1)}
        >
          {Math.round(level * PERCENT_SCALE)}%
        </Button>
      </EditorTooltip>
      <EditorTooltip label={translate('canvas.zoomIn')} position='left'>
        <Button
          aria-label={translate('canvas.zoomIn')}
          className={styles.canvasZoomControls__button}
          isDisabled={level >= MAX_ZOOM_LEVEL}
          size='sm'
          variant='ghost'
          onClick={() => onZoomChange(getNextCanvasScale(zoom, 1))}
        >
          +
        </Button>
      </EditorTooltip>
    </Box>
  )
}
