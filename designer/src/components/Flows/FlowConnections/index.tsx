import { useState } from 'react'
import { Box, Button, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { InteractionEditorModal } from '@root/components/Modals/InteractionEditorModal'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'

import styles from './styles.module.scss'

export interface FlowConnectionsProps {
  nodes: DesignNode[]
  allNodes: DesignNode[]
}

export const FlowConnections = ({ nodes, allNodes }: FlowConnectionsProps) => {
  const { translate } = useBuilderI18n()
  const isPreview = useEditorStore((state) => state.previewMode)
  const [editing, setEditing] = useState<{ nodeId: string; ruleId?: string } | null>(null)

  const connections = nodes.flatMap((source) =>
    (source.interactions ?? []).map((rule) => ({ source, rule })),
  )

  const getName = (node?: DesignNode) =>
    node?.label || String(node?.props.label || node?.props.children || node?.type || '')

  return (
    <Box className={styles.flowConnections}>
      <Text weight={600}>{translate('flow.connections')}</Text>
      {!connections.length && (
        <Text color='muted' size='xs'>
          {translate('flow.noConnections')}
        </Text>
      )}
      {connections.map(({ source, rule }) => (
        <Button
          key={`${source.id}-${rule.id}`}
          className={styles.flowConnections__item}
          isDisabled={isPreview}
          size='sm'
          variant='ghost'
          onClick={() => setEditing({ nodeId: source.id, ruleId: rule.id })}
        >
          <EditorIcon aria-hidden name='action' size={16} />
          <Box>
            <Text size='xs' weight={500}>
              {getName(source)}
            </Text>
            <Text color='muted' size='xs'>
              {translate(
                rule.intent
                  ? `interaction.intent.${rule.intent}`
                  : `interaction.action.${rule.action}`,
              )}{' '}
              <EditorIcon aria-hidden name='arrowRight' size={12} />{' '}
              {getName(allNodes.find((node) => node.id === rule.targetNodeId))}
              {rule.otherwise ? ` · ${translate('flow.hasAlternative')}` : ''}
            </Text>
          </Box>
        </Button>
      ))}
      {editing ? (
        <InteractionEditorModal
          isOpen
          initialRuleId={editing.ruleId}
          nodeId={editing.nodeId}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </Box>
  )
}
