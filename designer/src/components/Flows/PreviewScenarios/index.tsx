import { Group, Select, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import { getExamples } from '@root/utils/conditions/conditionModel'

import styles from './styles.module.scss'

export const PreviewScenarios = () => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const values = useEditorStore((state) => state.prototypeExamples)
  const error = useEditorStore((state) => state.prototypeConditionError)
  const preview = useEditorStore((state) => state.previewMode)
  const setExample = useEditorStore((state) => state.setPrototypeExample)
  const examples = getExamples(nodes)

  if (!preview || (!examples.length && !error)) {
    return null
  }

  return (
    <Stack data-designer-chrome className={styles.previewScenarios} gap='xs'>
      {examples.length > 0 && (
        <Text color='muted' size='xs'>
          {translate('condition.simulationHint')}
        </Text>
      )}
      <Group isWrapping className={styles.previewScenarios__controls} gap='sm'>
        {examples.map((example) => (
          <Select
            key={example.key}
            label={`${example.label} (${translate('condition.exampleResult')})`}
            value={values[example.key] ?? example.defaultValue}
            data={(['success', 'failure'] as const).map((result) => ({
              value: result,
              label: translate(`condition.result.${result}`),
            }))}
            onChange={(event) => setExample(example.key, event.target.value)}
          />
        ))}
      </Group>
      {error ? (
        <Text role='alert'>
          {translate('condition.invalidInput')}: {error}
        </Text>
      ) : null}
    </Stack>
  )
}
