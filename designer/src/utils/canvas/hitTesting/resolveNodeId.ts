export const resolveNodeId = (element: Element): string | null => {
  let current: Element | null = element

  while (current) {
    const nodeId = current.getAttribute('data-node-id')

    if (nodeId) {
      return nodeId
    }

    current = current.parentElement
  }

  return null
}
