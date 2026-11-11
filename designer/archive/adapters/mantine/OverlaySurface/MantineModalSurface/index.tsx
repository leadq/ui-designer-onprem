import { OverlayDesignSurface } from '@root/adapters/shared/OverlayDesignSurface';
import type { OverlaySurfaceProps } from '@root/types/flow';

import { CloseButton, Group, Modal, Paper, Text } from '@mantine/core';

export type MantineModalSurfaceProps = OverlaySurfaceProps;

export const MantineModalSurface = ({
  opened,
  designMode,
  title,
  closeLabel,
  withBackdrop,
  onClose,
  children,
}: MantineModalSurfaceProps) =>
  designMode ? (
    <OverlayDesignSurface hasBackdrop={withBackdrop}>
      <Paper p="md" radius="md" shadow="xl">
        <Group position="apart" mb="md">
          <Text>{title}</Text>
          <CloseButton aria-label={closeLabel} />
        </Group>
        {children}
      </Paper>
    </OverlayDesignSurface>
  ) : (
    <Modal
      keepMounted
      closeButtonProps={{ 'aria-label': closeLabel }}
      opened={opened}
      returnFocus={false}
      title={title}
      transitionProps={{ duration: 0 }}
      withOverlay={withBackdrop}
      onClose={onClose}
    >
      {children}
    </Modal>
  );
