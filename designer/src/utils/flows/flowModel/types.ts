export interface FlowVisibilityEffect {
  operation: 'show' | 'hide' | 'toggle'
  nodeIds: string[]
}
