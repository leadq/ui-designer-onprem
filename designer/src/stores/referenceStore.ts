import type { ReferenceImage, ReferencePlacement } from '@root/types/references'
import { create } from 'zustand'

import { getReferencePlacement } from '../utils/references/placement'

const REFERENCE_FRAME_STRIDE_PX = 880
const REFERENCE_GAP_PX = 80

interface ReferenceState {
  operation: 'applying' | 'applied' | 'rejected' | null
  setOperation: (operation: ReferenceState['operation']) => void
  workspaceLane: number
  workspaceError: boolean
  setWorkspaceError: (error: boolean) => void
  selectedIds: string[]
  clearSelection: () => void
  place: (id: string, placement: ReferencePlacement) => void
  images: ReferenceImage[]
  selectedId: string | null
  isOpen: boolean
  setImages: (images: ReferenceImage[]) => void
  select: (id: string, additive?: boolean) => void
  setOpen: (open: boolean) => void
}

export const useReferenceStore = create<ReferenceState>((set) => ({
  operation: null,
  setOperation: (operation) => set({ operation }),
  workspaceLane: 0,
  workspaceError: false,
  setWorkspaceError: (workspaceError) => set({ workspaceError }),
  selectedIds: [],
  clearSelection: () => set({ selectedIds: [] }),
  place: (id, placement) =>
    set((state) => ({
      images: state.images.map((image) => (image.id === id ? { ...image, placement } : image)),
    })),
  images: [],
  selectedId: null,
  isOpen: false,
  setImages: (images) =>
    set((state) => ({
      workspaceLane: images.length
        ? Math.max(
            state.workspaceLane,
            images.length * REFERENCE_FRAME_STRIDE_PX + REFERENCE_GAP_PX,
            ...images.map((image, index) => {
              const place = getReferencePlacement(image, index)

              return place.x + place.width + REFERENCE_GAP_PX
            }),
          )
        : 0,
      images: images.map((image, index) => ({
        ...image,
        placement: getReferencePlacement(image, index),
      })),
      selectedIds: state.selectedIds.filter((id) => images.some((image) => image.id === id)),
      selectedId: images.some((image) => image.id === state.selectedId)
        ? state.selectedId
        : (images[0]?.id ?? null),
    })),
  select: (selectedId, additive = false) =>
    set((state) => ({
      selectedId,
      selectedIds: additive
        ? state.selectedIds.includes(selectedId)
          ? state.selectedIds.filter((id) => id !== selectedId)
          : [...state.selectedIds, selectedId]
        : [selectedId],
    })),
  setOpen: (isOpen) => set({ isOpen }),
}))
