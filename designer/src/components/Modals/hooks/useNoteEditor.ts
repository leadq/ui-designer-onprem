import { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '@root/stores/editor'
import type { AnnotationDraft } from '@root/types/annotationDraft'
import type { DesignAnnotation } from '@root/types/document'
import { v4 as uuidv4 } from 'uuid'

import { useNoteEditorTarget } from './useNoteEditorTarget'

const EMPTY_DRAFT: AnnotationDraft = { title: '', kind: 'behavior', text: '' }
const SUCCESS_DURATION_MS = 3000

export const useNoteEditor = (isOpen: boolean, targetNodeId: string | null) => {
  const target = useNoteEditorTarget(targetNodeId)
  const { annotations } = target
  const upsertAnnotation = useEditorStore((state) => state.upsertAnnotation)
  const removeAnnotation = useEditorStore((state) => state.removeAnnotation)
  const updateNodeNotes = useEditorStore((state) => state.updateNodeNotes)
  const updatePageNotes = useEditorStore((state) => state.updatePageNotes)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<AnnotationDraft>(EMPTY_DRAFT)
  const [pendingDelete, setPendingDelete] = useState<DesignAnnotation | null>(null)

  const [success, setSuccess] = useState<{ key: 'annotation.added' | 'annotation.updated' } | null>(
    null,
  )

  const initializedTarget = useRef<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      initializedTarget.current = null

      return
    }

    const key = targetNodeId ?? 'page'

    if (initializedTarget.current === key) {
      return
    }

    initializedTarget.current = key

    const first = annotations[0]

    setSelectedId(first?.id ?? null)

    setDraft(first ? { title: first.title ?? '', kind: first.kind, text: first.text } : EMPTY_DRAFT)

    setPendingDelete(null)

    setSuccess(null)
  }, [isOpen, targetNodeId, annotations])

  useEffect(() => {
    if (!success || !isOpen) {
      return
    }

    const timer = window.setTimeout(() => setSuccess(null), SUCCESS_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [isOpen, success])

  const handleSelect = (annotation: DesignAnnotation) => {
    setSelectedId(annotation.id)

    setDraft({ title: annotation.title ?? '', kind: annotation.kind, text: annotation.text })

    setSuccess(null)
  }

  const handleNewClick = () => {
    setSelectedId(null)

    setDraft(EMPTY_DRAFT)

    setSuccess(null)
  }

  const handleSetDraftChange = (value: AnnotationDraft) => {
    setDraft(value)

    setSuccess(null)
  }

  const handleSaveClick = () => {
    const text = draft.text.trim()

    if (!text) {
      return
    }

    const isLegacy = selectedId === 'legacy'
    const id = selectedId && !isLegacy ? selectedId : uuidv4()

    upsertAnnotation(
      targetNodeId,
      { id, kind: draft.kind, title: draft.title.trim() || undefined, text },
      isLegacy,
    )

    setSelectedId(id)

    setDraft({ ...draft, title: draft.title.trim(), text })

    setSuccess({ key: selectedId ? 'annotation.updated' : 'annotation.added' })
  }

  const handleRequestDelete = (annotation: DesignAnnotation) => setPendingDelete(annotation)
  const handleCancelDelete = () => setPendingDelete(null)

  const handleConfirmDelete = () => {
    if (!pendingDelete) {
      return
    }

    if (pendingDelete.id === 'legacy') {
      if (targetNodeId) {
        updateNodeNotes(targetNodeId, '')
      } else {
        updatePageNotes('')
      }
    } else {
      removeAnnotation(targetNodeId, pendingDelete.id)
    }

    if (selectedId === pendingDelete.id) {
      const next = annotations.find((annotation) => annotation.id !== pendingDelete.id)

      if (next) {
        handleSelect(next)
      } else {
        handleNewClick()
      }
    }

    setPendingDelete(null)

    setSuccess(null)
  }

  return {
    ...target,
    selectedId,
    draft,
    pendingDelete,
    success,
    handleSelect,
    handleSetDraftChange,
    handleSaveClick,
    handleNewClick,
    handleRequestDelete,
    handleCancelDelete,
    handleConfirmDelete,
  }
}
