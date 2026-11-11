import type { DesignNode } from '@root/types/document';

import { CARD_BODY_LAYOUT } from './cardLayout';

import { getSelectOptions } from '../shared/getSelectOptions';

const DATA_PROP_NAME_LENGTH = 4;

export const getCardJSX = (_node: DesignNode, props: string[], children: string): string =>
  `<Card ${props.join(' ')} styles={${JSON.stringify({ body: CARD_BODY_LAYOUT })}}>${children}</Card>`;

const isRootProp = (prop: string) => prop.startsWith('style=') || prop.startsWith('data-');

export const renderFieldJSX =
  (name: string) =>
  (node: DesignNode, props: string[]): string => {
    const rootProps = props.filter(isRootProp).join(' ');

    const controlProps = props
      .filter(
        (prop) =>
          !isRootProp(prop) &&
          !prop.startsWith('label=') &&
          !prop.startsWith('data=') &&
          !prop.startsWith('minRows=') &&
          !prop.startsWith('id='),
      )
      .join(' ');

    const fieldId = JSON.stringify(`field-${node.id}`);
    const dataProp = props.find((prop) => prop.startsWith('data={item.'));

    const extra =
      name === 'Select'
        ? ` options${dataProp ? dataProp.slice(DATA_PROP_NAME_LENGTH) : `={${JSON.stringify(getSelectOptions(node.props.data))}}`}`
        : name === 'Input.TextArea'
          ? ` autoSize={{ minRows: ${Number(node.props.minRows ?? 2)} }}`
          : '';

    return `<Form.Item ${rootProps} label={${JSON.stringify(node.props.label ?? '')}} htmlFor={${fieldId}} layout="vertical"><${name} ${controlProps} id={${fieldId}}${extra} /></Form.Item>`;
  };

export const renderToggleJSX =
  (name: string) =>
  (node: DesignNode, props: string[]): string => {
    const nativeProps = props.filter((prop) => !prop.startsWith('label=')).join(' ');

    return `<${name} ${nativeProps}>{${JSON.stringify(node.props.label ?? '')}}</${name}>`;
  };
