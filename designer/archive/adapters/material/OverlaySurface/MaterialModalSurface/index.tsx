import { useStableId } from '@root/hooks/useStableId';

import { OverlayDesignSurface } from '@root/adapters/shared/OverlayDesignSurface';
import type { OverlaySurfaceProps } from '@root/types/flow';

import { Dialog, DialogContent, DialogTitle, IconButton, Paper, Typography } from '@mui/material';

import styles from '@root/adapters/shared/OverlaySurface/styles.module.scss';

export type MaterialModalSurfaceProps = OverlaySurfaceProps;

export const MaterialModalSurface = ({
  opened,
  designMode,
  title,
  closeLabel,
  withBackdrop,
  onClose,
  children,
}: MaterialModalSurfaceProps) => {
  const titleId = useStableId();

  const content = (
    <>
      <DialogTitle className={styles.overlaySurface__title} id={`${titleId}-heading`}>
        <Typography component="span" id={titleId} variant="h6">
          {title}
        </Typography>
        <IconButton aria-label={closeLabel} onClick={onClose}>
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </>
  );

  if (designMode) {
    return (
      <OverlayDesignSurface hasBackdrop={withBackdrop}>
        <Paper elevation={24}>{content}</Paper>
      </OverlayDesignSurface>
    );
  }

  return (
    <Dialog
      disableRestoreFocus
      fullWidth
      keepMounted
      aria-labelledby={titleId}
      hideBackdrop={!withBackdrop}
      maxWidth="sm"
      open={opened}
      transitionDuration={0}
      onClose={onClose}
    >
      {content}
    </Dialog>
  );
};
