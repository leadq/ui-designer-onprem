import { Select, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DesignNode } from '@root/types/document'
import type { InteractionOutcome } from '@root/types/preview'
import { getContainingScreen } from '@root/utils/flows/flowModel'
import { getOutcomeTargets } from '@root/utils/flows/getOutcomeTargets'

export interface OutcomeEditorProps {
  nodes: DesignNode[]
  sourceId: string
  value: InteractionOutcome
  onChange: (value: InteractionOutcome) => void
  prefix?: string
}

export const OutcomeEditor = ({
  nodes,
  sourceId,
  value,
  onChange,
  prefix = '',
}: OutcomeEditorProps) => {
  const { translate } = useBuilderI18n()
  const targets = getOutcomeTargets(nodes, sourceId, value.action)

  const handleAction = (
    action: InteractionOutcome['action'],
    intent?: InteractionOutcome['intent'],
  ) => {
    const targets = getOutcomeTargets(nodes, sourceId, action)

    onChange({
      action,
      targetNodeId: targets.some((target) => target.value === value.targetNodeId)
        ? value.targetNodeId
        : (targets[0]?.value ?? ''),
      ...(action === 'goTo' && intent ? { intent } : {}),
    })
  }

  const selectedChoice = value.action === 'goTo' ? (value.intent ?? 'goTo') : value.action

  const choices = [
    'formStep',
    'navigation',
    'stateChange',
    'goTo',
    'openOverlay',
    'closeOverlay',
  ] as const

  const isLegacy = ['show', 'hide', 'toggle'].includes(selectedChoice)
  const sourceScreen = getContainingScreen(nodes, sourceId)

  const isClosingSelf =
    value.action === 'closeOverlay' &&
    sourceScreen?.overlay &&
    value.targetNodeId === sourceScreen.id

  return (
    <Stack gap='sm'>
      {isLegacy ? (
        <Text color='muted' size='sm'>
          {translate('componentState.legacyAction')}
        </Text>
      ) : null}
      <Select
        label={`${prefix}${translate('interaction.action')}`}
        value={selectedChoice}
        data={[
          ...(isLegacy
            ? [
                {
                  value: selectedChoice,
                  label: translate(`interaction.action.${value.action}`),
                  disabled: true,
                },
              ]
            : []),
          ...choices.map((choice) => ({
            value: choice,
            label: translate(
              choice === 'formStep' || choice === 'navigation' || choice === 'stateChange'
                ? `interaction.intent.${choice}`
                : `interaction.action.${choice}`,
            ),
          })),
        ]}
        help={{
          title: translate('interaction.actionHelpTitle'),
          description: translate('interaction.actionHelp'),
        }}
        onChange={(event) => {
          const choice = event.target.value

          if (choice === 'closeOverlay' && sourceScreen?.overlay) {
            onChange({ action: 'closeOverlay', targetNodeId: sourceScreen.id })
          } else if (['formStep', 'navigation', 'stateChange'].includes(choice)) {
            handleAction('goTo', choice as InteractionOutcome['intent'])
          } else {
            handleAction(choice as InteractionOutcome['action'], undefined)
          }
        }}
      />
      {isClosingSelf ? (
        <Text color='muted' size='sm'>
          {translate('interaction.closeCurrentHint')}
        </Text>
      ) : (
        <Select
          data={targets}
          label={`${prefix}${translate('interaction.target')}`}
          value={value.targetNodeId}
          help={{
            title: translate('interaction.targetHelpTitle'),
            description: translate('interaction.targetHelp'),
          }}
          onChange={(event) => onChange({ ...value, targetNodeId: event.target.value })}
        />
      )}
      {!targets.length && (
        <Text color='muted' size='xs'>
          {translate(
            value.action === 'openOverlay'
              ? 'interaction.createWindowHint'
              : 'interaction.createScreenHint',
          )}
        </Text>
      )}
    </Stack>
  )
}
