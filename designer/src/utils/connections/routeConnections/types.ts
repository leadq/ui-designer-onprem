interface Bounds {
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
}

export interface Point {
  x: number
  y: number
}

export interface ConnectionGeometry {
  id: string
  source: Bounds
  sourceFrame: Bounds
  targetFrame: Bounds
  isFrameSource?: boolean
}
