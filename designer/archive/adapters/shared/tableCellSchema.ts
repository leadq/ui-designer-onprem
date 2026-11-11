import type { PropSchema } from '@root/types/propSchema';

export const TABLE_CELL_SLOT: PropSchema = {
  key: 'renderCell',
  label: 'Cell design',
  type: 'slot',
  defaultValue: null,
  slotRenderMode: 'callback',
  slotArgumentNames: ['value', 'record', 'index', 'columnKey'],
  slotShowPlaceholder: false,
  slotAcceptsMultiple: true,
  slotDescription:
    'Bind item.value, item.record.field, item.index or item.columnKey in your cell design.',
};
