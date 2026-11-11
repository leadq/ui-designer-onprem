import type { ComponentExportConfig } from '@root/types/componentContract'

import type { UsedComponents } from './types'

export const getUsedComponentImports = (
  exportConfig: ComponentExportConfig | undefined,
  componentName: string,
  usedComponents?: UsedComponents,
): void => {
  // Track imports when a collector map is provided
  if (usedComponents && exportConfig && exportConfig.importType !== 'none') {
    const existingImport = usedComponents.get(exportConfig.importPath) ?? {
      named: new Set<string>(),
    }

    if (exportConfig.importType === 'default') {
      existingImport.defaultName = componentName
    } else {
      existingImport.named.add(
        exportConfig.importName === componentName ||
          componentName.startsWith(`${exportConfig.importName}.`)
          ? exportConfig.importName
          : `${exportConfig.importName} as ${componentName}`,
      )
    }

    exportConfig.additionalImports?.forEach((name) => {
      existingImport.named.add(name)
    })

    usedComponents.set(exportConfig.importPath, existingImport)
  }
}
