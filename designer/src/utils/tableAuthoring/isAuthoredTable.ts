import type { DesignNode } from '@root/types/document'

import { TABLE_CELL_CONTENTS } from './constants'

export const isAuthoredTable = (node: DesignNode): boolean =>
  Array.isArray(node.props.rows) && Boolean(node.slots?.[TABLE_CELL_CONTENTS])
