export interface ReferencePlacement {
  x: number
  y: number
  width: number
}

export interface ReferenceImage {
  id: string
  name: string
  width: number
  height: number
  bytes: number
  placement?: ReferencePlacement
  createdAt: number
  blob: Blob
  sha256: string
}
