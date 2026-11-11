import type { ConnectionPath } from '@root/types/connectionLines'
import type { DesignNode } from '@root/types/document'
import { getNodeElement } from '@root/utils/canvas/hitTesting'
import { createConnectionAnchorResolver } from '@root/utils/connections/connectionAnchors'
import { getCanvasConnectionEdges } from '@root/utils/connections/getCanvasConnectionEdges'
import {
  type ConnectionGeometry,
  getConnectionRoutes,
} from '@root/utils/connections/routeConnections'
import { getFlowOwner } from '@root/utils/flows/flowModel'
import { getFrameForNode } from '@root/utils/frames/frameWorkspace'

export const getViewConnectionPaths = (
  nodes: DesignNode[],
  selectedIds: string[],
  wrapper: HTMLElement,
  layer: HTMLElement,
) => {
  const edges = getCanvasConnectionEdges(nodes)
  const resolveAnchors = createConnectionAnchorResolver(nodes)
  const origin = wrapper.getBoundingClientRect()

  const views = Array.from(layer.querySelectorAll<HTMLElement>('[data-view-id]')).map(
    (view) => view.dataset.viewId!,
  )

  const allPaths = (views.length ? views : [undefined]).flatMap((viewId) => {
    const bounds = new Map<string, DOMRect | undefined>()

    const getBounds = (id: string) => {
      if (!bounds.has(id)) {
        bounds.set(id, getNodeElement(id, viewId)?.getBoundingClientRect())
      }

      return bounds.get(id)
    }

    const resolved = edges.flatMap((edge) =>
      resolveAnchors(edge.source.id, (id) => {
        const rect = getBounds(id)

        return Boolean(rect?.width && rect.height)
      }).flatMap((anchor) => {
        const screen = getFrameForNode(nodes, anchor.node.id)
        const frame = screen?.overlay ? getFrameForNode(nodes, screen.overlay.ownerFrameId) : screen

        return frame && frame.id !== edge.targetFrame.id
          ? [
              {
                ...edge,
                anchor,
                sourceFrame: frame,
                id: `${edge.id}:${anchor.node.id}:${anchor.via.map((node) => node.id).join(':')}`,
              },
            ]
          : []
      }),
    )

    const measured: ConnectionGeometry[] = resolved.flatMap((edge) => {
      const source = getBounds(edge.anchor.node.id)
      const sourceFrame = getBounds(edge.sourceFrame.id)

      const width =
        viewId &&
        layer.querySelector<HTMLElement>(`[data-view-id="${CSS.escape(viewId)}"]`)?.dataset
          .viewWidth

      const targetFlow = getFlowOwner(nodes, edge.targetFrame.id)
      const targetViewId = width && targetFlow ? `${targetFlow.id}:${width}` : viewId
      const targetFrame = getNodeElement(edge.targetFrame.id, targetViewId)?.getBoundingClientRect()

      return source?.width &&
        source.height &&
        sourceFrame?.width &&
        targetFrame?.width &&
        targetFrame.height
        ? [
            {
              id: edge.id,
              source,
              sourceFrame,
              targetFrame,
              isFrameSource: edge.anchor.node.id === edge.sourceFrame.id,
            },
          ]
        : []
    })

    const routes = new Map(
      getConnectionRoutes(measured, { x: origin.left, y: origin.top }).map((route) => [
        route.id,
        route,
      ]),
    )

    const paths: ConnectionPath[] = resolved.flatMap(
      ({ id, source, sourceFrame, targetFrame, branch, anchor }) => {
        const route = routes.get(id)

        const chain = anchor.via.length
          ? [anchor.node, ...anchor.via, source, targetFrame]
          : [source, targetFrame]

        return route
          ? [
              {
                id,
                sourceId: source.id,
                anchorId: anchor.node.id,
                viaIds: anchor.via.map((node) => node.id),
                targetId: targetFrame.id,
                label: chain.map((node) => node.label ?? node.type).join(' → '),
                isActive: [anchor.node.id, source.id, sourceFrame.id, targetFrame.id].some(
                  (nodeId) => selectedIds.includes(nodeId),
                ),
                isConditional: branch.branch !== 'always' || anchor.isConditional,
                routeSide: route.side,
                path: route.path,
              },
            ]
          : []
      },
    )

    return paths.map((path) => ({ ...path, id: `${viewId ?? 'preview'}:${path.id}` }))
  })

  return allPaths
}
