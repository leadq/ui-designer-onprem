import { Frame } from '@root/components/Flows/Frame'
import type { Registry } from '@root/types/componentContract'

/** Editor-owned contexts, never adapter components or palette entries. */
export const structuralRegistry: Registry = Object.fromEntries(
  ['designerFrame', 'designerFlow'].map((type) => [
    type,
    {
      type,
      displayName: type === 'designerFrame' ? 'Screen' : 'Flow',
      category: 'layout',
      isContainer: true,
      defaultProps: {},
      defaultStyle: {},
      propsSchema: [],
      renderer: Frame,
      exportConfig: { importType: 'none', importName: '', importPath: '' },
    },
  ]),
)
