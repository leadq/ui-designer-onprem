import { ButtonBase } from '@root/components/common/ButtonBase'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import { type ResizeDirection, useResizeInteraction } from './useResizeInteraction'

import styles from './styles.module.scss'

interface ResizeHandlesProps {
  nodeId: string
  rect: DOMRect
}

const DIRECTIONS: ResizeDirection[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
const isSideHandle = (direction: ResizeDirection): boolean => direction.length === 1

export const ResizeHandles = ({ nodeId, rect }: ResizeHandlesProps) => {
  const { translate } = useBuilderI18n()
  const { measurement, handlePointerDown, handleFill } = useResizeInteraction(nodeId, rect)

  return (
    <>
      {measurement ? <div className={styles.resizeHandles__measurement}>{measurement}</div> : null}
      {DIRECTIONS.map((direction) => (
        <EditorTooltip
          key={direction}
          label={
            isSideHandle(direction)
              ? translate('resize.doubleClickHint')
              : translate('resize.dragHint')
          }
        >
          <ButtonBase
            aria-label={translate('resize.handle', { direction })}
            className={`${styles.resizeHandles__handle} ${styles[`resizeHandles__handle--${direction}`]}`}
            type='button'
            onPointerDown={(event) => handlePointerDown(direction, event)}
            onDoubleClick={(event) => {
              event.preventDefault()

              event.stopPropagation()

              if (isSideHandle(direction)) {
                handleFill(direction)
              }
            }}
          />
        </EditorTooltip>
      ))}
    </>
  )
}
