import { type CSSProperties, type FocusEvent, type KeyboardEvent } from 'react'
import { Input, Select, SimpleGrid, Stack } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { getNodeElement, getNodeLayoutStyle } from '@root/utils/canvas/hitTesting'
import { getContentSizeStyle } from '@root/utils/layout/getContentSizeStyle'
import { getFillSizeStyle } from '@root/utils/layout/getFillSizeStyle'
import { getFixedSizeStyle } from '@root/utils/layout/getFixedSizeStyle'
import { getSizeMode } from '@root/utils/layout/getSizeMode'
import { getStyleAtBreakpoint } from '@root/utils/layout/getStyleAtBreakpoint'
import type { SizeAxis, SizeMode } from '@root/utils/layout/types'
import { findParent } from '@root/utils/nodes'

import styles from './styles.module.scss'

const DEFAULT_FIXED_WIDTH = 200
const DEFAULT_FIXED_HEIGHT = 80

interface SizingModeControlsProps {
  node: DesignNode
  style: CSSProperties
  onChange: (style: Partial<CSSProperties>) => void
}

const getPixelValue = (value: CSSProperties['width']): string => {
  const parsedValue = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''))

  return Number.isFinite(parsedValue) ? String(Math.round(parsedValue)) : ''
}

export const SizingModeControls = ({ node, style, onChange }: SizingModeControlsProps) => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const canvasZoom = useEditorStore((state) => state.canvasZoom)
  const activeBreakpoint = useEditorStore((state) => state.activeBreakpoint)
  const parent = findParent(nodes, node.id)

  const parentStyle = parent
    ? (getNodeLayoutStyle(parent.id) ??
      getStyleAtBreakpoint(parent, activeBreakpoint, registry[parent.type]?.defaultStyle))
    : undefined

  const widthMode = getSizeMode(style, 'horizontal', parentStyle)
  const heightMode = getSizeMode(style, 'vertical', parentStyle)

  const handleModeChange = (axis: SizeAxis, mode: SizeMode) => {
    if (mode === 'content') {
      onChange(getContentSizeStyle(axis, parentStyle))

      return
    }

    if (mode === 'fill') {
      onChange(getFillSizeStyle(axis, parentStyle))

      return
    }

    const element = getNodeElement(node.id)
    const rect = element?.getBoundingClientRect()
    const fallback = axis === 'horizontal' ? DEFAULT_FIXED_WIDTH : DEFAULT_FIXED_HEIGHT
    const pixels = rect ? (axis === 'horizontal' ? rect.width : rect.height) / canvasZoom : fallback

    onChange(getFixedSizeStyle(axis, pixels, parentStyle))
  }

  const handleFixedSizeBlur = (axis: SizeAxis, event: FocusEvent<HTMLInputElement>) => {
    const pixels = Number.parseFloat(event.target.value)

    if (!Number.isFinite(pixels) || pixels <= 0) {
      return
    }

    onChange(getFixedSizeStyle(axis, pixels, parentStyle))
  }

  const handleFixedSizeKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
    }
  }

  const options = [
    { value: 'content', label: translate('sizing.content') },
    { value: 'fixed', label: translate('sizing.fixed') },
    { value: 'fill', label: translate('sizing.fill') },
  ]

  return (
    <SimpleGrid className={styles.sizingModeControls} cols={2} spacing={8}>
      <Stack gap={6}>
        <Select
          data={options}
          label={translate('sizing.widthMode')}
          value={widthMode}
          onChange={(event) => handleModeChange('horizontal', event.target.value as SizeMode)}
        />
        {widthMode === 'fixed' && (
          <Input
            key={`width-${String(style.width)}`}
            defaultValue={getPixelValue(style.width)}
            label={`${translate('stylePanel.width')} (px)`}
            min={1}
            type='number'
            onBlur={(event) => handleFixedSizeBlur('horizontal', event)}
            onKeyDown={handleFixedSizeKeyDown}
          />
        )}
      </Stack>
      <Stack gap={6}>
        <Select
          data={options}
          label={translate('sizing.heightMode')}
          value={heightMode}
          onChange={(event) => handleModeChange('vertical', event.target.value as SizeMode)}
        />
        {heightMode === 'fixed' && (
          <Input
            key={`height-${String(style.height)}`}
            defaultValue={getPixelValue(style.height)}
            label={`${translate('stylePanel.height')} (px)`}
            min={1}
            type='number'
            onBlur={(event) => handleFixedSizeBlur('vertical', event)}
            onKeyDown={handleFixedSizeKeyDown}
          />
        )}
      </Stack>
    </SimpleGrid>
  )
}
