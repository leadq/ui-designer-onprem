export const getBoundProps = (
  props: Record<string, unknown>,
  item: Record<string, unknown> | null,
): Record<string, unknown> => {
  if (!item) {
    return props
  }

  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => {
      if (typeof value !== 'string') {
        return [key, value]
      }

      const binding = value.replace(/^\{/, '').replace(/\}$/, '')

      if (!/^item(?:\.[A-Za-z_$][\w$]*)+$/.test(binding)) {
        return [key, value]
      }

      let result: unknown = item

      for (const segment of binding.split('.').slice(1)) {
        result =
          result && typeof result === 'object'
            ? (result as Record<string, unknown>)[segment]
            : undefined
      }

      return [key, result ?? '']
    }),
  )
}
