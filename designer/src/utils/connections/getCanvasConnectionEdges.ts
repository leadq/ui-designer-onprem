import type { DesignNode } from '@root/types/document'
import { getRuleBranches } from '@root/utils/conditions/conditionModel'
import { getAllNodes } from '@root/utils/flows/flowModel'
import { getFrameForNode } from '@root/utils/frames/frameWorkspace'

export const getCanvasConnectionEdges = (nodes: DesignNode[]) =>
  getAllNodes(nodes).flatMap((source) =>
    (source.interactions ?? []).flatMap((rule) =>
      getRuleBranches(rule).flatMap((branch) => {
        const sourceScreen = getFrameForNode(nodes, source.id)

        const sourceFrame = sourceScreen?.overlay
          ? getFrameForNode(nodes, sourceScreen.overlay.ownerFrameId)
          : sourceScreen

        const targetFrame = getFrameForNode(nodes, branch.targetNodeId)

        if (
          !sourceFrame ||
          !targetFrame ||
          sourceFrame.id === targetFrame.id ||
          targetFrame.overlay ||
          branch.action === 'closeOverlay' ||
          branch.action === 'hide'
        ) {
          return []
        }

        return [{ id: `${source.id}:${branch.id}`, source, sourceFrame, targetFrame, branch }]
      }),
    ),
  )
