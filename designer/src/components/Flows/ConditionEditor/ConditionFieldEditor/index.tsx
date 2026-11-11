import { Input, Select } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import type { DesignCondition } from '@root/types/preview'
import { CONDITION_OPERATORS } from '@root/utils/conditions/conditionModel'

export interface ConditionFieldEditorProps {
  value: DesignCondition
  onChange: (value: DesignCondition) => void
  fields: DesignNode[]
  isFieldsOnly: boolean
}

export const ConditionFieldEditor = ({
  value,
  onChange,
  fields,
  isFieldsOnly,
}: ConditionFieldEditorProps) => {
  const { translate } = useBuilderI18n()

  if (value.source.kind !== 'field') {
    return null
  }

  const numeric = !['equals', 'notEquals', 'empty', 'notEmpty'].includes(value.operator)

  return (
    <>
      <Select
        label={translate('condition.field')}
        value={value.source.nodeId}
        data={fields.map((node) => ({
          value: node.id,
          label: node.label ?? String(node.props.label ?? registry[node.type].displayName),
        }))}
        onChange={(event) => {
          const field = fields.find((node) => node.id === event.target.value)

          const isBoolean =
            field && typeof registry[field.type]?.previewValue?.emptyValue === 'boolean'

          onChange(
            isFieldsOnly
              ? {
                  source: { kind: 'field', nodeId: event.target.value },
                  ...(isBoolean ? { operator: 'equals', value: true } : { operator: 'notEmpty' }),
                }
              : { ...value, source: { kind: 'field', nodeId: event.target.value } },
          )
        }}
      />
      <Select
        label={translate('condition.operator')}
        value={value.operator}
        data={CONDITION_OPERATORS.map((operator) => ({
          value: operator,
          label: translate(`condition.operator.${operator}`),
        }))}
        onChange={(event) =>
          onChange({
            ...value,
            operator: event.target.value as DesignCondition['operator'],
            value: ['equals', 'notEquals', 'empty', 'notEmpty'].includes(event.target.value)
              ? ''
              : 0,
            ...(event.target.value === 'between' ? { upperValue: 5000 } : {}),
          })
        }
      />
      {['equals', 'notEquals'].includes(value.operator) && (
        <Select
          label={translate('condition.valueType')}
          value={typeof value.value}
          data={(['string', 'number', 'boolean'] as const).map((type) => ({
            value: type,
            label: translate(`condition.type.${type}`),
          }))}
          onChange={(event) =>
            onChange({
              ...value,
              value:
                event.target.value === 'boolean' ? true : event.target.value === 'number' ? 0 : '',
            })
          }
        />
      )}
      {!['empty', 'notEmpty'].includes(value.operator) &&
        (typeof value.value === 'boolean' ? (
          <Select
            label={translate('condition.value')}
            value={String(value.value)}
            data={[
              { value: 'true', label: translate('condition.true') },
              { value: 'false', label: translate('condition.false') },
            ]}
            onChange={(event) => onChange({ ...value, value: event.target.value === 'true' })}
          />
        ) : (
          <Input
            label={translate('condition.value')}
            type={numeric || typeof value.value === 'number' ? 'number' : 'text'}
            value={value.value === null || value.value === undefined ? '' : String(value.value)}
            onChange={(event) =>
              onChange({
                ...value,
                value:
                  numeric || typeof value.value === 'number'
                    ? event.target.value === ''
                      ? undefined
                      : Number(event.target.value)
                    : event.target.value,
              })
            }
          />
        ))}
      {value.operator === 'between' && (
        <Input
          label={translate('condition.upperValue')}
          type='number'
          value={value.upperValue ?? ''}
          onChange={(event) =>
            onChange({
              ...value,
              upperValue: event.target.value === '' ? undefined : Number(event.target.value),
            })
          }
        />
      )}
    </>
  )
}
