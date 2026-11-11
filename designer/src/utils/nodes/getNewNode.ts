import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { v4 as uuidv4 } from 'uuid'

/**
 * Creates a new node based on the component type and registry defaults.
 */
export const getNewNode = (registry: Registry, type: string): DesignNode => {
  const meta = registry[type]

  if (!meta) {
    throw new Error(`Component type "${type}" not found in registry.`)
  }

  const node: DesignNode = {
    id: uuidv4(),
    type,
    props: JSON.parse(JSON.stringify(meta.defaultProps)),
    style: { ...meta.defaultStyle },
    children: [],
  }

  return meta.initializeNode ? meta.initializeNode(node, registry) : node
}
