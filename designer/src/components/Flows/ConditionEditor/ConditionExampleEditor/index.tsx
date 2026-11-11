import { Input, Select, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DesignCondition } from '@root/types/preview'

export interface ConditionExampleEditorProps {
  value: DesignCondition
  onChange: (value: DesignCondition) => void
}

export const ConditionExampleEditor = ({ value, onChange }: ConditionExampleEditorProps) => {
  const { translate } = useBuilderI18n()

  if (value.source.kind !== 'example') {
    return null
  }

  return (
    <>
      <Input
        label={translate('condition.exampleName')}
        value={value.source.label}
        onChange={(event) =>
          onChange({
            ...value,
            source: {
              kind: 'example',
              label: event.target.value,
              defaultValue: value.source.kind === 'example' ? value.source.defaultValue : 'success',
            },
          })
        }
      />
      <Select
        label={translate('condition.exampleExpected')}
        value={String(value.value)}
        data={(['success', 'failure'] as const).map((result) => ({
          value: result,
          label: translate(`condition.result.${result}`),
        }))}
        onChange={(event) => onChange({ ...value, value: event.target.value })}
      />
      <Select
        label={translate('condition.exampleInitial')}
        value={value.source.defaultValue}
        data={(['success', 'failure'] as const).map((result) => ({
          value: result,
          label: translate(`condition.result.${result}`),
        }))}
        onChange={(event) =>
          onChange({
            ...value,
            source: {
              kind: 'example',
              label: value.source.kind === 'example' ? value.source.label : '',
              defaultValue: event.target.value as 'success' | 'failure',
            },
          })
        }
      />
      <Text color='muted' size='xs'>
        {translate('condition.simulationHint')}
      </Text>
    </>
  )
}
