import { Button, Menu } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import { McpConnectionStatus } from '../McpConnectionStatus'

import { useMcpConnectionCopy } from './hooks/useMcpConnectionCopy'

export interface AdvancedMenuProps {
  onExportTsx: () => void
  onExportFlat: () => void
}

export const AdvancedMenu = ({ onExportTsx, onExportFlat }: AdvancedMenuProps) => {
  const { translate } = useBuilderI18n()
  const { isCopied, error, handleCopyClick } = useMcpConnectionCopy()

  return (
    <Menu position='bottom-end' width={280}>
      <Menu.Target>
        <Button size='sm' variant='ghost'>
          {translate('header.advanced')}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{translate('header.connection')}</Menu.Label>
        <Menu.Label>
          <McpConnectionStatus />
        </Menu.Label>
        <Menu.Item shouldCloseOnClick={false} onClick={handleCopyClick}>
          {translate(isCopied ? 'workspace.copied' : 'workspace.copyId')}
        </Menu.Item>
        {error ? <Menu.Label>{error}</Menu.Label> : null}
        <Menu.Divider />
        <Menu.Label>{translate('header.code')}</Menu.Label>
        <Menu.Item onClick={onExportFlat}>{translate('header.exportFlat')}</Menu.Item>
        <Menu.Item onClick={onExportTsx}>{translate('header.exportTsx')}</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
