import { useEffect } from 'react'
import { useEditorStore } from '@root/stores/editor'
import { useReferenceStore } from '@root/stores/referenceStore'

export const useSelectionReferenceSync = () => {
  useEffect(
    () =>
      useEditorStore.subscribe((state, previous) => {
        if (state.selectedNodeIds !== previous.selectedNodeIds && state.selectedNodeIds.length) {
          useReferenceStore.getState().clearSelection()
        }
      }),
    [],
  )
}
