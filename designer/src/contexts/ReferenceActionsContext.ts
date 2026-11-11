import { createContext } from 'react'

export const ReferenceActionsContext = createContext<{ onRemove: (id: string) => Promise<void> }>({
  onRemove: async () => {},
})
