import { LEGACY_ADAPTER_ID } from '@root/adapters'
import { getNestedDocument } from '@root/utils/flatDocument'
import { migrateLegacyFlowIntent, validateFlowReferences } from '@root/utils/flows/flowModel'

import { DESIGN_SCHEMA_VERSION } from './constants'
import { getDesignDocument } from './getDesignDocument'
import { getParseAnnotations } from './getParseAnnotations'
import { getParseNodes } from './getParseNodes'
import { getParseSavedDesigns } from './getParseSavedDesigns'
import { isRecord } from './isRecord'
import type { DesignDocument } from './types'
import { validateConditionInputs } from './validateConditionInputs'

export const parseDesignDocument = (value: unknown): DesignDocument => {
  if (Array.isArray(value)) {
    const nodes = getParseNodes(value)

    migrateLegacyFlowIntent(nodes)

    validateFlowReferences(nodes)

    validateConditionInputs(nodes, LEGACY_ADAPTER_ID)

    return getDesignDocument(nodes, 'Untitled Page', '', [], undefined, LEGACY_ADAPTER_ID)
  }

  if (!isRecord(value)) {
    throw new Error('Design file must be an object or a legacy node array')
  }

  if (value.format === 'ui-design/flat') {
    return parseDesignDocument(getNestedDocument(value))
  }

  if (typeof value.version === 'number' && value.version > DESIGN_SCHEMA_VERSION) {
    throw new Error(
      `Design version ${value.version} is newer than supported version ${DESIGN_SCHEMA_VERSION}`,
    )
  }

  const nodes = getParseNodes(value.nodes)

  migrateLegacyFlowIntent(nodes)

  validateFlowReferences(nodes)

  const adapterId = typeof value.adapterId === 'string' ? value.adapterId : LEGACY_ADAPTER_ID

  validateConditionInputs(nodes, adapterId)

  return getDesignDocument(
    nodes,
    typeof value.pageName === 'string' ? value.pageName : 'Untitled Page',
    typeof value.pageNotes === 'string' ? value.pageNotes : '',
    getParseAnnotations(value.pageAnnotations),
    'savedDesigns' in value ? getParseSavedDesigns(value.savedDesigns, adapterId) : undefined,
    adapterId,
  )
}
