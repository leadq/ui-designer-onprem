import type { DesignInteraction } from '@root/types/preview'

/** Both possible edges are exported, with an explicit mutually exclusive branch guard. */
export const getRuleBranches = (rule: DesignInteraction) => {
  const { otherwise, ...primary } = rule

  return [
    {
      ...primary,
      branch: rule.condition ? ('then' as const) : ('always' as const),
      interactionId: rule.id,
    },
    ...(otherwise && rule.condition
      ? [
          {
            ...primary,
            ...otherwise,
            intent: otherwise.intent,
            id: `${rule.id}:else`,
            branch: 'else' as const,
            interactionId: rule.id,
          },
        ]
      : []),
  ]
}
