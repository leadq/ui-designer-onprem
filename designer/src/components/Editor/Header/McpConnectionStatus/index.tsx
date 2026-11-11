import { useSyncExternalStore } from 'react'
import { Text } from '@root/components/common'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import {
  getMcpConnectionStatus,
  subscribeMcpConnectionStatus,
} from '@root/stores/mcpConnectionStore'

import styles from './styles.module.scss'

export const McpConnectionStatus = () => {
  const { translate } = useBuilderI18n()
  const status = useSyncExternalStore(subscribeMcpConnectionStatus, getMcpConnectionStatus)
  const label = translate(`header.mcp.${status}`)

  return (
    <EditorTooltip label={label}>
      <Text
        aria-live='polite'
        className={[styles.mcpConnectionStatus, styles[`mcpConnectionStatus--${status}`]].join(' ')}
        role='status'
        size='xs'
      >
        {label}
      </Text>
    </EditorTooltip>
  )
}
