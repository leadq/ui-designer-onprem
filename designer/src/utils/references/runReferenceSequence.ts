/**
 * Reference work is deliberately serial: decoding large images is memory-heavy,
 * placement/limits use the previous result, and remote deletes precede uploads.
 * Queue work lazily; a rejection prevents all subsequent items from starting.
 */
export const runReferenceSequence = async <Item>(
  items: readonly Item[],
  work: (item: Item) => Promise<void>,
): Promise<void> => {
  await items.reduce(async (previous, item) => {
    await previous

    await work(item)
  }, Promise.resolve())
}
