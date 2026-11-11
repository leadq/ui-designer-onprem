import { useMemo } from 'react'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignAnnotation } from '@root/types/document'
import { findNode } from '@root/utils/nodes'

export const useNoteEditorTarget = (targetNodeId: string | null) => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const pageNotes = useEditorStore((state) => state.pageNotes)
  const pageAnnotations = useEditorStore((state) => state.pageAnnotations)
  const targetNode = targetNodeId ? findNode(nodes, targetNodeId) : null
  const isPageAnnotation = targetNodeId === null

  const annotations = useMemo(() => {
    const structured = isPageAnnotation ? pageAnnotations : (targetNode?.annotations ?? [])
    const legacyText = isPageAnnotation ? pageNotes : (targetNode?.notes ?? '')

    const legacy: DesignAnnotation[] = legacyText.trim()
      ? [{ id: 'legacy', kind: 'behavior', text: legacyText }]
      : []

    return [...legacy, ...structured]
  }, [isPageAnnotation, pageAnnotations, pageNotes, targetNode])

  const targetName = isPageAnnotation
    ? translate('behavior.page')
    : targetNode?.label ||
      registry[targetNode?.type ?? '']?.displayName ||
      translate('behavior.unknown')

  return { annotations, isPageAnnotation, targetName }
}
