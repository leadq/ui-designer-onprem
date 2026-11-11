export const getExampleKey = (nodeId: string, ruleId: string): string =>
  JSON.stringify([nodeId, ruleId])
