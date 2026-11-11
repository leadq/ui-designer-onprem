export type DesignInteractionTrigger = 'click' | 'change'

export type DesignInteractionAction =
  'show' | 'hide' | 'toggle' | 'goTo' | 'openOverlay' | 'closeOverlay'

export type DesignTransitionIntent = 'formStep' | 'navigation' | 'stateChange'

export type OverlayPresentation = 'modal' | 'notification'

export interface OverlaySurfaceProps {
  opened: boolean
  designMode: boolean
  title: string
  closeLabel: string
  withBackdrop: boolean
  onClose: () => void
  children: React.ReactNode
}

export interface DesignOverlay {
  presentation?: OverlayPresentation // Legacy documents default to modal.
  ownerFrameId: string
  kind: 'custom' | 'confirmation' | 'smsOtp'
  initiallyOpen: boolean
  withBackdrop?: boolean
}

export interface DesignFlow {
  /** Root-level frames; this node holds flow metadata only. */
  layout?: 'root'
  /** Legacy import only. New documents describe intent on each connection. */
  kind?: 'form' | 'navigation'
  startScreenId: string
  screens: { nodeId: string; kind: 'screen' | 'overlay' }[]
}
