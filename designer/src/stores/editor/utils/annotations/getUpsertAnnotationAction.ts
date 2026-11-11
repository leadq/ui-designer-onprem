import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getUpsertAnnotationAction =
  (set: EditorStoreSet): EditorActions['upsertAnnotation'] =>
  (targetNodeId, annotation, shouldReplaceLegacyNote = false) =>
    set((state) => {
      const annotations = targetNodeId
        ? findNode(state.nodes, targetNodeId)?.annotations
        : state.pageAnnotations

      const target = targetNodeId ? findNode(state.nodes, targetNodeId) : null

      if (targetNodeId && !target) {
        return
      }

      const nextAnnotations = annotations ? [...annotations] : []
      const existingIndex = nextAnnotations.findIndex((item) => item.id === annotation.id)

      if (existingIndex >= 0) {
        nextAnnotations[existingIndex] = annotation
      } else {
        nextAnnotations.push(annotation)
      }

      if (shouldReplaceLegacyNote) {
        if (target) {
          delete target.notes
        } else {
          state.pageNotes = ''
        }
      }

      if (target) {
        target.annotations = nextAnnotations
      } else {
        state.pageAnnotations = nextAnnotations
      }

      if (target) {
        const historyUpdate = getNextHistory(state)

        state.history = historyUpdate.history

        state.historyIndex = historyUpdate.historyIndex
      }
    })
