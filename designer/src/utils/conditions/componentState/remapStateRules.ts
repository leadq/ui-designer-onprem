import type { DesignNode } from '@root/types/document'

export const remapStateRules = (
  rules: DesignNode['stateRules'],
  ids: Map<string, string>,
): DesignNode['stateRules'] =>
  rules &&
  Object.fromEntries(
    Object.entries(rules).map(([key, rule]) => [
      key,
      {
        ...rule,
        conditions: rule.conditions.map((condition) => ({
          ...condition,
          source: {
            kind: 'field',
            nodeId: ids.get(condition.source.nodeId) ?? condition.source.nodeId,
          },
        })),
      },
    ]),
  )
