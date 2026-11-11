import { useEditorStore } from '@root/stores/editor'

export const useSelectionKey = () =>
  useEditorStore(
    (state) =>
      state.selectedNodeIds.join(',') +
      (state.selectedNodeIds.length && state.selectedTableColumnKey
        ? `:${state.selectedTableColumnKey}`
        : ''),
  )
