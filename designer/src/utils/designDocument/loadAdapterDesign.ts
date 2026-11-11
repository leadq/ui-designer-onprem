import { getDesignDocument } from './getDesignDocument'
import type { DesignDocument } from './types'

export const loadAdapterDesign = (adapterId: string): DesignDocument =>
  getDesignDocument([], 'Untitled Page', '', [], [], adapterId)
