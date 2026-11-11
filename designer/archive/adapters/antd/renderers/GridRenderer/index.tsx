import { Children, type ReactNode } from 'react';

import type { RendererProps } from '@root/types/componentContract';
import { Col, Row } from 'antd';

export type GridRendererProps = RendererProps;

export const GridRenderer = ({
  renderMode: _renderMode,
  rootClassName,
  rootRef,
  children,
  ...props
}: GridRendererProps) => (
  <Row {...props} ref={rootRef} className={rootClassName}>
    {Children.map(children as ReactNode, (child) => (
      <Col span={12}>{child}</Col>
    ))}
  </Row>
);
