import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { getToggleFields } from './getToggleFields'
import { getToggleScope } from './getToggleScope'
import { getToggleTargetIds } from './getToggleTargetIds'
import { getToggleTargets } from './getToggleTargets'

export const validateToggleBindings = (nodes: DesignNode[], registry: Registry): void => {
  const fields = getToggleFields(nodes, registry)

  const visit = (items: DesignNode[]) => {
    for (const node of items) {
      if (node.toggleBinding) {
        if (
          node.toggleBinding.hiddenWhenCheckedNodeIds?.some(
            (id) => !getToggleTargetIds(node.toggleBinding).includes(id),
          )
        ) {
          throw new Error('Inverse visibility target must be bound to its source')
        }

        if (!fields.includes(node)) {
          throw new Error('Toggle binding requires a unique boolean input')
        }

        if (
          getToggleTargetIds(node.toggleBinding).some(
            (id) => !getToggleTargets(nodes, node.id).some((target) => target.id === id),
          )
        ) {
          throw new Error('Invalid or shared toggle visibility target')
        }

        if (
          node.toggleBinding.exclusiveWith.some(
            (id) =>
              id === node.id ||
              !fields.some(
                (peer) =>
                  peer.id === id && getToggleScope(nodes, id) === getToggleScope(nodes, node.id),
              ),
          )
        ) {
          throw new Error('Invalid exclusive toggle field')
        }
      }

      visit(node.children)

      Object.values(node.slots ?? {}).forEach(visit)
    }
  }

  visit(nodes)
}
