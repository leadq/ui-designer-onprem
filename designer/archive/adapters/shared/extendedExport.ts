import type { ComponentExportConfig } from '@root/types/componentContract';

import type { ExtendedType } from './extendedMeta';
import { getSelectOptions } from './getSelectOptions';

const DEFAULT_PROGRESS_VALUE = 40;
const DEFAULT_RATING_COUNT = 5;

export const getExtendedExport = (
  adapter: 'mantine' | 'material' | 'antd',
  type: ExtendedType,
): ComponentExportConfig => {
  const names = {
    mantine: {
      slider: 'Slider',
      rating: 'Rating',
      segmented: 'SegmentedControl',
      accordion: 'Accordion',
      alert: 'Alert',
      progress: 'Progress',
      divider: 'Divider',
    },
    material: {
      slider: 'Slider',
      rating: 'Rating',
      segmented: 'ToggleButtonGroup',
      accordion: 'Accordion',
      alert: 'Alert',
      progress: 'LinearProgress',
      divider: 'Divider',
    },
    antd: {
      slider: 'Slider',
      rating: 'Rate',
      segmented: 'Segmented',
      accordion: 'Collapse',
      alert: 'Alert',
      progress: 'Progress',
      divider: 'Divider',
    },
  };

  const name = names[adapter][type];

  return {
    importPath: { mantine: '@mantine/core', material: '@mui/material', antd: 'antd' }[adapter],
    importType: 'named',
    importName: name,
    additionalImports:
      adapter === 'material'
        ? type === 'accordion'
          ? ['AccordionSummary', 'AccordionDetails']
          : type === 'segmented'
            ? ['ToggleButton']
            : type === 'alert'
              ? ['AlertTitle']
              : []
        : [],
    supportCode: adapter === 'material' && type === 'accordion'
      ? "import { ChevronDown as DesignerDisclosureChevron } from 'lucide-react';" : undefined,
    renderJSX: (node, entries, children) => {
      const omit = (...keys: string[]) =>
        entries
          .filter((entry) => !keys.some((key) => entry === key || entry.startsWith(`${key}=`)))
          .join(' ');

      const value = (key: string, fallback: unknown) => JSON.stringify(node.props[key] ?? fallback);

      if (type === 'accordion') {
        const props = omit('title', 'defaultExpanded', 'disabled');
        const title = value('title', 'Details');
        const expanded = Boolean(node.props.defaultExpanded ?? true);
        const disabled = Boolean(node.props.disabled);

        if (adapter === 'mantine') {
          return `<Accordion ${props} defaultValue={${expanded ? '"details"' : 'null'}}><Accordion.Item value="details"><Accordion.Control disabled={${disabled}}>{${title}}</Accordion.Control><Accordion.Panel>${children}</Accordion.Panel></Accordion.Item></Accordion>`;
        }

        if (adapter === 'material') {
          return `<Accordion ${props} defaultExpanded={${expanded}} disabled={${disabled}}><AccordionSummary id={${JSON.stringify(node.id + "-header")}} aria-controls={${JSON.stringify(node.id + "-panel")}} expandIcon={<DesignerDisclosureChevron aria-hidden size={18} />}>{${title}}</AccordionSummary><AccordionDetails>${children}</AccordionDetails></Accordion>`;
        }

        return `<Collapse ${props} defaultActiveKey={${expanded ? '["details"]' : '[]'}} items={[{ key: "details", label: ${title}, collapsible: ${disabled ? '"disabled"' : 'undefined'}, forceRender: true, children: <>${children}</> }]} />`;
      }

      if (type === 'segmented') {
        const props = omit('data', 'label', ...(adapter === 'material' ? ['defaultValue'] : []));
        const options = getSelectOptions(node.props.data);

        if (adapter === 'material') {
          return `<ToggleButtonGroup ${props} aria-label={${value('label', 'Period')}} exclusive value={${value('defaultValue', 'daily')}}>${options.map((option) => `<ToggleButton value={${JSON.stringify(option.value)}} disabled={${Boolean(option.disabled)}}>{${JSON.stringify(option.label)}}</ToggleButton>`).join('')}</ToggleButtonGroup>`;
        }

        return `<${name} ${props} aria-label={${value('label', 'Period')}} ${adapter === 'antd' ? 'options' : 'data'}={${JSON.stringify(options)}} />`;
      }

      if (type === 'alert') {
        const props = omit('title', 'severity');
        const title = value('title', 'Information');

        if (adapter === 'material') {
          return `<Alert ${props} severity={${value('severity', 'info')}}><AlertTitle>{${title}}</AlertTitle>${children}</Alert>`;
        }

        if (adapter === 'antd') {
          return `<Alert ${props} type={${value('severity', 'info')}} message={${title}} description={<>${children}</>} showIcon />`;
        }

        const color =
          { info: 'blue', success: 'green', warning: 'yellow', error: 'red' }[
            String(node.props.severity) as 'info'
          ] ?? 'blue';

        return `<Alert ${props} title={${title}} color={${JSON.stringify(color)}}>${children}</Alert>`;
      }

      if (type === 'divider') {
        return adapter === 'mantine'
          ? `<Divider ${entries.join(' ')} />`
          : `<Divider ${omit('label')}>{${value('label', 'Section')}}</Divider>`;
      }

      if (type === 'progress') {
        return `<${name} ${omit('label', 'value')} aria-label={${value('label', 'Progress')}} ${adapter === 'antd' ? 'percent' : 'value'}={${value('value', DEFAULT_PROGRESS_VALUE)}} ${adapter === 'material' ? 'variant="determinate"' : ''} />`;
      }

      if (type === 'rating' && adapter === 'mantine') {
        return `<Rating ${omit('label', 'disabled')} aria-label={${value('label', 'Rating')}} readOnly={${Boolean(node.props.disabled)}} aria-disabled={${Boolean(node.props.disabled)}} />`;
      }

      return `<${name} ${omit('label', ...(type === 'rating' && adapter === 'material' ? ['count'] : []))} ${type === 'slider' && adapter === 'mantine' ? 'thumbLabel' : 'aria-label'}={${value('label', type)}} ${type === 'rating' && adapter === 'material' ? `max={${value('count', DEFAULT_RATING_COUNT)}}` : ''} />`;
    },
  };
};
