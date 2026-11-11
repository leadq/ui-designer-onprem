import { Box, Button, Select, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import { COLLECTION_MAX_ITEMS } from '@root/utils/collectionAuthoring/constants'
import { getCollectionContext } from '@root/utils/collectionAuthoring/getCollectionContext'

export interface CollectionInspectorProps {
  nodeId: string
}

export const CollectionInspector = ({ nodeId }: CollectionInspectorProps) => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const select = useEditorStore((state) => state.setSelectedNodeIds)
  const edit = useEditorStore((state) => state.editCollection)
  const context = getCollectionContext(nodes, nodeId, registry)

  if (!context) {
    return null
  }

  const { collection, item } = context
  const isTabs = registry[collection.type].collection?.kind === 'tabs'
  const items = collection.children
  const index = items.findIndex((candidate) => candidate.id === item?.id)

  const data = items.map((candidate, position) => ({
    value: candidate.id,
    label: isTabs
      ? String(candidate.props.label)
      : translate('collectionAuthoring.item', { number: position + 1 }),
  }))

  return (
    <Stack gap='sm'>
      <Text size='sm' weight={700}>
        {translate(isTabs ? 'collectionAuthoring.tabs' : 'collectionAuthoring.list')}
      </Text>
      <Text color='secondary' size='xs'>
        {translate(isTabs ? 'collectionAuthoring.tabsHint' : 'collectionAuthoring.listHint')}
      </Text>
      {items.length ? (
        <Select
          data={[{ value: '', label: translate('collectionAuthoring.chooseItem') }, ...data]}
          label={translate('collectionAuthoring.editItem')}
          value={item?.id ?? ''}
          onChange={(event) => {
            if (event.target.value) {
              select([event.target.value], event.target.value)
            }
          }}
        />
      ) : null}
      <Button
        isDisabled={items.length >= COLLECTION_MAX_ITEMS}
        size='sm'
        variant='outline'
        onClick={() => edit(collection.id, { type: 'add' })}
      >
        {translate(
          isTabs
            ? 'collectionAuthoring.addTab'
            : items.length
              ? 'collectionAuthoring.addCopy'
              : 'collectionAuthoring.firstItem',
        )}
      </Button>
      {item ? (
        <>
          <Button size='sm' variant='outline' onClick={() => select([item.id], item.id)}>
            {translate('collectionAuthoring.addContent')}
          </Button>
          <Text color='secondary' size='xs'>
            {translate('collectionAuthoring.contentHint')}
          </Text>
          <Box>
            <Button
              isDisabled={index <= 0}
              size='sm'
              variant='ghost'
              onClick={() => edit(collection.id, { type: 'up', itemId: item.id })}
            >
              {translate('collectionAuthoring.up')}
            </Button>
            <Button
              isDisabled={index >= items.length - 1}
              size='sm'
              variant='ghost'
              onClick={() => edit(collection.id, { type: 'down', itemId: item.id })}
            >
              {translate('collectionAuthoring.down')}
            </Button>
          </Box>
          <Button
            isDisabled={items.length >= COLLECTION_MAX_ITEMS}
            size='sm'
            variant='outline'
            onClick={() => edit(collection.id, { type: 'copy', itemId: item.id })}
          >
            {translate('collectionAuthoring.copy')}
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => edit(collection.id, { type: 'remove', itemId: item.id })}
          >
            {translate('collectionAuthoring.remove')}
          </Button>
        </>
      ) : null}
      {isTabs && items.length ? (
        <Select
          data={data}
          label={translate('collectionAuthoring.initial')}
          value={String(collection.props.initialItemId)}
          onChange={(event) => edit(collection.id, { type: 'initial', itemId: event.target.value })}
        />
      ) : null}
      <Text color='secondary' size='xs'>
        {translate('collectionAuthoring.copyHint')}
      </Text>
      {nodeId !== collection.id ? (
        <Button size='sm' variant='ghost' onClick={() => select([collection.id], null)}>
          {translate('collectionAuthoring.selectGroup')}
        </Button>
      ) : null}
    </Stack>
  )
}
