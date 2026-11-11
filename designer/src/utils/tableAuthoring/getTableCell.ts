import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { v4 as uuidv4 } from 'uuid'

export const getTableCell = (registry: Registry, text?: string): DesignNode => ({
  id: uuidv4(),
  type: 'box',
  label: 'Cell',
  props: { ...registry.box.defaultProps },
  style: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 0,
    minHeight: 28,
    minWidth: 0,
  },
  children:
    text === undefined
      ? []
      : [
          {
            id: uuidv4(),
            type: 'typography',
            props: { ...registry.typography.defaultProps, children: text },
            style: {},
            children: [],
          },
        ],
})
