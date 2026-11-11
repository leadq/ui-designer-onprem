export type McpConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'conflict'

let connectionStatus: McpConnectionStatus = 'connecting'
const statusListeners = new Set<() => void>()

export const setMcpConnectionStatus = (status: McpConnectionStatus): void => {
  if (connectionStatus === status) {
    return
  }

  connectionStatus = status

  statusListeners.forEach((listener) => {
    listener()
  })
}

export const getMcpConnectionStatus = (): McpConnectionStatus => connectionStatus

export const subscribeMcpConnectionStatus = (listener: () => void): (() => void) => {
  statusListeners.add(listener)

  return () => statusListeners.delete(listener)
}
