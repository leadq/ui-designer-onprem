import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Box } from '@root/components/common/Box';

import styles from './styles.module.scss';

export interface ToastSurfaceProps {
  isOpen: boolean;
  isDesignMode: boolean;
  children: ReactNode;
}

/** Placement belongs to the adapter boundary; native Alert/Notification styles stay intact. */
export const ToastSurface = ({ isOpen, isDesignMode, children }: ToastSurfaceProps) => {
  const surface = (
    <Box
      aria-hidden={!isOpen}
      className={styles.overlaySurface__toast}
      data-design={isDesignMode}
      hidden={!isOpen}
    >
      {children}
    </Box>
  );

  return isDesignMode ? surface : createPortal(surface, document.body);
};
