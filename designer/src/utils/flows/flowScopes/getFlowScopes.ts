import { type FrameConnection, type FrameContext } from './types'

/** Equivalence comes only from explicit state-change links, never visual similarity. */
export const getFlowScopes = (
  states: FrameContext[],
  connections: FrameConnection[],
  contexts: Map<string, Set<string>>,
) => {
  const issues: { code: string; connectionId: string; sourceNodeId: string }[] = []

  const groups = states
    .filter((state) => state.kind === 'screen')
    .map((state) => new Set([state.id]))

  const merge = (sets: Set<string>[], ids: string[]) => {
    const matches = sets.filter((group) => ids.some((id) => group.has(id)))
    const merged = new Set([...ids, ...matches.flatMap((group) => [...group])])

    matches.forEach((group) => {
      sets.splice(sets.indexOf(group), 1)
    })

    sets.push(merged)
  }

  const getBases = (rule: FrameConnection) => [...(contexts.get(rule.sourceStateId ?? '') ?? [])]

  const canResolve = (rule: FrameConnection, code: string) => {
    const bases = getBases(rule)

    if (
      bases.length !== 1 ||
      rule.sourceScopeId !== rule.targetScopeId ||
      states.find((state) => state.id === bases[0])?.scopeId !== rule.targetScopeId
    ) {
      issues.push({ code, connectionId: rule.id, sourceNodeId: rule.sourceNodeId })

      return false
    }

    return true
  }

  for (const rule of connections.filter((rule) => rule.intent === 'stateChange')) {
    if (canResolve(rule, 'ambiguous-state-context')) {
      merge(groups, [getBases(rule)[0], rule.targetNodeId])
    }
  }

  const pages = groups.map((group) => {
    const frameIds = [...group].sort()

    return { id: `page:${frameIds[0]}`, frameIds }
  })

  const getPageId = (frameId: string) =>
    pages.find((page) => page.frameIds.includes(frameId))?.id ?? null

  const formGroups: Set<string>[] = []
  const formLinks: { key: string; pageIds: string[] }[] = []

  for (const rule of connections.filter(
    (rule) => rule.intent === 'formStep' || rule.intent === 'navigation',
  )) {
    if (
      rule.intent === 'formStep' &&
      !canResolve(
        rule,
        getBases(rule).length !== 1 ? 'ambiguous-form-context' : 'cross-scope-form-transition',
      )
    ) {
      continue
    }

    const sourcePageId = getPageId(getBases(rule)[0])
    const targetPageId = getPageId(rule.targetNodeId)

    if (!sourcePageId || !targetPageId) {
      continue
    }

    if (sourcePageId === targetPageId) {
      issues.push({
        code: 'page-transition-within-state-group',
        connectionId: rule.id,
        sourceNodeId: rule.sourceNodeId,
      })

      continue
    }

    if (rule.intent !== 'formStep') {
      continue
    }

    const pageIds = [sourcePageId, targetPageId]

    merge(formGroups, pageIds)

    formLinks.push({ key: rule.connectionKey ?? `${rule.sourceNodeId}:${rule.id}`, pageIds })
  }

  return {
    pages,
    issues,
    getPageId,
    formScopes: formGroups.map((group) => {
      const pageIds = [...group].sort()

      return {
        id: `form:${pageIds[0]}`,
        pageIds,
        screenIds: pages
          .filter((page) => group.has(page.id))
          .flatMap((page) => page.frameIds)
          .sort(),
        stepCount: pageIds.length,
        connectionKeys: formLinks
          .filter((link) => link.pageIds.every((id) => group.has(id)))
          .map((link) => link.key),
        derivation: 'connected-explicit-form-steps' as const,
        order: 'follow-connections' as const,
        dataScope: 'shared-across-steps' as const,
      }
    }),
  }
}
