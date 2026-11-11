import type { ComponentMeta } from '@root/types/componentContract';
import type { PropSchema } from '@root/types/propSchema';

export const getMeta = (
  type: string,
  displayName: string,
  category: ComponentMeta['category'],
  renderer: ComponentMeta['renderer'],
  importName: string,
  defaultProps: Record<string, unknown>,
  propsSchema: PropSchema[],
  isContainer = false,
): ComponentMeta => ({
  type,
  displayName,
  category,
  renderer,
  defaultProps,
  propsSchema,
  isContainer,
  defaultStyle: isContainer ? { minHeight: 100, padding: 10 } : {},
  exportConfig: { importPath: 'antd', importName, importType: 'named' },
});
