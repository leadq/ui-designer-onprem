import { useRef, useState } from 'react'
import { getFilteredIcons } from '@root/utils/designIcons/getFilteredIcons'

export const ICON_COLUMNS = 3

export const ICON_ROW_HEIGHT = 64

const VISIBLE_ROWS = 5
const OVERSCAN_ROWS = 2

export const useIconPicker = () => {
  const [query, setQuery] = useState('')
  const [scrollTop, setScrollTop] = useState(0)
  const viewport = useRef<HTMLDivElement>(null)
  const entries = getFilteredIcons(query)
  const startRow = Math.max(0, Math.floor(scrollTop / ICON_ROW_HEIGHT) - OVERSCAN_ROWS)

  const endRow = Math.min(
    Math.ceil(entries.length / ICON_COLUMNS),
    startRow + VISIBLE_ROWS + OVERSCAN_ROWS + OVERSCAN_ROWS,
  )

  const resetScroll = () => {
    if (viewport.current) {
      viewport.current.scrollTop = 0
    }

    setScrollTop(0)
  }

  const handleQueryChange = (value: string) => {
    setQuery(value)

    resetScroll()
  }

  return {
    query,
    entries,
    viewport,
    handleQueryChange,
    handleScroll: () => setScrollTop(viewport.current?.scrollTop ?? 0),
    visible: entries.slice(startRow * ICON_COLUMNS, endRow * ICON_COLUMNS),
    top: startRow * ICON_ROW_HEIGHT,
    bottom: Math.max(0, Math.ceil(entries.length / ICON_COLUMNS) - endRow) * ICON_ROW_HEIGHT,
  }
}
