export interface ConnectionPath {
  id: string
  sourceId: string
  anchorId: string
  viaIds: string[]
  targetId: string
  label: string
  path: string
  routeSide?: string
  isActive: boolean
  isConditional: boolean
}

export interface ConnectionLinesModel {
  paths: ConnectionPath[]
}
