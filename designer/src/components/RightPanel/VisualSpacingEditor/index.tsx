import type { CSSProperties } from 'react'
import { Box, Disclosure, Select, Text } from '@root/components/common'
import type { BuilderTranslationKey } from '@root/contexts/BuilderI18nContext/context'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { getSpacingSideValue } from '@root/utils/layout/spacing'

import styles from './styles.module.scss'

const SPACING_STEP_PX = 4

interface SpacingSide {
  key: keyof CSSProperties
  position: 'top' | 'right' | 'bottom' | 'left'
  labelKey: BuilderTranslationKey
}

export interface VisualSpacingEditorProps {
  style: CSSProperties
  onChange: (style: Partial<CSSProperties>) => void
}

const PADDING_SIDES: SpacingSide[] = [
  { key: 'paddingTop', position: 'top', labelKey: 'stylePanel.top' },
  { key: 'paddingRight', position: 'right', labelKey: 'stylePanel.right' },
  { key: 'paddingBottom', position: 'bottom', labelKey: 'stylePanel.bottom' },
  { key: 'paddingLeft', position: 'left', labelKey: 'stylePanel.left' },
]

const MARGIN_SIDES: SpacingSide[] = [
  { key: 'marginTop', position: 'top', labelKey: 'stylePanel.top' },
  { key: 'marginRight', position: 'right', labelKey: 'stylePanel.right' },
  { key: 'marginBottom', position: 'bottom', labelKey: 'stylePanel.bottom' },
  { key: 'marginLeft', position: 'left', labelKey: 'stylePanel.left' },
]

const SPACING_OPTIONS = Array.from({ length: 31 }, (_, index) => ({
  value: `${index * SPACING_STEP_PX}px`,
  label: `${index * SPACING_STEP_PX} px`,
}))

export const VisualSpacingEditor = ({ style, onChange }: VisualSpacingEditorProps) => {
  const { translate } = useBuilderI18n()

  const getOptions = (value: string, isMargin: boolean) => {
    const options = [
      ...(isMargin ? [{ value: 'auto', label: translate('spacing.auto') }] : []),
      ...SPACING_OPTIONS,
    ]

    return options.some((option) => option.value === value)
      ? options
      : [...options, { value, label: value }]
  }

  const renderSpacingBox = (labelKey: BuilderTranslationKey, sides: SpacingSide[]) => (
    <Box className={styles.visualSpacingEditor__box}>
      <Text className={styles.visualSpacingEditor__label} size='xs' weight={600}>
        {translate(labelKey)}
      </Text>
      {sides.map((side) => {
        const value = getSpacingSideValue(
          style,
          labelKey === 'spacing.outer' ? 'margin' : 'padding',
          side.position,
        )

        return (
          <Select
            key={side.key as string}
            isCompact
            aria-label={`${translate(labelKey)} - ${translate(side.labelKey)}`}
            className={`${styles.visualSpacingEditor__input} ${styles[`visualSpacingEditor__input--${side.position}`]}`}
            data={getOptions(value, labelKey === 'spacing.outer')}
            value={value}
            onChange={(event) => onChange({ [side.key]: event.target.value })}
          />
        )
      })}
      <Box className={styles.visualSpacingEditor__center}>
        <Text color='muted' size='xs'>
          {translate('spacing.item')}
        </Text>
      </Box>
    </Box>
  )

  return (
    <Disclosure label={translate('spacing.edges')}>
      <Box className={styles.visualSpacingEditor}>
        <Box className={styles.visualSpacingEditor__boxes}>
          {renderSpacingBox('spacing.outer', MARGIN_SIDES)}
          {renderSpacingBox('spacing.inner', PADDING_SIDES)}
        </Box>
      </Box>
    </Disclosure>
  )
}
