import { parseDesignDocument } from '@root/utils/designDocument'

/** Select a starting frame in an isolated copy; never change the editor document. */
export const getRenderSnapshot = (input: unknown, frameId: string) => {
  const document = structuredClone(parseDesignDocument(input))

  const frame = document.nodes.find(
    (node) => node.id === frameId && node.type === 'designerFrame' && !node.overlay,
  )

  if (!frame) {
    throw new Error(
      'Choose a normal root frame ID from get_design; overlay capture is not supported',
    )
  }

  const owners = document.nodes.filter((node) =>
    node.flow?.screens.some((screen) => screen.nodeId === frameId),
  )

  if (owners.length !== 1) {
    throw new Error('Frame must belong to exactly one flow')
  }

  const owner = owners[0]

  owner.flow!.startScreenId = frameId

  return { document, flowId: owner.id, createdAt: Date.now() }
}
