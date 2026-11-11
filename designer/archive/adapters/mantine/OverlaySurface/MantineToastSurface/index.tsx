import { ToastSurface } from '@root/adapters/shared/OverlaySurface';
import type { OverlaySurfaceProps } from '@root/types/flow';

import { Notification } from '@mantine/core';

export type MantineToastSurfaceProps = OverlaySurfaceProps;

export const MantineToastSurface = ({
  opened,
  designMode,
  title,
  closeLabel,
  onClose,
  children,
}: MantineToastSurfaceProps) => (
  <ToastSurface isDesignMode={designMode} isOpen={opened}>
    <Notification
      closeButtonProps={{ 'aria-label': closeLabel }}
      role="alert"
      title={title}
      onClose={onClose}
    >
      {children}
    </Notification>
  </ToastSurface>
);
