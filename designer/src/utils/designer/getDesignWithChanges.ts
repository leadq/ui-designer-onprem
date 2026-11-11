import type { DesignNode } from '@root/types/document'
import { parseDesignDocument } from '@root/utils/designDocument'

import { getValidatedDesign } from './getValidatedDesign'

const MAX_DESIGN_CHANGES = 100

export interface DesignChange {
  nodeId: string
  patch: Record<string, unknown>
}

const PATCH_FIELDS = new Set([
  'type',
  'label',
  'props',
  'style',
  'responsiveStyles',
  'responsiveProps',
  'styleTokens',
  'responsiveStyleTokens',
  'children',
  'slots',
  'notes',
  'annotations',
  'interactions',
  'stateRules',
  'textBinding',
  'toggleBinding',
  'prototypeHidden',
  'flow',
  'overlay',
])

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const mergePatch = (original: unknown, patch: Record<string, unknown>): Record<string, unknown> => {
  const result = isObject(original) ? { ...original } : {}

  for (const [key, value] of Object.entries(patch)) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) {
      throw new Error('Unsafe patch key')
    }

    if (value === null) {
      delete result[key]
    } else {
      result[key] = isObject(value) ? mergePatch(result[key], value) : value
    }
  }

  return result
}

const getTarget = (nodes: DesignNode[], id: string): DesignNode | undefined => {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }

    const nested = getTarget([...node.children, ...Object.values(node.slots ?? {}).flat()], id)

    if (nested) {
      return nested
    }
  }
}

/** JSON merge patch: objects merge, null removes a key, arrays replace. IDs never change. */
export const getDesignWithChanges = (input: unknown, changes: DesignChange[]) => {
  if (!Array.isArray(changes) || !changes.length || changes.length > MAX_DESIGN_CHANGES) {
    throw new Error('Provide 1–100 node changes')
  }

  const document = parseDesignDocument(JSON.parse(JSON.stringify(input)))
  const changedNodeIds: string[] = []

  for (const change of changes) {
    if (
      !isObject(change.patch) ||
      Object.keys(change.patch).some((key) => !PATCH_FIELDS.has(key))
    ) {
      throw new Error('Patch only supported node fields; node id cannot change')
    }

    const target = getTarget(document.nodes, change.nodeId)

    if (!target) {
      throw new Error(`Unknown node: ${change.nodeId}`)
    }

    const next = mergePatch(target, change.patch)

    if (JSON.stringify(next) !== JSON.stringify(target)) {
      changedNodeIds.push(target.id)
    }

    for (const key of Object.keys(target)) {
      delete (target as unknown as Record<string, unknown>)[key]
    }

    Object.assign(target, next)
  }

  const validated = getValidatedDesign(document, 'nested')

  if (!('document' in validated) || !('nodes' in validated.document)) {
    throw new Error('Expected nested document')
  }

  return { document: validated.document, changedNodeIds: [...new Set(changedNodeIds)] }
}
