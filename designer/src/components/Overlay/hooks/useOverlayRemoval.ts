import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import { getCollectionContext } from '@root/utils/collectionAuthoring/getCollectionContext'

export const useOverlayRemoval = () => {
  const editCollection = useEditorStore((state) => state.editCollection)
  const removeSelectedNodes = useEditorStore((state) => state.removeSelectedNodes)

  return (nodeId: string) => {
    const context = getCollectionContext(useEditorStore.getState().nodes, nodeId, registry)

    if (context?.item?.id === nodeId) {
      editCollection(context.collection.id, { type: 'remove', itemId: nodeId })
    } else {
      removeSelectedNodes()
    }
  }
}
