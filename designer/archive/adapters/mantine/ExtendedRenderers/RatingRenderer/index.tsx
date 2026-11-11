import type { RendererProps } from '@root/types/componentContract';

import { Rating } from '@mantine/core';

export type RatingRendererProps = RendererProps;

export const RatingRenderer = ({
  renderMode: _mode,
  rootRef,
  rootClassName,
  label,
  disabled,
  onChange,
  ...props
}: RatingRendererProps) => (
  <Rating
    {...props}
    ref={rootRef}
    aria-disabled={Boolean(disabled)}
    aria-label={String(label ?? 'Rating')}
    className={rootClassName}
    readOnly={Boolean(disabled)}
    onChange={onChange as (value: number) => void}
  />
);
