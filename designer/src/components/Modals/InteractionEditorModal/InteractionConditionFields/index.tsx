import { Checkbox, Text } from '@root/components/common'
import { ConditionEditor } from '@root/components/Flows/ConditionEditor'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DesignNode } from '@root/types/document'
import type { DesignCondition, InteractionOutcome } from '@root/types/preview'

export interface InteractionConditionFieldsProps {
  nodes: DesignNode[]
  condition: DesignCondition | undefined
  onConditionChange: (value: DesignCondition | undefined) => void
  onOtherwiseChange: (value: InteractionOutcome | undefined) => void
}

export const InteractionConditionFields = ({
  nodes,
  condition,
  onConditionChange: handleSetConditionChange,
  onOtherwiseChange: handleSetOtherwiseChange,
}: InteractionConditionFieldsProps) => {
  const { translate } = useBuilderI18n()

  return (
    <>
      {' '}
      <Checkbox
        isChecked={Boolean(condition)}
        label={translate('condition.enabled')}
        onChange={(checked) => {
          handleSetConditionChange(
            checked
              ? {
                  source: {
                    kind: 'example',
                    label: translate('condition.exampleDefault'),
                    defaultValue: 'success',
                  },
                  operator: 'equals',
                  value: 'success',
                }
              : undefined,
          )

          if (!checked) {
            handleSetOtherwiseChange(undefined)
          }
        }}
      />
      {condition ? (
        <ConditionEditor nodes={nodes} value={condition} onChange={handleSetConditionChange} />
      ) : null}
      {condition ? <Text weight={600}>{translate('condition.then')}</Text> : null}
    </>
  )
}
