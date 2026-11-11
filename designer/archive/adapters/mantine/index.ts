import { getCollectionRegistry } from '../shared/collections/getCollectionRegistry';
import { CollectionListRenderer } from './CollectionListRenderer';
import { CollectionTabsRenderer } from './CollectionTabsRenderer';
import type { Registry } from '@root/types/componentContract';

import { mantineBoxMeta } from './box';
import { mantineButtonMeta } from './button';
import { mantineCardMeta } from './card';
import { mantineCheckboxMeta } from './checkbox';
import { mantineDataTableMeta } from './dataTable';
import {
  AccordionRenderer,
  AlertRenderer,
  DividerRenderer,
  ProgressRenderer,
  RatingRenderer,
  SegmentedRenderer,
  SliderRenderer,
} from './ExtendedRenderers';
import { mantineGridMeta } from './grid';
import { mantineListMeta } from './list';
import { mantineNumberInputMeta } from './numberInput';
import { MantineModalSurface, MantineToastSurface } from './OverlaySurface';
import { mantineRadioMeta } from './radio';
import { mantineSelectMeta } from './select';
import { mantineSwitchMeta } from './switch';
import { mantineTextareaMeta } from './textarea';
import { mantineTextInputMeta } from './textInput';
import { mantineTypographyMeta } from './typography';

import { getExtendedRegistry } from '../shared/extendedMeta';
import { getOverlayMeta } from '../shared/overlayMeta';
import {
  getEventChecked,
  getEventValue,
  getPreviewValueConfig,
  getScalarValue,
} from '../shared/previewValues';

export const mantineRegistry: Registry = {
  ...getCollectionRegistry('mantine', mantineBoxMeta, CollectionListRenderer, CollectionTabsRenderer),
  ...getExtendedRegistry('mantine', {
    slider: SliderRenderer,
    rating: RatingRenderer,
    segmented: SegmentedRenderer,
    accordion: AccordionRenderer,
    alert: AlertRenderer,
    progress: ProgressRenderer,
    divider: DividerRenderer,
  }),
  button: mantineButtonMeta,
  typography: mantineTypographyMeta,
  textInput: mantineTextInputMeta,
  select: mantineSelectMeta,
  checkbox: mantineCheckboxMeta,
  switch: mantineSwitchMeta,
  numberInput: mantineNumberInputMeta,
  textarea: mantineTextareaMeta,
  radio: mantineRadioMeta,
  card: mantineCardMeta,
  box: mantineBoxMeta,
  grid: mantineGridMeta,
  dataTable: mantineDataTableMeta,
  list: mantineListMeta,
};

for (const type of [
  'textInput',
  'textarea',
  'select',
  'numberInput',
  'checkbox',
  'switch',
  'radio',
]) {
  const meta = mantineRegistry[type];
  const checked = ['checkbox', 'switch', 'radio'].includes(type);

  meta.previewValue = getPreviewValueConfig(
    checked
      ? getEventChecked
      : ['select', 'numberInput'].includes(type)
        ? getScalarValue
        : getEventValue,
    checked,
  );

  if (!checked && !meta.propsSchema.some((prop) => prop.key === 'defaultValue')) {
    meta.propsSchema = [
      ...meta.propsSchema,
      {
        key: 'defaultValue',
        label: 'Initial value',
        type: type === 'numberInput' ? 'number' : 'text',
        defaultValue: '',
      },
    ];
  }
}

mantineRegistry.modal = getOverlayMeta(mantineRegistry.box, 'modal', MantineModalSurface, {
  importPath: '@mantine/core',
  importName: 'Modal',
  importType: 'named',
  additionalImports: ['Box'],
  renderJSX: (node, props, children) =>
    `<Modal opened={${Boolean(node.overlay?.initiallyOpen)}} onClose={() => {}} title={${JSON.stringify(node.label ?? 'Modal')}} withOverlay={${node.overlay?.withBackdrop !== false}}><Box ${props.join(' ')}>${children}</Box></Modal>`,
});

mantineRegistry.notification = getOverlayMeta(
  mantineRegistry.box,
  'notification',
  MantineToastSurface,
  {
    importPath: '@mantine/core',
    importName: 'Notification',
    importType: 'named',
    renderJSX: (node, props, children) =>
      `<Notification title={${JSON.stringify(node.label ?? 'Toast')}} ${props.join(' ')}>${children}</Notification>`,
  },
);
