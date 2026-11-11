/** Object-row editors and item renderers share the same tolerant import behavior. */
export const getDataRows = (data: unknown): Record<string, unknown>[] =>
  Array.isArray(data)
    ? data.map((item: unknown) =>
        item && typeof item === 'object' && !Array.isArray(item)
          ? (item as Record<string, unknown>)
          : {},
      )
    : []
