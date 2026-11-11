import type { DesignNode } from '@root/types/document'
import { isAuthoredTable } from '@root/utils/tableAuthoring/isAuthoredTable'

export const getAuthoredTables = (nodes: DesignNode[]): DesignNode[] =>
  nodes.flatMap((node) => [
    ...(isAuthoredTable(node) ? [node] : []),
    ...getAuthoredTables(node.children),
    ...Object.values(node.slots ?? {}).flatMap(getAuthoredTables),
  ])
