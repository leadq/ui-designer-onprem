import type { DesignNode } from '@root/types/document'
import { v4 as uuid } from 'uuid'

export const getNewFrame = (label: string): DesignNode => ({
  id: uuid(),
  type: 'designerFrame',
  label,
  props: {},
  style: {},
  children: [],
})
