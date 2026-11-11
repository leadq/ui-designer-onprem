import type { ReferenceImage, ReferencePlacement } from '@root/types/references'

const INITIAL_REFERENCE_X = 40
const REFERENCE_FRAME_STRIDE_PX = 880
const DEFAULT_REFERENCE_WIDTH = 800

export const getReferencePlacement = (image: ReferenceImage, index = 0): ReferencePlacement =>
  image.placement ?? {
    x: INITIAL_REFERENCE_X + index * REFERENCE_FRAME_STRIDE_PX,
    y: 40,
    width: Math.min(DEFAULT_REFERENCE_WIDTH, image.width),
  }
