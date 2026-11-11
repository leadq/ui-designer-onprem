import { getCollectionRegistry } from '../shared/collections/getCollectionRegistry';
import { CollectionListRenderer } from './CollectionListRenderer';
import { CollectionTabsRenderer } from './CollectionTabsRenderer';
import type { Registry } from '@root/types/componentContract';

import { materialBoxMeta } from './constants/components/box';
import { materialButtonMeta } from './constants/components/button';
import { materialCardMeta } from './constants/components/card';
import { materialCheckboxMeta } from './constants/components/checkbox';
import { materialDataTableMeta } from './constants/components/dataTable';
import { materialGridMeta } from './constants/components/grid';
import { materialListMeta } from './constants/components/list';
import { materialNumberInputMeta } from './constants/components/numberInput';
import { materialRadioMeta } from './constants/components/radio';
import { materialSelectMeta } from './constants/components/select';
import { materialSwitchMeta } from './constants/components/switch';
import { materialTextareaMeta } from './constants/components/textarea';
import { materialTextInputMeta } from './constants/components/textInput';
import { materialTypographyMeta } from './constants/components/typography';
import {
  AccordionRenderer,
  AlertRenderer,
  DividerRenderer,
  ProgressRenderer,
  RatingRenderer,
  SegmentedRenderer,
  SliderRenderer,
} from './ExtendedRenderers';
import { configureMaterialRegistry } from './utils/configureMaterialRegistry';

import { getExtendedRegistry } from '../shared/extendedMeta';

export const materialRegistry: Registry = {
  ...getCollectionRegistry('material', materialBoxMeta, CollectionListRenderer, CollectionTabsRenderer),
  ...getExtendedRegistry('material', {
    slider: SliderRenderer,
    rating: RatingRenderer,
    segmented: SegmentedRenderer,
    accordion: AccordionRenderer,
    alert: AlertRenderer,
    progress: ProgressRenderer,
    divider: DividerRenderer,
  }),
  button: materialButtonMeta,
  typography: materialTypographyMeta,
  box: materialBoxMeta,
  card: materialCardMeta,
  grid: materialGridMeta,
  textInput: materialTextInputMeta,
  select: materialSelectMeta,
  checkbox: materialCheckboxMeta,
  switch: materialSwitchMeta,
  radio: materialRadioMeta,
  numberInput: materialNumberInputMeta,
  textarea: materialTextareaMeta,
  dataTable: materialDataTableMeta,
  list: materialListMeta,
};

configureMaterialRegistry(materialRegistry);
