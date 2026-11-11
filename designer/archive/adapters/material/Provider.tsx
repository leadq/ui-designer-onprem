import { ThemeProvider } from '@mui/material/styles';

import { materialTheme } from './theme';

export const MaterialAdapterProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={materialTheme}>{children}</ThemeProvider>
);
