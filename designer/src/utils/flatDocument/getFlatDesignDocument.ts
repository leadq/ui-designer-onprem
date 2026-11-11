import { getAdapter } from '@root/adapters'
import type { DesignDocument } from '@root/utils/designDocument'
import { getFlowManifest } from '@root/utils/flows/flowManifest'

import { getFlatTree } from './getFlatTree'
import type { FlatDesignDocument } from './types'

export const getFlatDesignDocument = (document: DesignDocument): FlatDesignDocument => {
  const { nodes, version, savedDesigns, ...metadata } = document

  return {
    ...metadata,
    format: 'ui-design/flat',
    version: 1,
    designVersion: version,
    ...getFlatTree(nodes),
    behavior: getFlowManifest(nodes, getAdapter(document.adapterId).registry),
    ...(savedDesigns
      ? {
          savedDesigns: savedDesigns.map(({ nodes, ...design }) => ({
            ...design,
            ...getFlatTree(nodes),
          })),
        }
      : {}),
  }
}
