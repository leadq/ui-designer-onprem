import { useRef } from 'react';

import { OverlayDesignSurface } from '@root/adapters/shared/OverlayDesignSurface';
import type { OverlaySurfaceProps } from '@root/types/flow';
import { Button, Card, Modal } from 'antd';

export type AntDesignModalSurfaceProps = OverlaySurfaceProps;

export const AntDesignModalSurface = ({
  opened,
  designMode,
  title,
  closeLabel,
  withBackdrop,
  onClose,
  children,
}: AntDesignModalSurfaceProps) => {
  const isReady = useRef(false);
  const pendingClose = useRef(false);

  // Escape can arrive while Ant is preparing its portal. Complete opening before closing it.
  const handleClose = () => {
    if (isReady.current) {
      onClose();
    } else {
      pendingClose.current = true;
    }
  };

  const handleOpenChange = (visible: boolean) => {
    isReady.current = visible;

    if (visible && pendingClose.current) {
      pendingClose.current = false;
      onClose();
    }

    if (!visible) {
      pendingClose.current = false;
    }
  };

  const handleCloseCancel = handleClose;

  return designMode ? (
    <OverlayDesignSurface hasBackdrop={withBackdrop}>
      <Card
        title={title}
        extra={
          <Button aria-label={closeLabel} type="text">
            ×
          </Button>
        }
      >
        {children}
      </Card>
    </OverlayDesignSurface>
  ) : (
    <Modal
      afterOpenChange={handleOpenChange}
      closable={{ 'aria-label': closeLabel }}
      destroyOnHidden={false}
      focusTriggerAfterClose={false}
      footer={null}
      keyboard={opened}
      mask={withBackdrop}
      open={opened}
      title={title}
      onCancel={handleCloseCancel}
    >
      {children}
    </Modal>
  );
};
