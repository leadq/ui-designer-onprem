import type { DesignAnnotationKind } from '@root/types/document'

export interface AnnotationDraft {
  title: string
  kind: DesignAnnotationKind
  text: string
}
