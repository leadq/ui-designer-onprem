import { Select, Stack } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import type { DesignCondition } from '@root/types/preview'
import { getConditionNodes } from '@root/utils/conditions/conditionModel'

import { ConditionExampleEditor } from './ConditionExampleEditor'
import { ConditionFieldEditor } from './ConditionFieldEditor'

export interface ConditionEditorProps {
  isFieldsOnly?: boolean
  value: DesignCondition
  nodes: DesignNode[]
  onChange: (value: DesignCondition) => void
}

export const ConditionEditor = ({
  value,
  nodes,
  onChange,
  isFieldsOnly = false,
}: ConditionEditorProps) => {
  const { translate } = useBuilderI18n()
  const fields = getConditionNodes(nodes).filter((node) => registry[node.type]?.previewValue)

  return (
    <Stack gap='sm'>
      {!isFieldsOnly && (
        <Select
          label={translate('condition.source')}
          value={value.source.kind}
          data={(['field', 'example'] as const).map((kind) => ({
            value: kind,
            label: translate(`condition.source.${kind}`),
          }))}
          onChange={(event) =>
            onChange(
              event.target.value === 'field'
                ? {
                    source: { kind: 'field', nodeId: fields[0]?.id ?? '' },
                    operator: 'equals',
                    value: '',
                  }
                : {
                    source: {
                      kind: 'example',
                      label: translate('condition.exampleDefault'),
                      defaultValue: 'success',
                    },
                    operator: 'equals',
                    value: 'success',
                  },
            )
          }
        />
      )}
      {value.source.kind === 'field' ? (
        <ConditionFieldEditor
          fields={fields}
          isFieldsOnly={isFieldsOnly}
          value={value}
          onChange={onChange}
        />
      ) : (
        <ConditionExampleEditor value={value} onChange={onChange} />
      )}
    </Stack>
  )
}
