import { getAdapter, UI_ADAPTERS } from '@root/adapters'
import { DESIGN_ICON_LIBRARY } from '@root/adapters/iconLibrary'
import { BREAKPOINT_MAP } from '@root/constants/breakpoints'
import { getAdapterBackgroundColor } from '@root/utils/colorTokens/getAdapterBackgroundColor'
import { DESIGN_SCHEMA_VERSION } from '@root/utils/designDocument'

import { DESIGN_AUTHORING_CONTRACT, getComponentAuthoring } from '../authoringContract'
import { validateComponentContract } from '../componentContract'

export const getDesignCatalog = (
  adapterId?: string,
  componentTypes?: string[],
  purpose: 'authoring' | 'revision' = 'authoring',
) => {
  if (!adapterId) {
    return {
      schemaVersion: DESIGN_SCHEMA_VERSION,
      adapters: Object.values(UI_ADAPTERS).map(({ id, name }) => ({ id, name })),
    }
  }

  const adapter = getAdapter(adapterId)
  const types = componentTypes ?? Object.keys(adapter.registry)

  const components = types.map((type) => {
    const meta = adapter.registry[type]

    if (!meta) {
      throw new Error(`Unknown component type: ${type}`)
    }

    const summary = {
      type,
      displayName: meta.displayName,
      description: meta.description ?? null,
      visualHints: meta.visualHints ?? [],
      category: meta.category,
      isContainer: meta.isContainer,
    }

    if (!componentTypes) {
      return summary
    }

    const recipeIds = new Set<string>()

    for (const recipe of meta.recipes ?? []) {
      if (!recipe.id.trim() || recipeIds.has(recipe.id) || recipe.example.type !== meta.type) {
        throw new Error(`Invalid recipe identity for ${meta.type}: ${recipe.id}`)
      }

      recipeIds.add(recipe.id)

      validateComponentContract([recipe.example], adapter.registry)
    }

    const {
      renderer: _renderer,
      initializeNode: _initializeNode,
      overlay,
      previewValue,
      exportConfig,
      ...data
    } = meta

    const {
      resolve: _resolve,
      renderJSX,
      renderTableJSX,
      renderCollectionJSX,
      supportCode: _supportCode,
      wrapChild,
      ...imports
    } = exportConfig

    const { read: _read, ...valueBinding } = previewValue ?? {}

    return {
      ...data,
      propsSchema:
        purpose === 'authoring' && type === 'icon'
          ? data.propsSchema.map((field) => {
              if (field.key !== 'glyph' || field.type !== 'icon') {
                return field
              }

              const { options: _options, ...descriptor } = field

              return { ...descriptor, searchTool: 'search_icons' }
            })
          : data.propsSchema,
      authoring: getComponentAuthoring(meta),
      overlay: overlay ? { presentation: overlay.presentation } : undefined,
      previewValue: previewValue ? valueBinding : undefined,
      exportConfig: {
        ...imports,
        hasCustomRenderer: Boolean(_resolve || renderJSX || renderTableJSX || renderCollectionJSX),
        hasDynamicExport: Boolean(_resolve),
        wrapsChildren: Boolean(wrapChild),
      },
    }
  })

  return {
    schemaVersion: DESIGN_SCHEMA_VERSION,
    adapterId,
    adapterName: adapter.name,
    colorPalette: adapter.colors ?? [],
    backgroundColor: getAdapterBackgroundColor(adapter) ? adapter.backgroundColor : null,
    breakpoints: BREAKPOINT_MAP,
    structuralTypes: ['designerFrame', 'designerFlow'],
    components,
    authoringContract: DESIGN_AUTHORING_CONTRACT,
    iconLibraries: (DESIGN_ICON_LIBRARY ? [DESIGN_ICON_LIBRARY] : []).map(({ id, name, packageName, entries }) => ({
      id,
      name,
      packageName,
      count: entries.length,
    })),
    themePolicy:
      'Preserve native theme. Use registered prop choices and defaults. Raw style overrides are layout only. Appearance colors use registered adapter colorPalette IDs in styleTokens/responsiveStyleTokens.',
  }
}
