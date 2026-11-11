import { useLayoutEffect, useRef } from 'react'
import { Box, Text } from '@root/components/common'
import { ButtonBase } from '@root/components/common/ButtonBase'
import { ReferenceImageView } from '@root/components/References/CanvasReference/ReferenceImageView'
import { useReferenceGesture } from '@root/hooks/references/useReferenceGesture'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useReferenceStore } from '@root/stores/referenceStore'
import type { ReferenceImage } from '@root/types/references'
import { getReferencePlacement } from '@root/utils/references/placement'

import styles from './styles.module.scss'

export const CanvasReference = ({ image }: { image: ReferenceImage }) => {
  const { translate } = useBuilderI18n()
  const isSelected = useReferenceStore((state) => state.selectedIds.includes(image.id))
  const ref = useRef<HTMLDivElement>(null)
  const placement = getReferencePlacement(image)

  const {
    handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onKeyDown: handleKeyDown,
    onPointerCancel: handlePointerCancel,
    onLostPointerCapture: handleLostPointerCapture,
  } = useReferenceGesture(image)

  useLayoutEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    element.style.setProperty('--reference-x', `${placement.x}px`)

    element.style.setProperty('--reference-y', `${placement.y}px`)

    element.style.setProperty('--reference-width', `${placement.width}px`)

    element.style.setProperty(
      '--reference-height',
      `${(placement.width * image.height) / image.width}px`,
    )
  }, [placement.x, placement.y, placement.width, image.height, image.width])

  return (
    <Box
      ref={ref}
      aria-label={`${translate('reference.selected')}: ${image.name}`}
      className={styles.canvasReference}
      data-reference-id={image.id}
      data-selected={isSelected}
      role='group'
      tabIndex={0}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={handleKeyDown}
      onLostPointerCapture={handleLostPointerCapture}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onContextMenu={(event) => {
        event.preventDefault()

        event.stopPropagation()
      }}
    >
      <Text className={styles.canvasReference__title} size='sm'>
        {image.name}
      </Text>
      <ReferenceImageView alt={image.name} blob={image.blob} />
      {isSelected
        ? ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].map((handle) => (
            <ButtonBase
              key={handle}
              aria-label={translate('reference.resize', { direction: handle })}
              className={styles.canvasReference__handle}
              data-handle={handle}
              onPointerDown={(event) => handlePointerDown(event, handle)}
            />
          ))
        : null}
    </Box>
  )
}
