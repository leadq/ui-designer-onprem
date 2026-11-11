export interface WorkspaceRecord {
  id: string
  clientId: string
  document: unknown
  revision: number
  updatedAt: number
}

export interface OperationReceipt {
  id: string
  signature: string
  designId: string
  status: 'applied' | 'rejected'
  frameIds?: string[]
  version?: number
  message?: string
  isPersisted: boolean
  createdAt: number
}

export interface WorkspaceState {
  clientId: string
  active: WorkspaceRecord
  lastDocument: string
  savedDocument?: string
  isAutoSaveEnabled?: boolean
  hasLibraryError?: boolean
  hasError: boolean
  isApplying?: boolean
  isSwitching?: boolean
}
