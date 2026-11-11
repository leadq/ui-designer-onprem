import type { ComponentMeta } from '@root/types/componentContract';
import type { PropSchema } from '@root/types/propSchema';

import {
  DEFAULT_PROGRESS_VALUE,
  DEFAULT_RATING_COUNT,
  DEFAULT_SLIDER_MAX,
  DEFAULT_SLIDER_STEP,
  DEFAULT_SLIDER_VALUE,
  DISABLED,
  OPTIONS,
} from './constants';
import type { ExtendedType } from './types';

const getNumber = (key: string, label: string, defaultValue: number): PropSchema => ({
  key,
  label,
  type: 'number',
  defaultValue,
});

const getText = (key: string, label: string, defaultValue: string): PropSchema => ({
  key,
  label,
  type: 'text',
  defaultValue,
});

export const getExtendedDefinitions = () => {
  const definitions: Record<
    ExtendedType,
    Pick<
      ComponentMeta,
      'displayName' | 'category' | 'defaultProps' | 'propsSchema' | 'searchKeywords'
    >
  > = {
    slider: {
      displayName: 'Slider',
      category: 'form',
      searchKeywords: ['kaydırıcı', 'aralık'],
      defaultProps: { label: 'Amount', min: 0, max: 100, step: 10, defaultValue: 30 },
      propsSchema: [
        getText('label', 'Label', 'Amount'),
        getNumber('min', 'Minimum', 0),
        getNumber('max', 'Maximum', DEFAULT_SLIDER_MAX),
        getNumber('step', 'Step', DEFAULT_SLIDER_STEP),
        getNumber('defaultValue', 'Initial value', DEFAULT_SLIDER_VALUE),
        DISABLED,
      ],
    },
    rating: {
      displayName: 'Rating',
      category: 'form',
      searchKeywords: ['puan', 'yıldız', 'rate'],
      defaultProps: { label: 'Rating', count: 5, defaultValue: 2 },
      propsSchema: [
        getText('label', 'Label', 'Rating'),
        getNumber('count', 'Stars', DEFAULT_RATING_COUNT),
        getNumber('defaultValue', 'Initial value', 2),
        DISABLED,
      ],
    },
    segmented: {
      displayName: 'Segmented Control',
      category: 'form',
      searchKeywords: ['seçenek grubu', 'toggle button'],
      defaultProps: { label: 'Period', data: OPTIONS, defaultValue: 'daily' },
      propsSchema: [
        getText('label', 'Label', 'Period'),
        getText('defaultValue', 'Initial value', 'daily'),
        {
          key: 'data',
          label: 'Options',
          type: 'arrayOfObjects',
          defaultValue: OPTIONS,
          itemSchema: [
            { key: 'value', label: 'Value', type: 'text', required: true },
            { key: 'label', label: 'Label', type: 'text', required: true },
            { key: 'disabled', label: 'Disabled', type: 'boolean' },
          ],
        },
        DISABLED,
      ],
    },
    accordion: {
      displayName: 'Accordion',
      category: 'layout',
      searchKeywords: ['açılır bölüm', 'aç kapa', 'collapse', 'expand', 'expandable', 'daralt', 'genişlet'],
      defaultProps: { title: 'Details', defaultExpanded: true },
      propsSchema: [
        getText('title', 'Title', 'Details'),
        {
          key: 'defaultExpanded',
          label: 'Initially expanded',
          type: 'boolean',
          defaultValue: true,
        },
        DISABLED,
      ],
    },
    alert: {
      displayName: 'Alert',
      category: 'display',
      searchKeywords: ['uyarı', 'bilgi'],
      defaultProps: {
        title: 'Information',
        children: 'Please review the details.',
        severity: 'info',
      },
      propsSchema: [
        getText('title', 'Title', 'Information'),
        getText('children', 'Text', 'Please review the details.'),
        {
          key: 'severity',
          label: 'Status',
          type: 'select',
          options: ['info', 'success', 'warning', 'error'],
          defaultValue: 'info',
        },
      ],
    },
    progress: {
      displayName: 'Progress',
      category: 'display',
      searchKeywords: ['ilerleme'],
      defaultProps: { value: 40, label: 'Progress' },
      propsSchema: [
        getNumber('value', 'Progress (%)', DEFAULT_PROGRESS_VALUE),
        getText('label', 'Label', 'Progress'),
      ],
    },
    divider: {
      displayName: 'Divider',
      category: 'layout',
      searchKeywords: ['ayırıcı', 'çizgi'],
      defaultProps: { label: 'Section' },
      propsSchema: [getText('label', 'Label', 'Section')],
    },
  };

  return definitions;
};
