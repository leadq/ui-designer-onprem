import { Box, Button, Checkbox, Group, Modal, Select, Stack, Text } from '@root/components/common'
import { OutcomeEditor } from '@root/components/Flows/OutcomeEditor'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DesignInteractionTrigger } from '@root/types/flow'
import { getOutcomeTargets } from '@root/utils/flows/getOutcomeTargets'

import { useInteractionEditor } from './hooks/useInteractionEditor'
import { InteractionConditionFields } from './InteractionConditionFields'
import { InteractionRuleList } from './InteractionRuleList'

import styles from './styles.module.scss'

export interface InteractionEditorModalProps {
  nodeId: string
  initialRuleId?: string
  isOpen: boolean
  onClose: () => void
}

export const InteractionEditorModal = ({
  nodeId,
  initialRuleId,
  isOpen: opened,
  onClose,
}: InteractionEditorModalProps) => {
  const { translate } = useBuilderI18n()

  const {
    handleRuleEdit,
    handleRuleRemove,
    nodes,
    node,
    allTargets,
    trigger,
    setTrigger,
    outcome,
    condition,
    otherwise,
    setOtherwise,
    editingId,
    setEditingId,
    error,
    setError,
    isFormOpen,
    setIsFormOpen,
    isSaved,
    targets,
    handleNewClick,
    handleSetConditionChange,
    handleSetOutcomeChange,
    handleSetOtherwiseChange,
    handleAddClick,
  } = useInteractionEditor(nodeId, initialRuleId, opened)

  return (
    <Modal isOpen={opened} size='lg' title={translate('interaction.title')} onClose={onClose}>
      <Stack gap='md'>
        {isSaved ? (
          <Text role='status' size='sm'>
            {translate('interaction.saved')}
          </Text>
        ) : null}
        {!isFormOpen && (
          <Button variant='secondary' onClick={handleNewClick}>
            {translate('interaction.new')}
          </Button>
        )}
        {isFormOpen ? (
          <Box className={styles.interactionEditor__form}>
            <Select
              label={translate('interaction.trigger')}
              value={trigger}
              data={(['click', 'change'] as const).map((value) => ({
                value,
                label: translate(`interaction.trigger.${value}`),
              }))}
              onChange={(event) => setTrigger(event.target.value as DesignInteractionTrigger)}
            />
            <InteractionConditionFields
              condition={condition}
              nodes={nodes}
              onConditionChange={handleSetConditionChange}
              onOtherwiseChange={handleSetOtherwiseChange}
            />
            <OutcomeEditor
              nodes={nodes}
              sourceId={nodeId}
              value={outcome}
              onChange={handleSetOutcomeChange}
            />
            {condition ? (
              <Checkbox
                isChecked={Boolean(otherwise)}
                label={translate('condition.useElse')}
                onChange={(checked) =>
                  setOtherwise(
                    checked
                      ? {
                          action: 'goTo',
                          targetNodeId: getOutcomeTargets(nodes, nodeId, 'goTo')[0]?.value ?? '',
                        }
                      : undefined,
                  )
                }
              />
            ) : null}
            {condition && otherwise ? (
              <OutcomeEditor
                nodes={nodes}
                prefix={`${translate('condition.else')} — `}
                sourceId={nodeId}
                value={otherwise}
                onChange={handleSetOtherwiseChange}
              />
            ) : null}
            {error ? <Text role='alert'>{translate('condition.invalidDraft')}</Text> : null}
            <Button isDisabled={!targets.length} onClick={handleAddClick}>
              {translate(editingId ? 'interaction.save' : 'interaction.add')}
            </Button>
            <Button
              variant='ghost'
              onClick={() => {
                setEditingId(null)

                setIsFormOpen(false)

                setError(false)
              }}
            >
              {translate('export.cancel')}
            </Button>
          </Box>
        ) : null}
        {isFormOpen && outcome.action === 'goTo' ? (
          <Text color='muted' size='xs'>
            {translate('interaction.intentHint')}
          </Text>
        ) : null}
        <InteractionRuleList
          allTargets={allTargets}
          editingId={editingId}
          node={node}
          onEdit={handleRuleEdit}
          onRemove={handleRuleRemove}
        />
        <Group justify='end'>
          <Button onClick={onClose}>{translate('general.close')}</Button>
        </Group>
      </Stack>
    </Modal>
  )
}
