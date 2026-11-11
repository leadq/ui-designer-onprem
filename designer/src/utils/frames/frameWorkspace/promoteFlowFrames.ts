import type { DesignNode } from '@root/types/document'

/** Promote flow screens without changing any existing screen/child IDs or bindings. */
export const promoteFlowFrames = (nodes: DesignNode[]): void => {
  const visit = (items: DesignNode[]) => {
    for (const node of [...items]) {
      visit(node.children)

      Object.values(node.slots ?? {}).forEach(visit)

      if (!node.flow) {
        continue
      }

      if (items !== nodes) {
        items.splice(items.indexOf(node), 1)

        nodes.push(node)
      }

      if (node.flow.layout === 'root') {
        continue
      }

      const screens = node.children.filter((child) =>
        node.flow!.screens.some((screen) => screen.nodeId === child.id),
      )

      const remaining = node.children.filter((child) => !screens.includes(child))

      const first = screens.find((screen) =>
        node.flow!.screens.some((entry) => entry.nodeId === screen.id && entry.kind === 'screen'),
      )

      if (first) {
        first.children.unshift(...remaining)
      } else {
        nodes.push(...remaining)
      }

      node.children = []

      node.flow.layout = 'root'

      nodes.push(...screens)
    }
  }

  visit(nodes)
}
