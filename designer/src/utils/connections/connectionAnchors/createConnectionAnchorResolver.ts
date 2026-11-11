import type { DesignNode } from '@root/types/document'
import { getRuleBranches } from '@root/utils/conditions/conditionModel'
import { getAllNodes, getContainingScreen } from '@root/utils/flows/flowModel'

import type { ConnectionAnchor } from './types'

/** Follow authored overlay openers backwards; never invent a connection from its owner frame. */
export const createConnectionAnchorResolver = (nodes: DesignNode[]) => {
  const all = getAllNodes(nodes)
  const byId = new Map(all.map((node) => [node.id, node]))
  const screens = new Map(all.map((node) => [node.id, getContainingScreen(nodes, node.id)]))
  const openers = new Map<string, { node: DesignNode; isConditional: boolean }[]>()

  for (const node of all) {
    for (const rule of node.interactions ?? []) {
      for (const branch of getRuleBranches(rule)) {
        if (
          !['openOverlay', 'show', 'toggle'].includes(branch.action) ||
          !byId.get(branch.targetNodeId)?.overlay
        ) {
          continue
        }

        const incoming = openers.get(branch.targetNodeId) ?? []

        incoming.push({ node, isConditional: branch.branch !== 'always' })

        openers.set(branch.targetNodeId, incoming)
      }
    }
  }

  return (sourceId: string, isVisible: (id: string) => boolean): ConnectionAnchor[] => {
    const getVisit = (id: string, visited: Set<string>): ConnectionAnchor[] => {
      const node = byId.get(id)

      if (!node || visited.has(id)) {
        return []
      }

      if (isVisible(id)) {
        return [{ node, via: [], isConditional: false }]
      }

      const screen = screens.get(id)

      if (!screen?.overlay) {
        return []
      }

      const nextVisited = new Set([...visited, id])

      return (openers.get(screen.id) ?? []).flatMap((opener) =>
        getVisit(opener.node.id, nextVisited).map((anchor) => ({
          node: anchor.node,
          via: [...anchor.via, screen],
          isConditional: anchor.isConditional || opener.isConditional,
        })),
      )
    }

    // Distinct openers are kept; duplicate routes from the same opener are merged.
    const anchors = new Map<string, ConnectionAnchor>()

    for (const anchor of getVisit(sourceId, new Set())) {
      const key = JSON.stringify([anchor.node.id, ...anchor.via.map((node) => node.id)])
      const previous = anchors.get(key)

      anchors.set(key, {
        ...anchor,
        isConditional: anchor.isConditional && (previous?.isConditional ?? true),
      })
    }

    return [...anchors.values()]
  }
}
