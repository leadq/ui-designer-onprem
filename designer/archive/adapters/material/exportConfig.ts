import type { DesignNode } from '@root/types/document';

import { getSelectOptions } from '../shared/getSelectOptions';

const DATA_PROP_EXPRESSION_OFFSET = 6;

const isRootProp = (prop: string): boolean => prop.startsWith('style=') || prop.startsWith('data-');

export const renderToggleJSX =
  (name: string) =>
  (node: DesignNode, props: string[]): string => {
    const rootProps = props.filter(isRootProp).join(' ');

    const controlProps = props
      .filter((prop) => !isRootProp(prop) && !prop.startsWith('label='))
      .join(' ');

    return `<FormControlLabel ${rootProps} label={${JSON.stringify(node.props.label ?? '')}} control={<${name} ${controlProps} />} />`;
  };

export const getSelectJSX = (node: DesignNode, props: string[]): string => {
  const options = getSelectOptions(node.props.data);
  const nativeProps = props.filter((prop) => !prop.startsWith('data=')).join(' ');

  const defaultValueProp = props.some((prop) => prop.startsWith('defaultValue='))
    ? ''
    : ' defaultValue=""';

  const dataProp = props.find((prop) => prop.startsWith('data={item.'));
  const dataExpression = dataProp?.slice(DATA_PROP_EXPRESSION_OFFSET, -1);

  const items = dataExpression
    ? `{(Array.isArray(${dataExpression}) ? ${dataExpression} : []).map((option: { value: string; label: string; disabled?: boolean }) => <MenuItem key={option.value} value={option.value} disabled={option.disabled}>{option.label}</MenuItem>)}`
    : options
        .map(
          (option) =>
            `<MenuItem value={${JSON.stringify(option.value)}} disabled={${Boolean(option.disabled)}}>{${JSON.stringify(option.label)}}</MenuItem>`,
        )
        .join('\n');

  return `<TextField select${defaultValueProp} ${nativeProps}>\n${items}\n</TextField>`;
};
