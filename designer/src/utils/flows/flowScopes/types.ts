export interface FrameContext {
  id: string
  kind: 'screen' | 'overlay'
  scopeId: string
}

export interface FrameConnection {
  connectionKey?: string
  id: string
  sourceNodeId: string
  sourceStateId: string | null
  sourceScopeId: string | null
  targetNodeId: string
  targetScopeId: string | null
  intent: string | null
}
