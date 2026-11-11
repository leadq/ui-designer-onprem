import type {
  DesignInteractionAction,
  DesignInteractionTrigger,
  DesignTransitionIntent,
} from './flow'

export type PreviewValue = string | number | boolean | null

export interface PreviewValueConfig {
  prop: string
  defaultProp: string
  eventProp: string
  emptyValue: PreviewValue
  read: (...args: unknown[]) => PreviewValue | undefined
}

export type ConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'greater'
  | 'less'
  | 'atLeast'
  | 'atMost'
  | 'between'
  | 'empty'
  | 'notEmpty'

export interface DesignCondition {
  source:
    | { kind: 'field'; nodeId: string }
    | { kind: 'example'; label: string; defaultValue: 'success' | 'failure' }
  operator: ConditionOperator
  value?: PreviewValue
  upperValue?: number
}

export interface ComponentStateRule {
  match: 'all' | 'any'
  conditions: (DesignCondition & { source: { kind: 'field'; nodeId: string } })[]
}

export interface InteractionOutcome {
  action: DesignInteractionAction
  targetNodeId: string
  intent?: DesignTransitionIntent
}

export interface DesignInteraction extends InteractionOutcome {
  id: string
  trigger: DesignInteractionTrigger
  condition?: DesignCondition
  otherwise?: InteractionOutcome
}
