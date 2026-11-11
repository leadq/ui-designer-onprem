import { ToastSurface } from '@root/adapters/shared/OverlaySurface';
import type { OverlaySurfaceProps } from '@root/types/flow';
import { Alert, Button } from 'antd';

export type AntDesignToastSurfaceProps = OverlaySurfaceProps;

export const AntDesignToastSurface = ({
  opened,
  designMode,
  title,
  closeLabel,
  onClose,
  children,
}: AntDesignToastSurfaceProps) => (
  <ToastSurface isDesignMode={designMode} isOpen={opened}>
    <Alert
      showIcon
      description={children}
      message={title}
      type="info"
      action={
        <Button aria-label={closeLabel} type="text" onClick={onClose}>
          ×
        </Button>
      }
    />
  </ToastSurface>
);
