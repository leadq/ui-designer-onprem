import { getNestedTree } from './getNestedTree'
import { isRecord } from './isRecord'

/** Behavior is a read-only derived view; it is rebuilt from the restored source nodes. */
export const getNestedDocument = (value: Record<string, unknown>): unknown => {
  if (value.version !== 1 || typeof value.designVersion !== 'number') {
    throw new Error('Unsupported flat document version')
  }

  if (value.savedDesigns !== undefined && !Array.isArray(value.savedDesigns)) {
    throw new Error('Invalid flat saved designs')
  }

  return {
    version: value.designVersion,
    adapterId: value.adapterId,
    pageName: value.pageName,
    pageNotes: value.pageNotes,
    pageAnnotations: value.pageAnnotations,
    nodes: getNestedTree(value),
    ...(Array.isArray(value.savedDesigns)
      ? {
          savedDesigns: value.savedDesigns.map((design) => {
            if (!isRecord(design)) {
              throw new Error('Invalid flat saved design')
            }

            return { id: design.id, name: design.name, nodes: getNestedTree(design) }
          }),
        }
      : {}),
  }
}
