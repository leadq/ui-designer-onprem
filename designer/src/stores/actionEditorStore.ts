import { create } from 'zustand'

interface ActionEditorState {
  nodeId: string | null
  mode: 'flow' | 'state' | 'note'
  openNote: (nodeId: string) => void
  stateNodeIds: string[]
  openState: (nodeIds: string[]) => void
  open: (nodeId: string) => void
  close: () => void
}

/** Ephemeral editor UI, never part of document history or export. */
export const useActionEditorStore = create<ActionEditorState>((set) => ({
  nodeId: null,
  mode: 'flow',
  stateNodeIds: [],
  openNote: (nodeId) => set({ nodeId, mode: 'note' }),
  open: (nodeId) => set({ nodeId, mode: 'flow' }),
  openState: (stateNodeIds) => set({ nodeId: stateNodeIds[0], stateNodeIds, mode: 'state' }),
  close: () => set({ nodeId: null, stateNodeIds: [] }),
}))
