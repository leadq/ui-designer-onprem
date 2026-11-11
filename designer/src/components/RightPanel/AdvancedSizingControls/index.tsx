import type { CSSProperties } from 'react'
import { Input, SimpleGrid, Stack, Text } from '@root/components/common'
import type { BuilderTranslationKey } from '@root/contexts/BuilderI18nContext/context'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import styles from './styles.module.scss'

export interface AdvancedSizingControlsProps {
  style: CSSProperties
  onChange: (key: string, value: unknown) => void
}

interface DimensionGroup {
  labelKey: BuilderTranslationKey
  fields: {
    key: keyof CSSProperties
    labelKey: BuilderTranslationKey
    accessibleLabelKey: BuilderTranslationKey
  }[]
}

const DIMENSION_GROUPS: DimensionGroup[] = [
  {
    labelKey: 'stylePanel.width',
    fields: [
      { key: 'width', labelKey: 'stylePanel.sizeNormal', accessibleLabelKey: 'stylePanel.width' },
      {
        key: 'minWidth',
        labelKey: 'stylePanel.sizeMinimum',
        accessibleLabelKey: 'stylePanel.minWidth',
      },
      {
        key: 'maxWidth',
        labelKey: 'stylePanel.sizeMaximum',
        accessibleLabelKey: 'stylePanel.maxWidth',
      },
    ],
  },
  {
    labelKey: 'stylePanel.height',
    fields: [
      { key: 'height', labelKey: 'stylePanel.sizeNormal', accessibleLabelKey: 'stylePanel.height' },
      {
        key: 'minHeight',
        labelKey: 'stylePanel.sizeMinimum',
        accessibleLabelKey: 'stylePanel.minHeight',
      },
      {
        key: 'maxHeight',
        labelKey: 'stylePanel.sizeMaximum',
        accessibleLabelKey: 'stylePanel.maxHeight',
      },
    ],
  },
]

export const AdvancedSizingControls = ({ style, onChange }: AdvancedSizingControlsProps) => {
  const { translate } = useBuilderI18n()

  return (
    <Stack className={styles.advancedSizingControls} gap='sm'>
      {DIMENSION_GROUPS.map(({ labelKey, fields }) => (
        <Stack key={labelKey} gap='xs'>
          <Text color='secondary' size='xs' weight={500}>
            {translate(labelKey)}
          </Text>
          <SimpleGrid cols={3} spacing={4}>
            {fields.map((field) => (
              <Input
                key={field.key}
                aria-label={translate(field.accessibleLabelKey)}
                className={styles.advancedSizingControls__field}
                label={translate(field.labelKey)}
                placeholder='—'
                value={String(style[field.key] ?? '')}
                onChange={(event) => onChange(field.key, event.target.value)}
              />
            ))}
          </SimpleGrid>
        </Stack>
      ))}
      <Input
        label={translate('stylePanel.flex')}
        placeholder='—'
        value={String(style.flex ?? '')}
        onChange={(event) => onChange('flex', event.target.value)}
      />
    </Stack>
  )
}
