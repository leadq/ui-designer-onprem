import type { DesignNode } from '@root/types/document'
import type { DesignFlow } from '@root/types/flow'

export const getParsedFlow = (value: unknown, children: DesignNode[]): DesignFlow | undefined => {
  if (value === undefined) {
    return undefined
  }

  if (!value || typeof value !== 'object') {
    throw new Error('Invalid flow')
  }

  const flow = value as Record<string, unknown>

  if (
    (flow.kind !== undefined && !['form', 'navigation'].includes(String(flow.kind))) ||
    typeof flow.startScreenId !== 'string' ||
    !Array.isArray(flow.screens)
  ) {
    throw new Error('Invalid flow kind or screens')
  }

  const ids = new Set<string>()

  const screens = flow.screens.map((entry: unknown) => {
    if (!entry || typeof entry !== 'object') {
      throw new Error('Invalid flow screen')
    }

    const screen = entry as Record<string, unknown>

    if (
      typeof screen.nodeId !== 'string' ||
      !['screen', 'overlay'].includes(String(screen.kind)) ||
      (flow.layout !== 'root' && !children.some((child) => child.id === screen.nodeId)) ||
      ids.has(screen.nodeId)
    ) {
      throw new Error('Invalid or duplicate flow screen reference')
    }

    ids.add(screen.nodeId)

    return { nodeId: screen.nodeId, kind: screen.kind as 'screen' | 'overlay' }
  })

  if (
    screens.some((screen) => screen.kind === 'screen')
      ? !screens.some((screen) => screen.nodeId === flow.startScreenId && screen.kind === 'screen')
      : flow.startScreenId !== ''
  ) {
    throw new Error('Invalid flow starting screen')
  }

  if (flow.layout !== undefined && flow.layout !== 'root') {
    throw new Error('Invalid flow layout')
  }

  return {
    ...(flow.layout === 'root' ? { layout: 'root' as const } : {}),
    ...(flow.kind ? { kind: flow.kind as DesignFlow['kind'] } : {}),
    startScreenId: flow.startScreenId,
    screens,
  }
}
