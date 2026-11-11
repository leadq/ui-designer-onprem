import { getCollectionRegistry } from '../shared/collections/getCollectionRegistry';
import { CollectionListRenderer } from './CollectionListRenderer';
import { CollectionTabsRenderer } from './CollectionTabsRenderer';
import type { Registry } from '@root/types/componentContract';

import { antDesignBoxMeta } from './constants/components/box';
import { antDesignButtonMeta } from './constants/components/button';
import { antDesignCardMeta } from './constants/components/card';
import { antDesignCheckboxMeta } from './constants/components/checkbox';
import { antDesignDataTableMeta } from './constants/components/dataTable';
import { antDesignGridMeta } from './constants/components/grid';
import { antDesignListMeta } from './constants/components/list';
import { antDesignNumberInputMeta } from './constants/components/numberInput';
import { antDesignRadioMeta } from './constants/components/radio';
import { antDesignSelectMeta } from './constants/components/select';
import { antDesignSwitchMeta } from './constants/components/switch';
import { antDesignTextareaMeta } from './constants/components/textarea';
import { antDesignTextInputMeta } from './constants/components/textInput';
import { antDesignTypographyMeta } from './constants/components/typography';
import {
  AccordionRenderer,
  AlertRenderer,
  DividerRenderer,
  ProgressRenderer,
  RatingRenderer,
  SegmentedRenderer,
  SliderRenderer,
} from './ExtendedRenderers';
import { configureAntDesignRegistry } from './utils/configureAntDesignRegistry';

import { getExtendedRegistry } from '../shared/extendedMeta';

export const antDesignRegistry: Registry = {
  ...getCollectionRegistry('antd', antDesignBoxMeta, CollectionListRenderer, CollectionTabsRenderer),
  ...getExtendedRegistry('antd', {
    slider: SliderRenderer,
    rating: RatingRenderer,
    segmented: SegmentedRenderer,
    accordion: AccordionRenderer,
    alert: AlertRenderer,
    progress: ProgressRenderer,
    divider: DividerRenderer,
  }),
  button: antDesignButtonMeta,
  typography: antDesignTypographyMeta,
  box: antDesignBoxMeta,
  card: antDesignCardMeta,
  grid: antDesignGridMeta,
  textInput: antDesignTextInputMeta,
  numberInput: antDesignNumberInputMeta,
  textarea: antDesignTextareaMeta,
  select: antDesignSelectMeta,
  checkbox: antDesignCheckboxMeta,
  switch: antDesignSwitchMeta,
  radio: antDesignRadioMeta,
  list: antDesignListMeta,
  dataTable: antDesignDataTableMeta,
};

configureAntDesignRegistry(antDesignRegistry);
