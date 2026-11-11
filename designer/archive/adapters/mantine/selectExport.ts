import type { DesignNode } from '@root/types/document';

import { getSelectOptions } from '../shared/getSelectOptions';

export const getSelectJSX = (node: DesignNode, props: string[]): string => {
  const nativeProps = props.map((prop) =>
    prop.startsWith('data=') && Array.isArray(node.props.data)
      ? `data={${JSON.stringify(getSelectOptions(node.props.data))}}`
      : prop,
  );

  return `<Select ${nativeProps.join(' ')} />`;
};
