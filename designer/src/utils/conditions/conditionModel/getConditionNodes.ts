import type { DesignNode } from '@root/types/document'

/** Only unique, non-repeated component instances can be condition inputs. Slots have their own item scopes. */
export const getConditionNodes = (nodes: DesignNode[]): DesignNode[] =>
  nodes.flatMap((node) => [node, ...getConditionNodes(node.children)])
