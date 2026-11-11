import { type CSSProperties, useState } from 'react'
import type { BreakpointKey } from '@root/constants/breakpoints'
import { registry } from '@root/registry'
import { getNodeStyleEdit } from '@root/stores/editor/utils/styles/getNodeStyleEdit'
import type { DesignNode } from '@root/types/document'
import { createNode, findNode, findParent } from '@root/utils/nodes'

import { getDroppedCellTree } from '../utils/getDroppedCellTree'
import { getEditedCellTree } from '../utils/getEditedCellTree'

export const useCellDraft = (initial: DesignNode, breakpoint: BreakpointKey) => {
  const [history, setHistory] = useState({ entries: [initial], index: 0 })
  const [selectedId, setSelectedId] = useState(initial.id)
  const root = history.entries[history.index]
  const selected = findNode([root], selectedId) ?? root

  const handleChange = (next: DesignNode) => {
    if (JSON.stringify(next) === JSON.stringify(root)) {
      return
    }

    setHistory((previous) => ({
      entries: [...previous.entries.slice(0, previous.index + 1), next],
      index: previous.index + 1,
    }))
  }

  const handleDrop = (target: string, type?: string, movingId?: string) => {
    const added = type ? createNode(registry, type) : findNode([root], movingId ?? '')

    if (!added) {
      return
    }

    const next = getDroppedCellTree(root, target, added, Boolean(movingId))

    handleChange(next)

    if (next !== root) {
      setSelectedId(added.id)
    }
  }

  const handleInsert = (target: string, nodes: DesignNode[]) => {
    const destination = findNode([root], target)
    const isContainer = destination && registry[destination.type]?.isContainer
    let insertionTarget = target

    const next = nodes.reduce((current, node) => {
      const result = getDroppedCellTree(current, insertionTarget, node, false)

      if (!isContainer && result !== current) {
        insertionTarget = node.id
      }

      return result
    }, root)

    handleChange(next)
  }

  const handleProps = (key: string, value: unknown) => {
    handleChange(
      getEditedCellTree(root, selected.id, (node) => {
        if (
          breakpoint !== 'xl' &&
          registry[node.type]?.propsSchema.some(
            (schema) => schema.key === key && schema.isResponsive,
          )
        ) {
          node.responsiveProps = {
            ...node.responsiveProps,
            [breakpoint]: { ...node.responsiveProps?.[breakpoint], [key]: value },
          }
        } else {
          node.props[key] = value
        }
      }),
    )
  }

  const handleStyle = (patch: CSSProperties) => {
    handleChange(
      getEditedCellTree(root, selected.id, (node) => {
        const next = getNodeStyleEdit(node, breakpoint, patch)

        if (breakpoint === 'xl') {
          node.style = next
        } else {
          node.responsiveStyles = { ...node.responsiveStyles, [breakpoint]: next }
        }
      }),
    )
  }

  const parent = findParent([root], selected.id)

  const canDelete = Boolean(
    parent?.children.some((node) => node.id === selected.id) && !registry[parent.type]?.collection,
  )

  const handleDelete = () => {
    if (!parent || !canDelete) {
      return
    }

    handleChange(
      getEditedCellTree(root, parent.id, (node) => {
        node.children = node.children.filter((child) => child.id !== selected.id)
      }),
    )

    setSelectedId(parent.id)
  }

  const handleUndo = () =>
    setHistory((previous) => ({ ...previous, index: Math.max(0, previous.index - 1) }))

  const handleRedo = () =>
    setHistory((previous) => ({
      ...previous,
      index: Math.min(previous.entries.length - 1, previous.index + 1),
    }))

  return {
    root,
    selected,
    selectedId,
    handleSelect: setSelectedId,
    handleDrop,
    handleInsert,
    handleProps,
    handleStyle,
    handleDelete,
    canDelete,
    handleUndo,
    handleRedo,
    canUndo: history.index > 0,
    canRedo: history.index < history.entries.length - 1,
  }
}
