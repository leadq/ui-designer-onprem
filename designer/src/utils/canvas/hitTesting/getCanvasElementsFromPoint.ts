const THIN_ELEMENT_THRESHOLD = 2

/** Read the actual stacking/clipping order without delivering input to inert content. */
export const getCanvasElementsFromPoint = (positionX: number, positionY: number): Element[] => {
  const surfaces = Array.from(document.querySelectorAll<HTMLElement>('[data-design-inert][inert]'))

  try {
    surfaces.forEach((element) => {
      element.inert = false
    })

    const hits = document.elementsFromPoint(positionX, positionY)
    const layer = document.getElementById('render-layer')

    if (!layer || !hits.some((element) => element === layer || layer.contains(element))) {
      return hits
    }

    // Firefox rounds pointer coordinates to whole CSS pixels. Probe adjacent pixels
    // for thin roots only, retaining browser clipping and stacking checks.
    const nearby = [
      [positionX, positionY + 1],
      [positionX, positionY - 1],
      [positionX + 1, positionY],
      [positionX - 1, positionY],
    ]

    const thinHits = [
      ...new Set(nearby.flatMap(([px, py]) => document.elementsFromPoint(px, py))),
    ].filter((element) => {
      if (
        !layer.contains(element) ||
        !element.hasAttribute('data-node-id') ||
        hits.includes(element)
      ) {
        return false
      }

      const rect = element.getBoundingClientRect()

      return (
        (rect.height > 0 && rect.height <= THIN_ELEMENT_THRESHOLD) ||
        (rect.width > 0 && rect.width <= THIN_ELEMENT_THRESHOLD)
      )
    })

    return [...thinHits, ...hits]
  } finally {
    surfaces.forEach((element) => {
      element.inert = true
    })
  }
}
