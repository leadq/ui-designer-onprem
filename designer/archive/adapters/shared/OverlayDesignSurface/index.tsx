import type { ReactNode } from 'react';

import { Box } from '@root/components/common/Box';

import styles from './styles.module.scss';

export interface OverlayDesignSurfaceProps {
  hasBackdrop: boolean;
  children: ReactNode;
}
export const OverlayDesignSurface = ({ hasBackdrop, children }: OverlayDesignSurfaceProps) => (
  <Box className={styles.overlayDesignSurface} data-backdrop={hasBackdrop}>
    <Box className={styles.overlayDesignSurface__content}>{children}</Box>
  </Box>
);
