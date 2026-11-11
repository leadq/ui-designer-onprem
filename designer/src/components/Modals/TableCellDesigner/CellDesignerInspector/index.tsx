import type { CSSProperties } from 'react'
import { Box, Input, Select, Stack, Text } from '@root/components/common'
import { FriendlySpacingControls } from '@root/components/RightPanel/FriendlySpacingControls'
import { ScalarPropEditor } from '@root/components/RightPanel/ScalarPropEditor'
import { VisualSpacingEditor } from '@root/components/RightPanel/VisualSpacingEditor'
import type { BreakpointKey } from '@root/constants/breakpoints'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import { getStyleAtBreakpoint } from '@root/utils/layout/getStyleAtBreakpoint'
import { getPropsAtBreakpoint } from '@root/utils/responsive/getPropsAtBreakpoint'

import styles from './styles.module.scss'

export interface CellDesignerInspectorProps {
  node: DesignNode
  breakpoint: BreakpointKey
  onProps: (key: string, value: unknown) => void
  onStyle: (value: CSSProperties) => void
}

export const CellDesignerInspector = ({
  node,
  breakpoint,
  onProps,
  onStyle,
}: CellDesignerInspectorProps) => {
  const { translate } = useBuilderI18n()
  const meta = registry[node.type]
  const props = getPropsAtBreakpoint(node, breakpoint, meta)

  const style = getStyleAtBreakpoint(node, breakpoint, {
    ...meta.defaultStyle,
    ...meta.getDefaultLayoutStyle?.(props),
  })

  return (
    <Box className={styles.cellDesignerInspector}>
      <Stack gap='md'>
        <Text weight={600}>{node.label ?? meta.displayName}</Text>
        <Text color='secondary' size='xs'>
          {translate('cellDesigner.scope', { breakpoint })}
        </Text>
        {meta.propsSchema
          .filter((schema) =>
            ['icon', 'text', 'number', 'select', 'boolean', 'color'].includes(schema.type),
          )
          .map((schema) => (
            <ScalarPropEditor
              key={schema.key}
              schema={schema}
              selectedNodes={[{ ...node, props }]}
              onChange={onProps}
            />
          ))}
        {meta.isContainer ? (
          <Select
            label={translate('cellDesigner.direction')}
            value={style.flexDirection ?? 'column'}
            data={[
              { value: 'column', label: translate('cellDesigner.column') },
              { value: 'row', label: translate('cellDesigner.row') },
            ]}
            onChange={(event) =>
              onStyle({ display: 'flex', flexDirection: event.target.value as 'row' | 'column' })
            }
          />
        ) : null}
        {(['gap', 'width', 'height'] as const).map((key) => (
          <Input
            key={key}
            label={translate(`cellDesigner.${key}`)}
            value={String(style[key] ?? '')}
            onChange={(event) => {
              const value = event.target.value

              onStyle({
                [key]:
                  value === '' ? undefined : /^-?\d+(\.\d+)?$/.test(value) ? Number(value) : value,
              })
            }}
          />
        ))}
        <FriendlySpacingControls style={style} onChange={onStyle} />
        <VisualSpacingEditor style={style} onChange={onStyle} />
      </Stack>
    </Box>
  )
}
