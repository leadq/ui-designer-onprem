import type { DesignAnnotation, DesignNode, SlotComponent } from '@root/types/document'
import type { PreviewValue } from '@root/types/preview'

// --- PageState: the Zustand store shape ---
export interface PageState {
  adapterId: string
  nodes: DesignNode[]
  selectedNodeIds: string[]
  selectedFrameIds: string[] // Explicit full-screen selection; editor-only.
  pageName: string
  pageNotes: string // page-level developer annotation
  pageAnnotations: DesignAnnotation[]
  canvasWidth: number | null
  canvasZoom: number
  workspaceRevision: number // Editor-only: request an overview when replacing the document.
  dropTarget: { targetId: string; position: 'before' | 'after' | 'inside' } | null
  interactionState: 'idle' | 'dragging' | 'hovering'
  outlineMode: 'selection' | 'layout' | 'parent' // Editor-only visual guides
  history: DesignNode[][] // snapshot stack
  historyIndex: number
  copiedNode: DesignNode | null
  slotComponents: SlotComponent[]
  saveDesignNodeIds: string[]
  previewMode: boolean
  prototypeValues: Record<string, PreviewValue>
  prototypeFieldVisibility: Record<string, boolean>
  prototypeExamples: Record<string, string>
  prototypeConditionError: string | null
  prototypeHiddenNodeIds: string[]
  prototypeOverlayTriggerIds: Record<string, string>
  focusedContainerId: string | null // Figma-style: "entered" container
  editingFlowScreenId: string | null
}
