import { useState } from 'react'
import { getAdapter } from '@root/adapters'
import { ColorPicker } from '@root/components/Colors/ColorPicker'
import { Box, Divider, Stack, Text } from '@root/components/common'
import { Disclosure } from '@root/components/common/Disclosure'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { getStyleTokens } from '@root/utils/colorTokens/getStyleTokens'
import type { ColorProperty } from '@root/utils/colorTokens/types'

import styles from './styles.module.scss'

export interface ColorStylePanelProps {
  nodes: DesignNode[]
}

export const ColorStylePanel = ({ nodes }: ColorStylePanelProps) => {
  const adapterId = useEditorStore((state) => state.adapterId)
  const breakpoint = useEditorStore((state) => state.activeBreakpoint)
  const update = useEditorStore((state) => state.updateColorToken)
  const [openProperty, setOpenProperty] = useState<ColorProperty | null>(null)
  const { translate } = useBuilderI18n()
  const colors = getAdapter(adapterId).colors ?? []

  if (
    !colors.length ||
    nodes.some((node) => ['designerFrame', 'designerFlow'].includes(node.type))
  ) {
    return null
  }

  return (
    <Stack className={styles.colorStylePanel} gap='sm'>
      <Divider label={translate('colors.title')} variant='heading' />
      {(['backgroundColor', 'color', 'borderColor'] as const).map((property) => {
        const available = colors.filter((color) => color.usages.includes(property))
        const first = getStyleTokens(nodes[0], breakpoint)[property]
        const isShared = nodes.every((node) => getStyleTokens(node, breakpoint)[property] === first)
        const selected = isShared ? colors.find((color) => color.id === first) : undefined

        if (!available.length) {
          return null
        }

        return (
          <Disclosure
            key={property}
            isOpen={openProperty === property}
            label={translate(`colors.${property}`)}
            indicator={
              <Box className={styles.colorStylePanel__indicator}>
                {selected ? (
                  <Box
                    className={styles.colorStylePanel__sample}
                    style={{ backgroundColor: selected.cssValue }}
                  />
                ) : null}
                <Text size='xs'>
                  {selected?.label ?? translate(isShared ? 'colors.inherited' : 'colors.mixed')}
                </Text>
              </Box>
            }
            onToggle={(isOpen) =>
              setOpenProperty((current) =>
                isOpen ? property : current === property ? null : current,
              )
            }
          >
            {openProperty === property ? (
              <ColorPicker
                colors={available}
                value={isShared ? first : undefined}
                onChange={(id) =>
                  update(
                    nodes.map((node) => node.id),
                    breakpoint,
                    property,
                    id,
                  )
                }
              />
            ) : null}
          </Disclosure>
        )
      })}
      <Text color='secondary' size='xs'>
        {translate('colors.borderHint')}
      </Text>
    </Stack>
  )
}
