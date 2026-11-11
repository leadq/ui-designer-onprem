import type { ComponentExportConfig } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { getDefaultIconGlyph } from './getDefaultIconGlyph'
import { getIconEntry } from './getIconEntry'

export const getIconExportConfig = (node: DesignNode): ComponentExportConfig => {
  const key = String(node.props.glyph ?? getDefaultIconGlyph())
  const entry = getIconEntry(key)

  if (key && !entry) {
    throw new Error(`Unknown icon: ${key}`)
  }

  const getEmptyJSX = (_node: DesignNode, attributes: string[]) =>
    `<span ${attributes.filter((value) => !/^(glyph|size|accessibleLabel)=/.test(value)).join(' ')} />`

  return entry
    ? entry.library.getExportConfig(entry, node)
    : {
        importType: 'none',
        importName: 'span',
        importPath: '',
        renderJSX: getEmptyJSX,
      }
}
