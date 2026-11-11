import { useState } from 'react'
import { Box } from '@root/components/common/Box'
import { ButtonBase } from '@root/components/common/ButtonBase'
import { ContextMenu } from '@root/components/common/ContextMenu'
import { PositionedBox } from '@root/components/common/PositionedBox'
import { TableCellDesigner } from '@root/components/Modals/TableCellDesigner'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { TABLE_MAX_COLUMNS, TABLE_MAX_ROWS } from '@root/utils/tableAuthoring/constants'
import { getTableModel } from '@root/utils/tableAuthoring/getTableModel'

import { useTableEditing } from './hooks/useTableEditing'
import { useTableGeometry } from './hooks/useTableGeometry'
import { getTableMenu } from './utils/getTableMenu'
import { TableTextEditor } from './TableTextEditor'

import styles from './styles.module.scss'

export const TableEditingLayer = () => {
  const { translate } = useBuilderI18n()
  const [designer, setDesigner] = useState<{ tableId: string; cell: DesignNode } | null>(null)
  const { table, bounds } = useTableGeometry()

  const {
    target,
    draft,
    handleClose,
    handleCancel,
    handleEdit,
    handleApply,
    handleTarget,
    handleSelectColumn,
  } = useTableEditing()

  const editTable = useEditorStore((state) => state.editTable)
  const selectedColumnKey = useEditorStore((state) => state.selectedTableColumnKey)
  const model = table ? getTableModel(table) : null
  const handleStop = (event: React.SyntheticEvent) => event.stopPropagation()
  const handleStopClick = handleStop
  const handleStopContextMenu = handleStop
  const handleStopDoubleClick = handleStop
  const handleStopMouseDown = handleStop

  return (
    <>
      {table && bounds && model ? (
        <Box
          data-table-editor
          className={styles.tableEditingLayer}
          onClick={handleStopClick}
          onContextMenu={handleStopContextMenu}
          onDoubleClick={handleStopDoubleClick}
          onMouseDown={handleStopMouseDown}
        >
          {bounds.headers.map((rect, column) => (
            <PositionedBox
              key={model.columns[column]?.key ?? column}
              bounds={rect}
              className={styles.tableEditingLayer__header}
            >
              <ButtonBase
                aria-pressed={selectedColumnKey === model.columns[column]?.key}
                className={styles.tableEditingLayer__headerButton}
                aria-label={translate('tableAuthoring.columnOptions', {
                  header: model.columns[column]?.header ?? '',
                })}
                onClick={() => handleSelectColumn({ node: table, column, x: 0, y: 0 })}
                onDoubleClick={() => handleEdit({ node: table, column, x: 0, y: 0 })}
                onContextMenu={(event) => {
                  event.preventDefault()

                  handleTarget({ node: table, column, x: event.clientX, y: event.clientY })
                }}
              />
            </PositionedBox>
          ))}
          <PositionedBox bounds={bounds.appendColumn} scale={bounds.zoom}>
            <ButtonBase
              className={`${styles.tableEditingLayer__add} ${styles.tableEditingLayer__addColumn}`}
              isDisabled={model.columns.length >= TABLE_MAX_COLUMNS}
              onClick={() =>
                editTable(table.id, { type: 'insertColumn', index: model.columns.length })
              }
            >
              {translate('tableAuthoring.appendColumn')}
            </ButtonBase>
          </PositionedBox>
          <PositionedBox bounds={bounds.appendRow} scale={bounds.zoom}>
            <ButtonBase
              className={styles.tableEditingLayer__add}
              isDisabled={model.rows.length >= TABLE_MAX_ROWS}
              onClick={() => editTable(table.id, { type: 'insertRow', index: model.rows.length })}
            >
              {translate('tableAuthoring.appendRow')}
            </ButtonBase>
          </PositionedBox>
        </Box>
      ) : null}
      {target ? (
        <ContextMenu
          label={translate('tableAuthoring.menu')}
          position={{ x: target.x, y: target.y }}
          groups={getTableMenu(target, handleEdit, translate, () => {
            const cell = getTableModel(target.node).cells[
              (target.row ?? 0) * getTableModel(target.node).columns.length + target.column
            ]

            if (cell) {
              setDesigner({ tableId: target.node.id, cell })
            }
          })}
          onClose={handleClose}
        />
      ) : null}
      {designer ? <TableCellDesigner {...designer} onClose={() => setDesigner(null)} /> : null}
      {draft ? (
        <TableTextEditor
          key={`${draft.tableId}:${draft.cellId ?? draft.column}`}
          draft={draft}
          onApply={handleApply}
          onCancel={handleCancel}
        />
      ) : null}
    </>
  )
}
