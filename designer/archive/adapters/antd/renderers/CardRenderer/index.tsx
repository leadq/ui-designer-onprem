import { CARD_BODY_LAYOUT } from '@root/adapters/antd/cardLayout';
import type { RendererProps } from '@root/types/componentContract';
import { Card } from 'antd';

export type CardRendererProps = RendererProps;

export const CardRenderer = ({
  renderMode: _renderMode,
  rootClassName,
  rootRef,
  ...props
}: CardRendererProps) => (
  <Card {...props} ref={rootRef} className={rootClassName} styles={{ body: CARD_BODY_LAYOUT }} />
);
