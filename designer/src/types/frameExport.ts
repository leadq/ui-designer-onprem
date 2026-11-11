export interface FrameExportSelection {
  selectedFrameIds: string[]
  selectedNodeIds: string[]
  selectedReferenceIds?: string[]
  previewMode?: boolean
}

export interface FrameExportEligibility {
  eligible: boolean
  frameIds: string[]
  code:
    | 'READY'
    | 'FRAME_SELECTION_REQUIRED'
    | 'MIXED_SELECTION'
    | 'INCOMPLETE_FRAME_SELECTION'
    | 'STALE_FRAME_SELECTION'
    | 'PREVIEW_DISABLED'
}
