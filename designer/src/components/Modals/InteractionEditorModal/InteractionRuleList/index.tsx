import { Button, Group, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DesignNode } from '@root/types/document'
import type { DesignInteraction } from '@root/types/preview'
import type { getNodeOptions } from '@root/utils/getNodeOptions'

import styles from '../styles.module.scss'

export interface InteractionRuleListProps {
  node: DesignNode | null
  allTargets: ReturnType<typeof getNodeOptions>
  editingId: string | null
  onEdit: (interaction: DesignInteraction) => void
  onRemove: (id: string) => void
}

export const InteractionRuleList = ({
  node,
  allTargets,
  editingId,
  onEdit: handleRuleEdit,
  onRemove: handleRuleRemove,
}: InteractionRuleListProps) => {
  const { translate } = useBuilderI18n()

  return (
    <Stack gap='xs'>
      {node?.interactions?.map((interaction) => (
        <Group key={interaction.id} className={styles.interactionEditor__item} justify='between'>
          <Text size='sm'>
            {translate(`interaction.trigger.${interaction.trigger}`)} →{' '}
            {translate(`interaction.action.${interaction.action}`)} →{' '}
            {allTargets.find((target) => target.value === interaction.targetNodeId)?.label ??
              interaction.targetNodeId}{' '}
            {interaction.intent ? `(${translate(`interaction.intent.${interaction.intent}`)})` : ''}
            {interaction.condition ? ` · ${translate('condition.enabled')}` : ''}
            {interaction.otherwise
              ? ` · ${translate('condition.else')} → ${allTargets.find((target) => target.value === interaction.otherwise?.targetNodeId)?.label ?? interaction.otherwise.targetNodeId}`
              : ''}
          </Text>
          {editingId === interaction.id ? (
            <Text color='muted' size='sm' weight={600}>
              {translate('interaction.editing')}
            </Text>
          ) : (
            <Button variant='ghost' onClick={() => handleRuleEdit(interaction)}>
              {translate('interaction.edit')}
            </Button>
          )}
          <Button variant='ghost' onClick={() => handleRuleRemove(interaction.id)}>
            {translate('interaction.remove')}
          </Button>
        </Group>
      ))}
      {!node?.interactions?.length && <Text color='muted'>{translate('interaction.empty')}</Text>}
    </Stack>
  )
}
