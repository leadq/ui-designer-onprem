import { Box, Button, Input, Text } from '@root/components/common'
import { ButtonBase } from '@root/components/common/ButtonBase'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { ColorToken } from '@root/utils/colorTokens/types'

import { useColorPicker } from './hooks/useColorPicker'

import styles from './styles.module.scss'

export interface ColorPickerProps {
  colors: ColorToken[]
  value?: string
  onChange: (id?: string) => void
}

export const ColorPicker = ({ colors, value, onChange }: ColorPickerProps) => {
  const picker = useColorPicker(colors)
  const { translate } = useBuilderI18n()

  return (
    <Box data-canvas-control className={styles.colorPicker}>
      <Input
        label={translate('colors.search')}
        placeholder={translate('colors.search')}
        type='search'
        value={picker.query}
        onChange={(event) => picker.handleSearch(event.target.value)}
      />
      <Button size='sm' variant='ghost' onClick={() => onChange(undefined)}>
        {translate('colors.reset')}
      </Button>
      <Box
        ref={picker.viewport}
        aria-label={translate('colors.palette')}
        className={styles.colorPicker__viewport}
        tabIndex={0}
        onScroll={picker.handleScroll}
      >
        <Box aria-hidden style={{ height: picker.top }} />
        {picker.visible.map((row) =>
          row.group ? (
            <Text key={row.key} className={styles.colorPicker__group} weight={600}>
              {row.group}
            </Text>
          ) : (
            <Box key={row.key} className={styles.colorPicker__row}>
              {row.colors.map((color) => (
                <ButtonBase
                  key={color.id}
                  aria-label={color.label}
                  aria-pressed={value === color.id}
                  className={styles.colorPicker__choice}
                  data-color-choice={color.id}
                  title={color.id}
                  onClick={() => onChange(color.id)}
                >
                  <Box
                    aria-hidden
                    className={styles.colorPicker__swatch}
                    style={{ backgroundColor: color.cssValue }}
                  />
                  <Text className={styles.colorPicker__name} size='xs'>
                    {color.label}
                  </Text>
                </ButtonBase>
              ))}
            </Box>
          ),
        )}
        <Box aria-hidden style={{ height: picker.bottom }} />
        {!picker.visible.length ? <Text>{translate('colors.empty')}</Text> : null}
      </Box>
    </Box>
  )
}
