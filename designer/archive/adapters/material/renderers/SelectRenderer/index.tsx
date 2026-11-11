import { getSelectOptions } from '@root/adapters/shared/getSelectOptions';
import type { RendererProps } from '@root/types/componentContract';

import { MenuItem } from '@mui/material';

import { TextInputRenderer } from '../TextInputRenderer';

export type SelectRendererProps = RendererProps;

export const SelectRenderer = ({
  data,
  defaultValue = '',
  onClick,
  ...props
}: SelectRendererProps) => (
  <TextInputRenderer
    {...props}
    select
    defaultValue={Array.isArray(data) ? defaultValue : ''}
    slotProps={{
      select: {
        onMouseDown: (event: React.MouseEvent<HTMLElement>) => {
          const target = event.target as HTMLElement;

          if (
            typeof onClick === 'function' &&
            event.currentTarget.contains(target) &&
            target.closest('[role="combobox"]')
          ) {
            onClick(event);
          }
        },
      },
    }}
    onMouseDownCapture={(event: React.MouseEvent<HTMLElement>) => {
      if (typeof onClick === 'function' && (event.target as HTMLElement).closest('label')) {
        onClick(event);
      }
    }}
    onClick={(event: React.MouseEvent<HTMLElement>) => {
      // The native menu opens on mousedown; its portal must not bubble another click.
      const target = event.target as HTMLElement;

      if (
        typeof onClick === 'function' &&
        event.currentTarget.contains(target) &&
        !target.closest('[role="combobox"], input, label')
      ) {
        onClick(event);
      }
    }}
  >
    {getSelectOptions(data).map((option) => (
      <MenuItem key={option.value} disabled={option.disabled} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextInputRenderer>
);
