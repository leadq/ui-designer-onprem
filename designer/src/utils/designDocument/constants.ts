import type { DesignAnnotationKind } from '@root/types/document'
import type { DesignInteractionAction, DesignInteractionTrigger } from '@root/types/flow'

export const DESIGN_SCHEMA_VERSION = 14

export const ACTIVE_DESIGN_STORAGE_KEY = 'designer-active-design-v2'

export const ANNOTATION_KINDS = new Set<DesignAnnotationKind>([
  'behavior',
  'validation',
  'data',
  'dependency',
  'interaction',
])

export const INTERACTION_TRIGGERS = new Set<DesignInteractionTrigger>(['click', 'change'])

export const INTERACTION_ACTIONS = new Set<DesignInteractionAction>([
  'show',
  'hide',
  'toggle',
  'goTo',
  'openOverlay',
  'closeOverlay',
])
