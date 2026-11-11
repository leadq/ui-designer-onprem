import { Box, ButtonBase, Input, Select, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import type { DataTableColumnConfig } from '@root/types/propSchema'
import { getTableModel } from '@root/utils/tableAuthoring/getTableModel'

import styles from './styles.module.scss'

export interface TableColumnInspectorProps {
  table: DesignNode
  column: number
}

export const TableColumnInspector = ({ table, column }: TableColumnInspectorProps) => {
  const { translate } = useBuilderI18n()
  const config = getTableModel(table).columns[column]

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    useEditorStore
      .getState()
      .editTable(table.id, { type: 'header', column, text: event.target.value })
  }

  const handleAlignChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    useEditorStore.getState().editTable(table.id, {
      type: 'align',
      column,
      align:
        event.target.value === 'default'
          ? undefined
          : (event.target.value as DataTableColumnConfig['align']),
    })
  }

  const handleTableClick = () => useEditorStore.getState().setSelectedNodeIds([table.id])

  return (
    <Box className={styles.tableColumnInspector}>
      <Text>{translate('tableAuthoring.columnProperties')}</Text>
      <Input
        label={translate('tableAuthoring.columnTitle')}
        value={config.header}
        onChange={handleTitleChange}
      />
      {registry[table.type]?.tableColumnAlignment ? (
        <Select
          label={translate('tableAuthoring.contentAlignment')}
          value={config.align ?? 'default'}
          data={(['default', 'left', 'center', 'right'] as const).map((value) => ({
            value,
            label: translate(`tableAuthoring.align.${value}`),
          }))}
          onChange={handleAlignChange}
        />
      ) : null}
      <ButtonBase onClick={handleTableClick}>{translate('tableAuthoring.selectTable')}</ButtonBase>
    </Box>
  )
}
