import { getCanvasElementsFromPoint, resolveNodeId } from '@root/utils/canvas/hitTesting'

export const getTopCanvasNodeId = (positionX: number, positionY: number): string | null => {
  for (const element of getCanvasElementsFromPoint(positionX, positionY)) {
    const id = resolveNodeId(element)

    if (id) {
      return id
    }
  }

  return null
}
