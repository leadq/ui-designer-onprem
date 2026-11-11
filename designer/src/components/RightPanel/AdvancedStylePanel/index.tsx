import type { CSSProperties } from 'react'
import { Disclosure, Divider, Select, Stack } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import { AdvancedSizingControls } from '../AdvancedSizingControls'
import { MARGIN_SIDES, PADDING_SIDES } from '../constants/styleSchema'
import type { useStylePanel } from '../hooks/useStylePanel'
import { SpacingSides } from '../SpacingSides'

export interface AdvancedStylePanelProps extends Pick<
  ReturnType<typeof useStylePanel>,
  'effectiveStyle'
> {
  onStyleChange: (key: string, value: unknown) => void
  onStylePatch: (style: Partial<CSSProperties>) => void
}

export const AdvancedStylePanel = ({
  effectiveStyle,
  onStyleChange: handleStyleChange,
  onStylePatch: handleStylePatch,
}: AdvancedStylePanelProps) => {
  const { translate } = useBuilderI18n()

  return (
    <Disclosure label={translate('stylePanel.advanced')}>
      <Stack gap='md'>
        <Select
          data={[...new Set(['block', 'flex', 'grid', effectiveStyle.display ?? 'block'])]}
          label={translate('layout.advanced.label')}
          value={effectiveStyle.display ?? 'block'}
          help={{
            title: translate('layout.advanced.label'),
            description: translate('layout.advanced.help'),
          }}
          onChange={(event) =>
            handleStylePatch({ display: event.target.value as CSSProperties['display'] })
          }
        />
        <Stack gap='sm'>
          <Divider label={translate('stylePanel.sizing')} variant='heading' />
          <AdvancedSizingControls style={effectiveStyle} onChange={handleStyleChange} />
        </Stack>
        <Stack gap='sm'>
          <Divider label={translate('stylePanel.technicalSpacing')} variant='heading' />
          <SpacingSides
            label={translate('stylePanel.padding')}
            sides={PADDING_SIDES}
            style={effectiveStyle}
            onChange={handleStyleChange}
          />
          <SpacingSides
            label={translate('stylePanel.margin')}
            sides={MARGIN_SIDES}
            style={effectiveStyle}
            onChange={handleStyleChange}
          />
        </Stack>
      </Stack>
    </Disclosure>
  )
}
