import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { getConditionNodes } from '@root/utils/conditions/conditionModel'

export const getTextFields = (nodes: DesignNode[], registry: Registry): DesignNode[] =>
  getConditionNodes(nodes).filter((node) => registry[node.type]?.previewValue)
