import { registry } from '@root/registry'
import { validateComponentContract } from '@root/utils/designer/componentContract/validateComponentContract'
import { findNode } from '@root/utils/nodes'
import { getEditedTable } from '@root/utils/tableAuthoring/getEditedTable'
import { getTableModel } from '@root/utils/tableAuthoring/getTableModel'

import type { EditorActions, EditorStoreSet } from '../types'

import { getNextHistory } from './getNextHistory'

export const getTableActions = (set: EditorStoreSet): Pick<EditorActions, 'editTable'> => ({
  editTable: (id, edit) =>
    set((state) => {
      const node = findNode(state.nodes, id)

      if (!node) {
        return
      }

      const next = getEditedTable(node, edit, registry, state.slotComponents)

      if (next === node || JSON.stringify(next) === JSON.stringify(node)) {
        return
      }

      validateComponentContract([next], registry)

      Object.assign(node, next)

      const cellId =
        edit.type === 'cell'
          ? edit.value.id
          : edit.type === 'text'
            ? edit.cellId
            : edit.type === 'copy'
              ? getTableModel(next).cells[
                  edit.row * getTableModel(next).columns.length + edit.column
                ]?.id
              : undefined

      state.selectedFrameIds = []

      state.selectedNodeIds = [cellId ?? id]

      if (cellId) {
        state.selectedTableColumnKey = null
      }

      state.focusedContainerId = cellId ?? null

      const history = getNextHistory(state)

      state.history = history.history

      state.historyIndex = history.historyIndex
    }),
})
