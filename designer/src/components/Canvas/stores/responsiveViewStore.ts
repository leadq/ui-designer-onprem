import { BREAKPOINT_MAP } from '@root/constants/breakpoints'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ResponsiveViewState {
  widthsByFlow: Record<string, number[]>
  addView: (flowId: string, width: number) => void
}

const getPreferences = ({ widthsByFlow }: ResponsiveViewState) => ({ widthsByFlow })

const getMergedPreferences = (persisted: unknown, current: ResponsiveViewState) => ({
  ...current,
  widthsByFlow: (persisted as Partial<ResponsiveViewState>)?.widthsByFlow ?? current.widthsByFlow,
})

/** Editor preferences only: never duplicate or mutate the canonical design tree. */
export const useResponsiveViewStore = create<ResponsiveViewState>()(
  persist(
    (set) => ({
      widthsByFlow: {},
      addView: (flowId, width) =>
        set((state) => ({
          widthsByFlow: {
            ...state.widthsByFlow,
            [flowId]: [
              ...new Set([BREAKPOINT_MAP.xl, ...(state.widthsByFlow[flowId] ?? []), width]),
            ],
          },
        })),
    }),
    {
      name: 'designer-responsive-views-v1',
      partialize: getPreferences,
      merge: getMergedPreferences,
    },
  ),
)
