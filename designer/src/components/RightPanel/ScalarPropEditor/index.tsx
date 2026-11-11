import { Checkbox, Input, Select } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import type { PropSchema } from '@root/types/propSchema'

import { IconPropEditor } from '../IconPropEditor'

export interface ScalarPropEditorProps {
  schema: PropSchema
  selectedNodes: DesignNode[]
  onChange: (key: string, value: unknown) => void
}

export const ScalarPropEditor = ({
  schema,
  selectedNodes,
  onChange: handleChange,
}: ScalarPropEditorProps) => {
  const { translate } = useBuilderI18n()
  const disclosure = registry[selectedNodes[0].type]?.disclosure

  const label =
    disclosure && selectedNodes.every((node) => node.type === selectedNodes[0].type)
      ? schema.key === disclosure.titleProp
        ? translate('disclosure.heading')
        : schema.key === disclosure.initialExpandedProp
          ? translate('disclosure.initial')
          : schema.label
      : selectedNodes.every((node) => node.type === 'tabItem') && schema.key === 'label'
        ? translate('collectionAuthoring.title')
        : schema.label

  const isShared = selectedNodes.every(
    (node) => node.props[schema.key] === selectedNodes[0].props[schema.key],
  )

  const value = isShared ? (selectedNodes[0].props[schema.key] ?? schema.defaultValue) : undefined
  const safeValue = value ?? ''

  switch (schema.type) {
    case 'icon':
      return (
        <IconPropEditor
          value={String(value ?? '')}
          onChange={(next) => handleChange(schema.key, next)}
        />
      )

    case 'text':
      return (
        <Input
          key={schema.key}
          label={label}
          placeholder={isShared ? undefined : 'Mixed values'}
          value={safeValue as string}
          onChange={(event) => handleChange(schema.key, event.target.value)}
        />
      )
    case 'select':
      return (
        <Select
          key={schema.key}
          data={schema.options || []}
          label={label}
          value={safeValue as string}
          onChange={(event) => handleChange(schema.key, event.target.value)}
        />
      )
    case 'boolean':
      return (
        <Checkbox
          key={schema.key}
          isChecked={Boolean(value)}
          label={label}
          onChange={(checked) => handleChange(schema.key, checked)}
        />
      )
    case 'number':
      return (
        <Input
          key={schema.key}
          label={label}
          max={schema.max}
          min={schema.min}
          placeholder={isShared ? undefined : 'Mixed values'}
          type='number'
          value={safeValue as string | number}
          onChange={(event) =>
            handleChange(
              schema.key,
              Math.min(
                schema.max ?? Infinity,
                Math.max(schema.min ?? -Infinity, Number(event.target.value)),
              ),
            )
          }
        />
      )
    case 'color':
      return (
        <Input
          key={schema.key}
          label={label}
          type='color'
          value={safeValue as string}
          onChange={(event) => handleChange(schema.key, event.target.value)}
        />
      )

    default:
      return null
  }
}
