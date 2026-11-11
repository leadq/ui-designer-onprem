import type { ComponentExportConfig } from '@root/types/componentContract';

export const getMantineExportConfig = (
  importName: string,
  agentPlaceholder?: string,
): ComponentExportConfig => ({
  importPath: '@mantine/core',
  importName,
  importType: 'named',
  agentPlaceholder,
});
