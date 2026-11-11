import type { RendererProps } from '@root/types/componentContract';

import { Rating } from '@mui/material';

export type RatingRendererProps = RendererProps;

export const RatingRenderer = ({
  renderMode: _mode,
  rootRef,
  rootClassName,
  label,
  count = 5,
  onChange,
  ...props
}: RatingRendererProps) => (
  <Rating
    {...props}
    ref={rootRef}
    aria-label={String(label ?? 'Rating')}
    className={rootClassName}
    max={Number(count)}
    onChange={(_event, value) => {
      if (typeof onChange === 'function') {
        onChange(value ?? 0);
      }
    }}
  />
);
