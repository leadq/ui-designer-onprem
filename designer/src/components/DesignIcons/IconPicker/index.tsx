import { Box, Input, Text } from '@root/components/common'
import { ButtonBase } from '@root/components/common/ButtonBase'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import { IconGraphic } from '../IconGraphic'

import { useIconPicker } from './hooks/useIconPicker'

import styles from './styles.module.scss'

export interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const { translate } = useBuilderI18n()
  const picker = useIconPicker()

  return (
    <Box data-canvas-control className={styles.iconPicker}>
      <Input
        aria-label={translate('icons.search')}
        label={translate('icons.search')}
        type='search'
        value={picker.query}
        onChange={(event) => picker.handleQueryChange(event.target.value)}
      />
      <Text color='muted' role='status' size='xs'>
        {translate('icons.results', { count: picker.entries.length })}
      </Text>
      <Box
        ref={picker.viewport}
        aria-label={translate('icons.list')}
        className={styles.iconPicker__viewport}
        tabIndex={0}
        onScroll={picker.handleScroll}
      >
        <Box aria-hidden style={{ height: picker.top }} />
        <Box className={styles.iconPicker__grid}>
          {picker.visible.map((entry) => (
            <ButtonBase
              key={entry.key}
              aria-label={`${entry.name} (${entry.library.name})`}
              aria-pressed={entry.key === value}
              className={styles.iconPicker__choice}
              data-icon-choice={entry.key}
              title={entry.name}
              onClick={() => onChange(entry.key)}
            >
              <Box aria-hidden className={styles.iconPicker__preview}>
                <IconGraphic size={22} value={entry.key} />
              </Box>
              <Text className={styles.iconPicker__name} size='xs'>
                {entry.name}
              </Text>
            </ButtonBase>
          ))}
        </Box>
        <Box aria-hidden style={{ height: picker.bottom }} />
        {picker.entries.length === 0 ? <Text size='sm'>{translate('icons.empty')}</Text> : null}
      </Box>
    </Box>
  )
}
