// Preserve invocation order when rapid gestures or deletion overlap binary conversion.
export const writeQueue: { pendingWrite: Promise<void> } = { pendingWrite: Promise.resolve() }
