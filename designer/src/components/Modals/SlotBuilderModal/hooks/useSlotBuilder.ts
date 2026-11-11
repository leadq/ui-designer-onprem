import { useEffect, useState } from 'react'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import { getEditedCollection } from '@root/utils/collectionAuthoring/getEditedCollection'
import { createNode, findParent } from '@root/utils/nodes'

import { findLocalNode } from '../utils/findLocalNode'
import { getDeleteLocalNode } from '../utils/getDeleteLocalNode'
import { getMoveLocalNode } from '../utils/getMoveLocalNode'
import { getUpdateLocalNode } from '../utils/getUpdateLocalNode'

export const useSlotBuilder = (
  isOpened: boolean,
  slotNodes: DesignNode[],
  initialName: string,
  isMultiple: boolean,
) => {
  const { translate } = useBuilderI18n()
  const [localNodes, setLocalNodes] = useState<DesignNode[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [templateName, setTemplateName] = useState('')

  // Sync state when modal is opened
  useEffect(() => {
    if (isOpened) {
      setLocalNodes(JSON.parse(JSON.stringify(slotNodes)))

      setSelectedNodeId(null)

      setTemplateName(initialName || translate('slotBuilder.defaultName'))
    }
  }, [initialName, isOpened, slotNodes, translate])

  const handleAddComponent = (type: string) => {
    const meta = registry[type]

    if (!meta) {
      return
    }

    const newNode = createNode(registry, type)

    // Nest inside selected container node if possible
    if (selectedNodeId) {
      const selectedNode = findLocalNode(localNodes, selectedNodeId)
      const selectedMeta = selectedNode ? registry[selectedNode.type] : null

      if (selectedMeta?.isContainer) {
        setLocalNodes((prev) =>
          getUpdateLocalNode(prev, selectedNodeId, (node) => {
            node.children = [...node.children, newNode]
          }),
        )

        setSelectedNodeId(newNode.id)

        return
      }
    }

    // Otherwise insert at root
    if (!isMultiple && localNodes.length >= 1) {
      // eslint-disable-next-line no-alert
      alert(translate('slotBuilder.singleRootWarning'))

      return
    }

    setLocalNodes((prev) => [...prev, newNode])

    setSelectedNodeId(newNode.id)
  }

  const handlePropChange = (key: string, val: unknown) => {
    if (!selectedNodeId) {
      return
    }

    setLocalNodes((prev) =>
      getUpdateLocalNode(prev, selectedNodeId, (node) => {
        node.props[key] = val
      }),
    )
  }

  const handleStyleChange = (key: string, val: string) => {
    if (!selectedNodeId) {
      return
    }

    setLocalNodes((prev) =>
      getUpdateLocalNode(prev, selectedNodeId, (node) => {
        node.style = { ...node.style, [key]: val }
      }),
    )
  }

  const handleDeleteNode = (id: string) => {
    const parent = findParent(localNodes, id)

    setLocalNodes((prev) =>
      parent && registry[parent.type]?.collection
        ? getUpdateLocalNode(prev, parent.id, (node) =>
            Object.assign(
              node,
              getEditedCollection(node, { type: 'remove', itemId: id }, registry),
            ),
          )
        : getDeleteLocalNode(prev, id),
    )

    if (selectedNodeId === id) {
      setSelectedNodeId(null)
    }
  }

  const handleMoveNode = (id: string, direction: 'up' | 'down') => {
    const parent = findParent(localNodes, id)

    setLocalNodes((prev) =>
      parent && registry[parent.type]?.collection
        ? getUpdateLocalNode(prev, parent.id, (node) =>
            Object.assign(
              node,
              getEditedCollection(node, { type: direction, itemId: id }, registry),
            ),
          )
        : getMoveLocalNode(prev, id, direction),
    )
  }

  const selectedNode = selectedNodeId ? findLocalNode(localNodes, selectedNodeId) : null
  const selectedMeta = selectedNode ? registry[selectedNode.type] : null
  const handleSetSelectedNodeIdSelect = setSelectedNodeId
  const handleDeleteNodeDelete = handleDeleteNode
  const handleMoveNodeMove = handleMoveNode

  return {
    localNodes,
    selectedNodeId,
    templateName,
    setTemplateName,
    handleAddComponent,
    handlePropChange,
    handleStyleChange,
    selectedNode,
    selectedMeta,
    handleSetSelectedNodeIdSelect,
    handleDeleteNodeDelete,
    handleMoveNodeMove,
  }
}
