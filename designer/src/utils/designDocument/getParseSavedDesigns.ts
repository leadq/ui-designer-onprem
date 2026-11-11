import type { SlotComponent } from '@root/types/document'
import { migrateLegacyFlowIntent, validateFlowReferences } from '@root/utils/flows/flowModel'

import { getParseNodes } from './getParseNodes'
import { isRecord } from './isRecord'
import { validateConditionInputs } from './validateConditionInputs'

export const getParseSavedDesigns = (value: unknown, adapterId: string): SlotComponent[] => {
  if (!Array.isArray(value)) {
    throw new Error('savedDesigns must be an array')
  }

  return value.map((item, index) => {
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.name !== 'string') {
      throw new Error(`savedDesigns[${index}] requires an id and name`)
    }

    const nodes = getParseNodes(item.nodes, `savedDesigns[${index}].nodes`)

    migrateLegacyFlowIntent(nodes)

    validateFlowReferences(nodes)

    validateConditionInputs(nodes, adapterId)

    return { id: item.id, name: item.name, nodes }
  })
}
