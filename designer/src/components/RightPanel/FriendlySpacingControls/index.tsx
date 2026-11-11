import { CSSProperties } from 'react'
import { Select, Stack } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import styles from './styles.module.scss'

const SPACING_STEP_PX = 4
const CUSTOM_SPACING = '__custom_spacing__'

const hasCustomEdges = (style: CSSProperties, kind: 'padding' | 'margin') =>
  (['Top', 'Right', 'Bottom', 'Left'] as const).some(
    (side) => style[`${kind}${side}`] !== undefined,
  )

const getSpacingOptions = (translate: ReturnType<typeof useBuilderI18n>['translate']) =>
  Array.from({ length: 31 }, (_, index) => {
    const pixels = index * SPACING_STEP_PX

    return {
      value: pixels === 0 ? '0' : `${pixels}px`,
      label: pixels === 0 ? translate('spacing.none') : `${pixels} px`,
    }
  })

export interface FriendlySpacingControlsProps {
  style: CSSProperties
  onChange: (style: Partial<CSSProperties>) => void
}

export const FriendlySpacingControls = ({ style, onChange }: FriendlySpacingControlsProps) => {
  const { translate } = useBuilderI18n()

  const padding = hasCustomEdges(style, 'padding')
    ? CUSTOM_SPACING
    : typeof style.padding === 'number' && style.padding !== 0
      ? `${style.padding}px`
      : String(style.padding ?? '0')

  const margin = hasCustomEdges(style, 'margin')
    ? CUSTOM_SPACING
    : typeof style.margin === 'number' && style.margin !== 0
      ? `${style.margin}px`
      : String(style.margin ?? '0')

  const presets = getSpacingOptions(translate)

  const customValues = [...new Set([padding, margin])].filter(
    (value) => value !== CUSTOM_SPACING && !presets.some((option) => option.value === value),
  )

  const options = [...presets, ...customValues.map((value) => ({ value, label: value }))]

  const getOptions = (value: string) =>
    value === CUSTOM_SPACING
      ? [
          ...options,
          { value: CUSTOM_SPACING, label: translate('spacing.customEdges'), disabled: true },
        ]
      : options

  const handlePaddingChange = (value: string) => {
    onChange({
      padding: value,
      paddingTop: undefined,
      paddingRight: undefined,
      paddingBottom: undefined,
      paddingLeft: undefined,
    })
  }

  const handleMarginChange = (value: string) => {
    onChange({
      margin: value,
      marginTop: undefined,
      marginRight: undefined,
      marginBottom: undefined,
      marginLeft: undefined,
    })
  }

  return (
    <Stack className={styles.friendlySpacingControls} gap='sm'>
      <Select
        data={getOptions(padding)}
        label={translate('spacing.inner')}
        value={padding}
        onChange={(event) => handlePaddingChange(event.target.value)}
      />
      <Select
        data={getOptions(margin)}
        label={translate('spacing.outer')}
        value={margin}
        onChange={(event) => handleMarginChange(event.target.value)}
      />
    </Stack>
  )
}
