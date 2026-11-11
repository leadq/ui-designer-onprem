import { ToastSurface } from '@root/adapters/shared/OverlaySurface';
import type { OverlaySurfaceProps } from '@root/types/flow';

import { Alert, AlertTitle } from '@mui/material';

export type MaterialToastSurfaceProps = OverlaySurfaceProps;

export const MaterialToastSurface = ({
  opened,
  designMode,
  title,
  closeLabel,
  onClose,
  children,
}: MaterialToastSurfaceProps) => (
  <ToastSurface isDesignMode={designMode} isOpen={opened}>
    <Alert closeText={closeLabel} severity="info" onClose={onClose}>
      <AlertTitle>{title}</AlertTitle>
      {children}
    </Alert>
  </ToastSurface>
);
