import type { DesignNode } from '@root/types/document'
import { findParent } from '@root/utils/nodes'

import { TABLE_CELL_CONTENTS } from './constants'

export const isTableCell = (nodes: DesignNode[], id: string): boolean =>
  Boolean(findParent(nodes, id)?.slots?.[TABLE_CELL_CONTENTS]?.some((cell) => cell.id === id))
