import type { DesignOverlay } from '@root/types/flow'

/** Designer-owned frame overlays. Selecting a window always opens it for design; preview waits for an explicit action. Native library components use adapter defaultProps. */
export const FLOW_OVERLAY_DEFAULTS: Omit<DesignOverlay, 'ownerFrameId'> = {
  kind: 'custom',
  initiallyOpen: false,
  withBackdrop: true,
}
