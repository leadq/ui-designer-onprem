import { BREAKPOINT_MAP } from '@root/constants/breakpoints'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ResponsiveViewState {
  widthsByFlow: Record<string, number[]>
  areDeviceFramesVisible: boolean
  addView: (flowId: string, width: number) => void
  setDeviceFramesVisible: (visible: boolean) => void
}

/** Editor preferences only: never duplicate or mutate the canonical design tree. */
export const useResponsiveViewStore = create<ResponsiveViewState>()(
  persist(
    (set) => ({
      widthsByFlow: {},
      areDeviceFramesVisible: false,
      addView: (flowId, width) =>
        set((state) => ({
          widthsByFlow: {
            ...state.widthsByFlow,
            [flowId]: [
              ...new Set([BREAKPOINT_MAP.xl, ...(state.widthsByFlow[flowId] ?? []), width]),
            ],
          },
        })),
      setDeviceFramesVisible: (visible) => set({ areDeviceFramesVisible: visible }),
    }),
    { name: 'designer-responsive-views-v1' },
  ),
)
