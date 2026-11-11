import type { DesignAnnotation, DesignAnnotationKind } from '@root/types/document'

import { ANNOTATION_KINDS } from './constants'
import { isRecord } from './isRecord'

export const getParseAnnotations = (value: unknown): DesignAnnotation[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.text !== 'string') {
      return []
    }

    if (!ANNOTATION_KINDS.has(item.kind as DesignAnnotationKind)) {
      return []
    }

    return [
      {
        id: item.id,
        kind: item.kind as DesignAnnotationKind,
        title: typeof item.title === 'string' ? item.title : undefined,
        text: item.text,
      },
    ]
  })
}
