import type { CSSProperties } from 'react'
import { SimpleGrid, Stack, Text } from '@root/components/common'
import type { BuilderTranslationKey } from '@root/contexts/BuilderI18nContext/context'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import { SpacingInput } from '../SpacingInput'

export interface SpacingSidesProps {
  label: string
  sides: { key: keyof CSSProperties; labelKey: BuilderTranslationKey }[]
  style: CSSProperties
  onChange: (key: string, value: unknown) => void
}

export const SpacingSides = ({ label, sides, style, onChange }: SpacingSidesProps) => {
  const { translate } = useBuilderI18n()

  return (
    <Stack gap='xs'>
      <Text color='secondary' size='xs'>
        {label}
      </Text>
      <SimpleGrid cols={4} spacing={4}>
        {sides.map(({ key, labelKey }) => (
          <SpacingInput
            key={key as string}
            label={translate(labelKey)}
            placeholder='—'
            value={(style[key] as string) ?? ''}
            onChange={(value) => onChange(key as string, value)}
          />
        ))}
      </SimpleGrid>
    </Stack>
  )
}
