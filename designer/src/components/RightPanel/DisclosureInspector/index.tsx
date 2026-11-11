import { Button, Stack, Text } from '@root/components/common'
import { getDisclosureContext } from '@root/components/RightPanel/utils/getDisclosureContext'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useDisclosureDesign } from '@root/hooks/useDisclosureDesign'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'

export interface DisclosureInspectorProps {
  nodeId: string
}

export const DisclosureInspector = ({ nodeId }: DisclosureInspectorProps) => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const select = useEditorStore((state) => state.setSelectedNodeIds)
  const node = getDisclosureContext(nodes, nodeId, registry)
  const { isExpanded, setExpanded } = useDisclosureDesign(node)

  if (!node) {
    return null
  }

  const handleToggleClick = () => {
    select([node.id], node.id)

    setExpanded(!isExpanded)
  }

  const handleEditContentClick = () => {
    select([node.id], node.id)

    setExpanded(true)
  }

  return (
    <Stack gap='sm'>
      <Text size='sm' weight={700}>
        {translate('disclosure.title')}
      </Text>
      <Text color='secondary' size='xs'>
        {translate('disclosure.hint')}
      </Text>
      <Button aria-expanded={isExpanded} size='sm' variant='outline' onClick={handleToggleClick}>
        {translate(isExpanded ? 'disclosure.collapseDesign' : 'disclosure.expandDesign')}
      </Button>
      <Button size='sm' variant='outline' onClick={handleEditContentClick}>
        {translate('disclosure.editContent')}
      </Button>
      <Text color='secondary' size='xs'>
        {translate('disclosure.contentHint')}
      </Text>
    </Stack>
  )
}
