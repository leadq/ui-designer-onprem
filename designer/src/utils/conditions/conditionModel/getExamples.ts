import type { DesignNode } from '@root/types/document'

import { getConditionNodes } from './getConditionNodes'
import { getExampleKey } from './getExampleKey'

export const getExamples = (nodes: DesignNode[]) =>
  getConditionNodes(nodes).flatMap((node) =>
    (node.interactions ?? []).flatMap((rule) =>
      rule.condition?.source.kind === 'example'
        ? [
            {
              key: getExampleKey(node.id, rule.id),
              label: rule.condition.source.label,
              defaultValue: rule.condition.source.defaultValue,
            },
          ]
        : [],
    ),
  )
