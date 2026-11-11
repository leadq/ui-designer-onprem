import type { ComponentMeta, Registry } from '@root/types/componentContract';

import { getExtendedDefinitions } from './extendedMeta/getExtendedDefinitions';
import type { ExtendedRenderers, ExtendedType } from './extendedMeta/types';

export type { ExtendedRenderers, ExtendedType } from './extendedMeta/types';

import { getExtendedExport } from './extendedExport';
import { getPreviewValueConfig, getScalarValue } from './previewValues';

/** Shared semantic catalog; native components and prop translations remain adapter-owned. */
export const getExtendedRegistry = (
  adapter: 'mantine' | 'material' | 'antd',
  renderers: ExtendedRenderers,
): Registry => {
  const definitions = getExtendedDefinitions();

  return Object.fromEntries(
    (Object.keys(definitions) as ExtendedType[]).map((type) => [
      type,
      {
        type,
        ...definitions[type],
        isContainer: type === 'accordion',
        showEmptyPlaceholder: type === 'accordion',
        defaultStyle: ['slider', 'progress', 'accordion', 'alert', 'divider'].includes(type)
          ? { width: 320 }
          : {},
        ...(type === 'accordion' ? {
          disclosure: { titleProp: 'title', initialExpandedProp: 'defaultExpanded' },
          previewValue: { prop: 'expanded', defaultProp: 'defaultExpanded', eventProp: 'onChange', emptyValue: false, read: (value: unknown) => typeof value === 'boolean' ? value : undefined },
        } : {}),
        renderer: renderers[type],
        exportConfig: getExtendedExport(adapter, type),
        ...(['slider', 'rating', 'segmented'].includes(type)
          ? {
              previewValue: {
                ...getPreviewValueConfig(getScalarValue),
                emptyValue: type === 'segmented' ? '' : 0,
              },
            }
          : {}),
      } satisfies ComponentMeta,
    ]),
  );
};
