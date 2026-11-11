import { useMemo, useRef, useState } from 'react'
import type { ColorToken } from '@root/utils/colorTokens/types'

const COLUMN_COUNT = 2
const GROUP_HEIGHT = 32
const ROW_HEIGHT = 88
const WINDOW_HEIGHT = 320
const OVERSCAN = 176

export const useColorPicker = (colors: ColorToken[]) => {
  const [query, setQuery] = useState('')
  const [scrollTop, setScrollTop] = useState(0)
  const viewport = useRef<HTMLDivElement>(null)

  const rows = useMemo(() => {
    const filtered = colors.filter((color) =>
      `${color.id} ${color.label} ${color.group} ${color.cssValue}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase().trim()),
    )

    const groups = [...new Set(filtered.map((color) => color.group))]

    const result: {
      key: string
      group?: string
      colors: ColorToken[]
      top: number
      height: number
    }[] = []

    let top = 0

    for (const group of groups) {
      result.push({ key: `group:${group}`, group, colors: [], top, height: GROUP_HEIGHT })

      top += GROUP_HEIGHT

      const entries = filtered.filter((color) => color.group === group)

      for (let index = 0; index < entries.length; index += COLUMN_COUNT) {
        result.push({
          key: `${group}:${index}`,
          colors: entries.slice(index, index + COLUMN_COUNT),
          top,
          height: ROW_HEIGHT,
        })

        top += ROW_HEIGHT
      }
    }

    return result
  }, [colors, query])

  const visible = rows.filter(
    (row) =>
      row.top + row.height >= scrollTop - OVERSCAN &&
      row.top <= scrollTop + WINDOW_HEIGHT + OVERSCAN,
  )

  const total = rows.length ? rows[rows.length - 1].top + rows[rows.length - 1].height : 0
  const last = visible[visible.length - 1]

  const handleSearch = (value: string) => {
    setQuery(value)

    setScrollTop(0)

    if (viewport.current) {
      viewport.current.scrollTop = 0
    }
  }

  return {
    query,
    handleSearch,
    viewport,
    visible,
    top: visible[0]?.top ?? 0,
    bottom: Math.max(0, total - (last ? last.top + last.height : 0)),
    handleScroll: () => setScrollTop(viewport.current?.scrollTop ?? 0),
  }
}
