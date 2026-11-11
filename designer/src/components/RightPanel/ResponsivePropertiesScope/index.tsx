import { Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { PropSchema } from '@root/types/propSchema'

import { BreakpointSelector } from '../BreakpointSelector'

export interface ResponsivePropertiesScopeProps {
  schemas: PropSchema[]
}

export const ResponsivePropertiesScope = ({ schemas }: ResponsivePropertiesScopeProps) => {
  const { translate } = useBuilderI18n()
  const hasResponsiveProperties = schemas.some((schema) => schema.isResponsive)

  if (schemas.length === 0) {
    return null
  }

  return (
    <Stack gap='sm'>
      {hasResponsiveProperties ? <BreakpointSelector /> : null}
      <Text color='secondary' size='xs'>
        {translate(
          hasResponsiveProperties
            ? 'responsive.propertiesScope'
            : 'responsive.sharedPropertiesScope',
        )}
      </Text>
    </Stack>
  )
}
