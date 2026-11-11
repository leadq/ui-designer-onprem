import { Group, InfoPopover, Input, Select, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { getConditionNodes } from '@root/utils/conditions/conditionModel'
import { canBindText, getTextFields } from '@root/utils/flows/textBindings'
import { getNodeOptions } from '@root/utils/getNodeOptions'

export interface TextBindingEditorProps {
  node: DesignNode
}

export const TextBindingEditor = ({ node }: TextBindingEditorProps) => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const setDesignText = useEditorStore((state) => state.setTextDesignText)
  const setBinding = useEditorStore((state) => state.setTextBinding)

  if (
    !canBindText(node, registry) ||
    !getConditionNodes(nodes).some((item) => item.id === node.id)
  ) {
    return null
  }

  const fields = getTextFields(nodes, registry)

  if (!fields.length) {
    return null
  }

  const options = getNodeOptions(nodes).filter((option) =>
    fields.some((field) => field.id === option.value),
  )

  return (
    <Stack gap='xs'>
      <Select
        data={[{ value: '', label: translate('textBinding.fixed') }, ...options]}
        label={translate('textBinding.source')}
        value={node.textBinding?.sourceNodeId ?? ''}
        onChange={(event) => setBinding(node.id, event.target.value)}
      />
      {node.textBinding ? (
        <Group align='center' gap='xs' isWrapping={false}>
          <Input
            label={translate('textBinding.designText')}
            value={node.textBinding.designText ?? ''}
            onChange={(event) => setDesignText(node.id, event.target.value)}
          />
          <InfoPopover label={translate('textBinding.designTextHelp')}>
            <Text size='xs'>{translate('textBinding.hint')}</Text>
          </InfoPopover>
        </Group>
      ) : null}
    </Stack>
  )
}
