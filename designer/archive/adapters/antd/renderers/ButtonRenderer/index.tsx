import type { RendererProps } from '@root/types/componentContract';
import { Button } from 'antd';

export type ButtonRendererProps = RendererProps;

export const ButtonRenderer = ({
  renderMode,
  rootClassName,
  rootRef,
  disabled,
  style,
  ...props
}: ButtonRendererProps) => (
  <Button
    {...props}
    ref={rootRef}
    className={rootClassName}
    disabled={Boolean(disabled) && renderMode !== 'design'}
    style={{ ...style, ...(disabled && renderMode === 'design' ? { opacity: 0.5 } : {}) }}
  />
);
