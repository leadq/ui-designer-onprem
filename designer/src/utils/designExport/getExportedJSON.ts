import type { DesignDocument } from '@root/utils/designDocument'

const INDENT_SIZE = 2

/**
 * Exports the current node tree as a JSON string.
 */
export const getExportedJSON = (document: DesignDocument): string =>
  JSON.stringify(document, null, INDENT_SIZE)
