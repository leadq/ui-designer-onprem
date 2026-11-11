import type { ReactNode } from 'react';

import { ConfigProvider } from 'antd';
import { antDesignTheme } from './theme';

export const AntDesignAdapterProvider = ({ children }: { children: ReactNode }) => (
  <ConfigProvider theme={antDesignTheme}>{children}</ConfigProvider>
);
