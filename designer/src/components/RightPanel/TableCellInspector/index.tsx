import { TableTextEditor } from '@root/components/Canvas/TableEditingLayer/TableTextEditor'
import { Box } from '@root/components/common/Box'
import { Button } from '@root/components/common/Button'
import { ButtonBase } from '@root/components/common/ButtonBase'
import { Input } from '@root/components/common/Input'
import { Text } from '@root/components/common/Text'
import { getColumnValueType } from '@root/components/RightPanel/TableCellInspector/utils/getColumnValueType'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import { getTableModel } from '@root/utils/tableAuthoring/getTableModel'

import { useTableCellActions } from './hooks/useTableCellActions'

import styles from './styles.module.scss'

const MIN_REMOVABLE_ITEM_COUNT = 2

export const TableCellInspector = ({ nodeId }: { nodeId: string }) => {
  const { translate } = useBuilderI18n()

  const {
    context,
    canEditText,
    draft,
    handleEditClick,
    handleCancel,
    handleApply,
    handleCopyColumnClick,
    handleCopyRowClick,
  } = useTableCellActions(nodeId)

  if (!context) {
    return null
  }

  const { table, cell, column, row } = context

  const labels = {
    number: translate('tableAuthoring.number'),
    text: translate('tableAuthoring.text'),
    custom: translate('tableAuthoring.custom'),
    mixed: translate('tableAuthoring.mixed'),
  }

  const handleSelectClick = () => {
    useEditorStore.getState().setSelectedNodeIds([cell.id], cell.id)
  }

  const handleTableClick = () => {
    useEditorStore.getState().setSelectedNodeIds([table.id])

    useEditorStore.getState().setFocusedContainer(null)
  }

  return (
    <Box className={styles.tableCellInspector}>
      <Text size='xs'>
        {translate('tableAuthoring.cellLocation', {
          row: row + 1,
          header: getTableModel(table).columns[column].header,
        })}
      </Text>
      <Input
        readOnly
        label={translate('tableAuthoring.valueType')}
        value={labels[getColumnValueType(table, column)]}
      />
      <Text color='secondary' size='xs'>
        {translate('tableAuthoring.derivedHint')}
      </Text>
      {nodeId === cell.id && canEditText ? (
        <Button size='sm' variant='outline' onClick={handleEditClick}>
          {translate('tableAuthoring.editCellText')}
        </Button>
      ) : null}
      <Button size='sm' variant='outline' onClick={handleSelectClick}>
        {translate('tableAuthoring.addComponents')}
      </Button>
      <Text color='secondary' size='xs'>
        {translate('tableAuthoring.paletteHint')}
      </Text>
      {nodeId === cell.id ? (
        <>
          <Button
            isDisabled={getTableModel(table).rows.length < MIN_REMOVABLE_ITEM_COUNT}
            size='sm'
            variant='outline'
            onClick={handleCopyColumnClick}
          >
            {translate('tableAuthoring.copyColumn')}
          </Button>
          <Button
            isDisabled={getTableModel(table).columns.length < MIN_REMOVABLE_ITEM_COUNT}
            size='sm'
            variant='outline'
            onClick={handleCopyRowClick}
          >
            {translate('tableAuthoring.copyRow')}
          </Button>
          <Text color='secondary' size='xs'>
            {translate('tableAuthoring.copyHint')}
          </Text>
        </>
      ) : null}
      {draft ? (
        <TableTextEditor
          key={draft.cellId}
          draft={draft}
          onApply={handleApply}
          onCancel={handleCancel}
        />
      ) : null}
      <ButtonBase onClick={handleTableClick}>{translate('tableAuthoring.selectTable')}</ButtonBase>
    </Box>
  )
}
