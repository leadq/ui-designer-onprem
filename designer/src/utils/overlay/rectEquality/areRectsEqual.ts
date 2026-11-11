export const areRectsEqual = (first: DOMRect | null, second: DOMRect | null): boolean =>
  first === second ||
  Boolean(
    first &&
    second &&
    first.x === second.x &&
    first.y === second.y &&
    first.width === second.width &&
    first.height === second.height,
  )
