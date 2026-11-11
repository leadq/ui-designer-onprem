import { useEffect, useState } from 'react'
import { useEditorStore } from '@root/stores/editor'
import { findNode } from '@root/utils/nodes'

import type { TableBounds } from '../types'
import { getAuthoredTables } from '../utils/getAuthoredTables'
import { getNativeTableCells } from '../utils/getNativeTableCells'

const HANDLE_GAP = 4
const REFRESH_INTERVAL = 100
const APPEND_BUTTON_WIDTH = 140

export const useTableGeometry = () => {
  const nodes = useEditorStore((state) => state.nodes)
  const selectedIds = useEditorStore((state) => state.selectedNodeIds)
  const zoom = useEditorStore((state) => state.canvasZoom)
  const previewMode = useEditorStore((state) => state.previewMode)
  const [bounds, setBounds] = useState<TableBounds | null>(null)

  const table = getAuthoredTables(nodes)
    .reverse()
    .find((node) => selectedIds.some((id) => Boolean(findNode([node], id))))

  useEffect(() => {
    const wrapper = document.getElementById('canvas-wrapper')

    if (!table || previewMode || !wrapper) {
      setBounds(null)

      return
    }

    let frame: number | null = null

    const updateBounds = () => {
      const origin = wrapper.getBoundingClientRect()
      const cells = getNativeTableCells(table)

      const getRelative = (cell: HTMLElement) => {
        const rect = cell.getBoundingClientRect()

        return {
          x: rect.left - origin.left,
          y: rect.top - origin.top,
          width: rect.width,
          height: rect.height,
        }
      }

      const headers = cells.filter((cell) => cell.dataset.tableRow === undefined).map(getRelative)

      const firstKey = cells.find((cell) => cell.dataset.tableRow === undefined)?.dataset
        .tableColumn

      const lastBodyCell = cells
        .filter(
          (cell) => cell.dataset.tableRow !== undefined && cell.dataset.tableColumn === firstKey,
        )
        .at(-1)

      const first = headers[0]
      const last = headers.at(-1)
      const bottom = lastBodyCell ? getRelative(lastBodyCell) : null

      const next =
        first && last && bottom
          ? {
              tableId: table.id,
              zoom,
              headers,
              appendColumn: {
                x: last.x + last.width,
                y: first.y,
                width: APPEND_BUTTON_WIDTH,
                height: first.height / zoom,
              },
              appendRow: { x: first.x, y: bottom.y + bottom.height + HANDLE_GAP * zoom },
            }
          : null

      setBounds((previous) => (JSON.stringify(previous) === JSON.stringify(next) ? previous : next))
    }

    const schedule = () => {
      if (frame === null) {
        frame = requestAnimationFrame(() => {
          frame = null

          updateBounds()
        })
      }
    }

    updateBounds()

    const interval = setInterval(schedule, REFRESH_INTERVAL)

    window.addEventListener('resize', schedule)

    wrapper.addEventListener('scroll', schedule, true)

    return () => {
      clearInterval(interval)

      if (frame !== null) {
        cancelAnimationFrame(frame)
      }

      window.removeEventListener('resize', schedule)

      wrapper.removeEventListener('scroll', schedule, true)
    }
  }, [table, previewMode, zoom])

  return { table, bounds: bounds?.tableId === table?.id ? bounds : null }
}
