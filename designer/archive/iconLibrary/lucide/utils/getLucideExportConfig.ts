import type { ComponentExportConfig } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import type { IconEntry } from '@root/types/iconLibrary'

const DEFAULT_ICON_SIZE = 32

export const getLucideExportConfig = (
  entry: IconEntry,
  node: DesignNode,
): ComponentExportConfig => {
  const getJSX = (_node: DesignNode, attributes: string[]) => {
    const size = Number(node.props.size ?? DEFAULT_ICON_SIZE)
    const label = String(node.props.accessibleLabel ?? '')
    const nativeProps = `size={${size}} aria-hidden={true}`
    const wrapperProps = attributes.filter((value) => !/^(glyph|size|accessibleLabel)=/.test(value))
    const a11y = label ? `role="img" aria-label={${JSON.stringify(label)}}` : 'aria-hidden="true"'

    return `<span ${wrapperProps.join(' ')} ${a11y}><DesignIcon_lucide_${entry.importName} ${nativeProps} /></span>`
  }

  return {
    importType: 'named',
    importPath: 'lucide-react',
    importName: entry.importName,
    jsxName: `DesignIcon_lucide_${entry.importName}`,
    renderJSX: getJSX,
  }
}
