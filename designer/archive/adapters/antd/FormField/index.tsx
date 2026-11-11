import type { ReactNode } from 'react';

import { useStableId } from '@root/hooks/useStableId';

import { Box } from '@root/components/common/Box';
import type { RendererProps } from '@root/types/componentContract';
import { Form } from 'antd';

import styles from './styles.module.scss';

export interface FormFieldProps extends RendererProps {
  renderControl: (id: string) => ReactNode;
}

export const FormField = ({
  rootRef,
  rootClassName,
  style,
  label,
  'data-node-id': nodeId,
  renderControl,
}: FormFieldProps) => {
  const id = useStableId();

  return (
    <Box
      ref={rootRef}
      className={`${styles.formField} ${rootClassName ?? ''}`}
      data-node-id={nodeId}
      style={style}
    >
      <Form.Item
        className={styles.formField__item}
        htmlFor={id}
        label={label as ReactNode}
        layout="vertical"
      >
        {renderControl(id)}
      </Form.Item>
    </Box>
  );
};
