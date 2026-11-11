import type { DesignOverlay } from '@root/types/flow'

export const getParsedOverlay = (value: unknown): DesignOverlay => {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid modal configuration')
  }

  const overlay = value as Record<string, unknown>

  if (
    typeof overlay.ownerFrameId !== 'string' ||
    !['custom', 'confirmation', 'smsOtp'].includes(String(overlay.kind)) ||
    typeof overlay.initiallyOpen !== 'boolean'
  ) {
    throw new Error('Invalid modal configuration')
  }

  if (
    overlay.presentation !== undefined &&
    !['modal', 'notification'].includes(String(overlay.presentation))
  ) {
    throw new Error('Invalid overlay presentation')
  }

  if (overlay.withBackdrop !== undefined && typeof overlay.withBackdrop !== 'boolean') {
    throw new Error('Invalid modal backdrop')
  }

  return {
    ...(overlay.presentation
      ? { presentation: overlay.presentation as DesignOverlay['presentation'] }
      : {}),
    ownerFrameId: overlay.ownerFrameId,
    kind: overlay.kind as DesignOverlay['kind'],
    initiallyOpen: overlay.initiallyOpen,
    ...(overlay.withBackdrop !== undefined ? { withBackdrop: overlay.withBackdrop } : {}),
  }
}
