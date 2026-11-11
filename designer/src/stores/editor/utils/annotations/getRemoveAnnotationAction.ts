import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getRemoveAnnotationAction =
  (set: EditorStoreSet): EditorActions['removeAnnotation'] =>
  (targetNodeId, annotationId) =>
    set((state) => {
      const target = targetNodeId ? findNode(state.nodes, targetNodeId) : null

      if (targetNodeId && !target) {
        return
      }

      if (target) {
        target.annotations = target.annotations?.filter((item) => item.id !== annotationId)

        if (target.annotations?.length === 0) {
          delete target.annotations
        }

        const historyUpdate = getNextHistory(state)

        state.history = historyUpdate.history

        state.historyIndex = historyUpdate.historyIndex
      } else {
        state.pageAnnotations = state.pageAnnotations.filter((item) => item.id !== annotationId)
      }
    })
