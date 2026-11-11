import { getAdapter } from '@root/adapters'
import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { parseDesignDocument } from '@root/utils/designDocument'
import { getFlatDesignDocument } from '@root/utils/flatDocument'

const validateNodes = (nodes: DesignNode[], registry: Registry, hasFrame = false): void => {
  for (const node of nodes) {
    const isStructural = ['designerFrame', 'designerFlow'].includes(node.type)

    if (!node.id.trim()) {
      throw new Error('Node ID cannot be empty')
    }

    if (isStructural && hasFrame) {
      throw new Error(
        `${node.id}: structural frames/flows must be root siblings, not nested components`,
      )
    }

    const meta = registry[node.type]

    if (!isStructural && !meta) {
      throw new Error(`${node.id}: unknown component type ${node.type}`)
    }

    if (!isStructural && !hasFrame && !node.overlay) {
      throw new Error(`${node.id}: component must belong to a frame`)
    }

    if (meta) {
      if (!meta.isContainer && !meta.collection && node.children.length) {
        throw new Error(`${node.id}: ${node.type} cannot contain children`)
      }
    }

    const isInFrame = hasFrame || node.type === 'designerFrame' || Boolean(node.overlay)

    validateNodes(node.children, registry, isInFrame)

    Object.values(node.slots ?? {}).forEach((items) => {
      validateNodes(items, registry, isInFrame)
    })
  }
}

// Generated documents must already match the editor workspace, without legacy wrapping.
const validateWorkspace = (nodes: DesignNode[]): void => {
  const flows = nodes.filter((node) => node.type === 'designerFlow')

  for (const flow of flows) {
    if (flow.flow?.layout !== 'root' || flow.children.length) {
      throw new Error(`${flow.id}: designerFlow requires layout root and empty children`)
    }
  }

  for (const node of nodes) {
    if (node.type !== 'designerFrame' && !node.overlay) {
      continue
    }

    const owners = flows.filter((flow) =>
      flow.flow?.screens.some((screen) => screen.nodeId === node.id),
    )

    if (owners.length !== 1) {
      throw new Error(
        `${node.id}: register every root frame/overlay in exactly one designerFlow.screens, even for a single screen; otherwise editor import may wrap it in a new frame`,
      )
    }
  }
}

export const getValidatedDesign = (
  input: unknown,
  output: 'summary' | 'nested' | 'flat' = 'summary',
) => {
  const document = parseDesignDocument(input)
  const registry = getAdapter(document.adapterId).registry

  validateWorkspace(document.nodes)

  validateNodes(document.nodes, registry)

  document.savedDesigns?.forEach((design) => {
    validateNodes(design.nodes, registry, true)
  })

  const flat = getFlatDesignDocument(document)

  return {
    valid: true,
    schemaVersion: document.version,
    adapterId: document.adapterId,
    nodeCount: Object.keys(flat.nodesById).length,
    issues: flat.behavior.issues,
    limitations: ['Structural validation is not a visual or runtime verification.'],
    ...(output === 'nested' ? { document } : output === 'flat' ? { document: flat } : {}),
  }
}
