import type { BuilderI18nContextValue } from '@root/contexts/BuilderI18nContext/context'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { ContextMenuGroup } from '@root/types/contextMenu'
import { TABLE_MAX_COLUMNS, TABLE_MAX_ROWS } from '@root/utils/tableAuthoring/constants'
import { getTableModel } from '@root/utils/tableAuthoring/getTableModel'
import type { TableEdit } from '@root/utils/tableAuthoring/types'

import type { TableTarget } from '../types'

export const getTableMenu = (
  target: TableTarget,
  onEdit: (target: TableTarget) => void,
  translate: BuilderI18nContextValue['translate'],
  onDesign?: () => void,
): ContextMenuGroup[] => {
  const { columns, rows, cells } = getTableModel(target.node)

  const onSelect = (edit: TableEdit) => () =>
    useEditorStore.getState().editTable(target.node.id, edit)

  const { row, column } = target

  const alignment: ContextMenuGroup[] = registry[target.node.type]?.tableColumnAlignment
    ? [
        {
          id: 'alignment',
          label: translate('tableAuthoring.contentAlignment'),
          items: (['left', 'center', 'right'] as const).map((align) => ({
            id: `align-${align}`,
            label: translate(`tableAuthoring.alignAction.${align}`),
            icon: columns[column].align === align ? '✓' : '',
            onSelect: onSelect({ type: 'align', column, align }),
          })),
        },
      ]
    : []

  if (row === undefined) {
    return [
      ...alignment,
      {
        id: 'column',
        label: columns[column].header,
        items: [
          {
            id: 'title',
            label: translate('tableAuthoring.editTitle'),
            icon: '✎',
            onSelect: () => onEdit(target),
          },
          {
            id: 'before',
            label: translate('tableAuthoring.insertBefore'),
            icon: '+',
            disabled: columns.length >= TABLE_MAX_COLUMNS,
            onSelect: onSelect({ type: 'insertColumn', index: column }),
          },
          {
            id: 'after',
            label: translate('tableAuthoring.insertAfter'),
            icon: '+',
            disabled: columns.length >= TABLE_MAX_COLUMNS,
            onSelect: onSelect({ type: 'insertColumn', index: column + 1 }),
          },
          {
            id: 'remove',
            label: translate('tableAuthoring.removeColumn'),
            icon: '−',
            danger: true,
            disabled: columns.length <= 1,
            onSelect: onSelect({ type: 'removeColumn', index: column }),
          },
        ],
      },
    ]
  }

  const cell = cells[row * columns.length + column]

  return [
    ...alignment,
    {
      id: 'cell',
      label: translate('tableAuthoring.cellLocation', {
        row: row + 1,
        header: columns[column].header,
      }),
      items: [
        ...(onDesign
          ? [
              {
                id: 'designCell',
                label: translate('cellDesigner.title'),
                icon: '✎',
                onSelect: onDesign,
              },
            ]
          : []),
        {
          id: 'edit',
          label: translate('tableAuthoring.editCell'),
          icon: '✎',
          onSelect: () => onEdit(target),
        },
        {
          id: 'components',
          label: translate('tableAuthoring.addComponents'),
          icon: '+',
          onSelect: () => {
            useEditorStore.getState().setSelectedNodeIds([cell.id], cell.id)
          },
        },
        {
          id: 'copyColumn',
          label: translate('tableAuthoring.copyColumn'),
          icon: '↕',
          onSelect: onSelect({ type: 'copy', row, column, axis: 'column' }),
        },
        {
          id: 'copyRow',
          label: translate('tableAuthoring.copyRow'),
          icon: '↔',
          onSelect: onSelect({ type: 'copy', row, column, axis: 'row' }),
        },
      ],
    },
    {
      id: 'row',
      label: translate('tableAuthoring.row'),
      items: [
        {
          id: 'above',
          label: translate('tableAuthoring.insertAbove'),
          icon: '+',
          disabled: rows.length >= TABLE_MAX_ROWS,
          onSelect: onSelect({ type: 'insertRow', index: row }),
        },
        {
          id: 'below',
          label: translate('tableAuthoring.insertBelow'),
          icon: '+',
          disabled: rows.length >= TABLE_MAX_ROWS,
          onSelect: onSelect({ type: 'insertRow', index: row + 1 }),
        },
        {
          id: 'remove',
          label: translate('tableAuthoring.removeRow'),
          icon: '−',
          danger: true,
          disabled: rows.length <= 1,
          onSelect: onSelect({ type: 'removeRow', index: row }),
        },
      ],
    },
  ]
}
