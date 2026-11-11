import { Box, Button, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import type { PropSchema } from '@root/types/propSchema'
import { getStyleAtBreakpoint } from '@root/utils/layout/getStyleAtBreakpoint'
import { getPropsAtBreakpoint } from '@root/utils/responsive/getPropsAtBreakpoint'

import { ScalarPropEditor } from '../ScalarPropEditor'

import styles from './styles.module.scss'

export interface ResponsivePropEditorProps {
  schema: PropSchema
  selectedNodes: DesignNode[]
  onChange: (key: string, value: unknown) => void
}

export const ResponsivePropEditor = ({
  schema,
  selectedNodes,
  onChange,
}: ResponsivePropEditorProps) => {
  const { translate } = useBuilderI18n()
  const breakpoint = useEditorStore((state) => state.activeBreakpoint)
  const updateResponsiveProps = useEditorStore((state) => state.updateResponsiveProps)
  const isScoped = schema.isResponsive && breakpoint !== 'xl'

  const hasOverride =
    isScoped &&
    selectedNodes.some((node) =>
      Object.hasOwn(node.responsiveProps?.[breakpoint] ?? {}, schema.key),
    )

  const isSpacingOverridden =
    ['padding', 'margin'].includes(schema.key) &&
    selectedNodes.some((node) => {
      const style = getStyleAtBreakpoint(node, breakpoint)

      return Object.entries(style).some(
        ([key, value]) =>
          value !== undefined &&
          [
            schema.key,
            ...['Top', 'Right', 'Bottom', 'Left'].map((side) => `${schema.key}${side}`),
          ].includes(key),
      )
    })

  const resolved = selectedNodes.map((node) => ({
    ...node,
    props: getPropsAtBreakpoint(node, breakpoint, registry[node.type]),
  }))

  const handleChange = (key: string, value: unknown) => {
    if (
      schema.isResponsive &&
      (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
    ) {
      updateResponsiveProps(
        selectedNodes.map((node) => node.id),
        key,
        value,
      )
    } else {
      onChange(key, value)
    }
  }

  const handleResetClick = () =>
    updateResponsiveProps(
      selectedNodes.map((node) => node.id),
      schema.key,
      undefined,
    )

  return (
    <Box className={styles.responsivePropEditor}>
      <ScalarPropEditor schema={schema} selectedNodes={resolved} onChange={handleChange} />
      {isSpacingOverridden ? (
        <Text color='secondary' size='xs'>
          {translate('spacing.layoutOverride')}
        </Text>
      ) : null}
      {hasOverride ? (
        <Box className={styles.responsivePropEditor__scope}>
          <Text color='secondary' size='xs'>
            {translate('responsive.overriddenProp')}
          </Text>
          <Button
            aria-label={`${translate('responsive.resetProp')}: ${schema.label}`}
            size='sm'
            variant='ghost'
            onClick={handleResetClick}
          >
            {translate('responsive.resetProp')}
          </Button>
        </Box>
      ) : null}
    </Box>
  )
}
