import { Select } from '@root/components/common'
import type { BreakpointKey } from '@root/constants/breakpoints'
import { VIEWPORT_PRESETS } from '@root/constants/canvas/viewportPresets'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import styles from './styles.module.scss'

export interface ViewportSelectProps {
  value: BreakpointKey | 'custom'
  customWidth?: number
  help?: { title: string; description: string }
  onChange: (key: BreakpointKey) => void
}

export const ViewportSelect = ({ value, customWidth, help, onChange }: ViewportSelectProps) => {
  const { translate } = useBuilderI18n()

  const options = VIEWPORT_PRESETS.map((preset) => ({
    value: preset.key as string,
    label: `${translate(preset.label)} (${preset.width}px${preset.key === 'xl' ? '+' : ''})`,
  }))

  if (customWidth !== undefined) {
    options.push({
      value: 'custom',
      label: `${translate('toolbar.customSize')} (${customWidth}px)`,
    })
  }

  return (
    <Select
      className={styles.viewportSelect}
      data={options}
      help={help}
      label={translate('toolbar.screenSize')}
      value={value}
      onChange={(event) => {
        const preset = VIEWPORT_PRESETS.find((item) => item.key === event.target.value)

        if (preset) {
          onChange(preset.key)
        }
      }}
    />
  )
}
