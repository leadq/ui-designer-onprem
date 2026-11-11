import { create } from 'zustand'

interface DisclosureDesignState {
  collapsed: Record<string, boolean>
  setExpanded: (key: string, isExpanded: boolean) => void
}

// Editor presentation only: never persisted, exported or included in history.
export const useDisclosureDesignStore = create<DisclosureDesignState>((set) => ({
  collapsed: {},
  setExpanded: (key, isExpanded) =>
    set((state) => {
      const collapsed = { ...state.collapsed }

      if (isExpanded) {
        delete collapsed[key]
      } else {
        collapsed[key] = true
      }

      return { collapsed }
    }),
}))
