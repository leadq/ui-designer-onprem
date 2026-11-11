import { MantineProvider } from '@mantine/core';

export const MantineAdapterProvider = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider theme={{ colorScheme: 'light' }}>{children}</MantineProvider>
);
