import { Checkbox, Disclosure, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import {
  getToggleFields,
  getTogglePeers,
  getToggleScope,
} from '@root/utils/conditions/toggleBindings'

export interface ToggleBindingEditorProps {
  nodeId: string
  isExpanded?: boolean
}

/** Mutual exclusion is a field state; visibility is edited only on its target. */
export const ToggleBindingEditor = ({
  nodeId,
  isExpanded: expanded = false,
}: ToggleBindingEditorProps) => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const setBinding = useEditorStore((state) => state.setToggleBinding)
  const fields = getToggleFields(nodes, registry)
  const node = fields.find((field) => field.id === nodeId)

  if (!node) {
    return null
  }

  const exclusiveWith = getTogglePeers(nodes, nodeId)

  const peers = fields.filter(
    (field) =>
      field.id !== nodeId && getToggleScope(nodes, field.id) === getToggleScope(nodes, nodeId),
  )

  if (!peers.length) {
    return null
  }

  const content = (
    <Stack gap='sm'>
      {expanded ? (
        <Text size='sm' weight={600}>
          {translate('toggleBinding.exclusive')}
        </Text>
      ) : null}
      <Text color='muted' size='xs'>
        {translate('toggleBinding.exclusiveHint')}
      </Text>
      {peers.map((peer) => (
        <Checkbox
          key={peer.id}
          isChecked={exclusiveWith.includes(peer.id)}
          label={String(peer.label ?? peer.props.label ?? registry[peer.type].displayName)}
          onChange={(checked) =>
            setBinding(nodeId, {
              ...node.toggleBinding,
              exclusiveWith: checked
                ? [...exclusiveWith, peer.id]
                : exclusiveWith.filter((id) => id !== peer.id),
            })
          }
        />
      ))}
    </Stack>
  )

  return expanded ? (
    content
  ) : (
    <Disclosure label={translate('toggleBinding.exclusive')}>{content}</Disclosure>
  )
}
