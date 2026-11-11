import type { McpConnectionStatus } from '@root/stores/mcpConnectionStore'
import { getWorkspace } from '@root/utils/workspacePersistence/state'

import { getBridgeMutationResult } from './operations/getBridgeMutationResult'
import { getBridgeOperationResult } from './operations/getBridgeOperationResult'
import { BACKEND_WS_URL } from './config'

const RETRY_MULTIPLIER = 2
const MAX_MESSAGE_SIZE = 16777216
const MAX_BROWSER_PENDING = 16
const POLICY_CLOSE_CODE = 1008
const RETRY_JITTER_DIVISOR = 4
const INITIAL_RETRY_MS = 500
const MAX_RETRY_MS = 15000

interface BridgeMessage {
  type?: string
  protocol?: number
  code?: string
  requestId?: string
  operation?: string
  args?: Record<string, unknown>
}

export const startBackendBridge = (onStatus: (status: McpConnectionStatus) => void) => {
  let isStopped = false
  let socket: WebSocket | undefined
  let timer = 0
  let retry = INITIAL_RETRY_MS
  let work = Promise.resolve()
  const requests = new Map<string, { isCancelled: boolean; socket: WebSocket }>()

  const connect = () => {
    if (isStopped) {
      return
    }

    if (!BACKEND_WS_URL) {
      onStatus('disconnected')

      return
    }

    onStatus('connecting')

    let current: WebSocket

    try {
      current = new WebSocket(BACKEND_WS_URL)
    } catch {
      onStatus('disconnected')

      return
    }

    socket = current

    let isRegistered = false

    current.onopen = () =>
      current.send(
        JSON.stringify({ type: 'register', protocol: 1, clientId: getWorkspace().clientId }),
      )

    current.onmessage = (event: MessageEvent<string>) => {
      let message: BridgeMessage

      try {
        if (typeof event.data !== 'string' || event.data.length > MAX_MESSAGE_SIZE) {
          throw new Error('INVALID_MESSAGE')
        }

        const parsed: unknown = JSON.parse(event.data)

        if (!parsed || typeof parsed !== 'object') {
          throw new Error('INVALID_MESSAGE')
        }

        message = parsed as BridgeMessage
      } catch {
        current.close()

        return
      }

      if (message.type === 'registered' && message.protocol === 1) {
        isRegistered = true

        retry = INITIAL_RETRY_MS

        onStatus('connected')
      } else if (message.type === 'error') {
        onStatus('conflict')

        retry = MAX_RETRY_MS
      } else if (message.type === 'cancel' && typeof message.requestId === 'string') {
        const pending = requests.get(message.requestId)

        if (pending?.socket === current) {
          pending.isCancelled = true
        }
      } else if (
        isRegistered &&
        message.type === 'request' &&
        typeof message.requestId === 'string' &&
        typeof message.operation === 'string' &&
        message.args &&
        typeof message.args === 'object' &&
        !Array.isArray(message.args)
      ) {
        const requestId = message.requestId
        const operation = message.operation
        const args = message.args

        if (requests.size >= MAX_BROWSER_PENDING || requests.has(requestId)) {
          current.send(JSON.stringify({ type: 'response', requestId, error: 'CLIENT_BUSY' }))

          return
        }

        const pending = { isCancelled: false, socket: current }

        requests.set(requestId, pending)

        work = work
          .then(async () => {
            if (isStopped || pending.isCancelled || current.readyState !== WebSocket.OPEN) {
              return
            }

            let response: Record<string, unknown>

            try {
              const result = ['update_design', 'import_design'].includes(operation)
                ? await getBridgeMutationResult(
                    operation,
                    args,
                    () => isStopped || pending.isCancelled,
                  )
                : await getBridgeOperationResult(operation, args)

              response = { result }
            } catch (error) {
              response = {
                error: error instanceof Error ? error.message : 'BROWSER_OPERATION_FAILED',
              }
            }

            if (!isStopped && current.readyState === WebSocket.OPEN) {
              current.send(JSON.stringify({ type: 'response', requestId, ...response }))
            }
          })
          .catch(() => current.close())
          .finally(() => requests.delete(requestId))
      }
    }

    current.onerror = () => current.close()

    current.onclose = (event) => {
      for (const pending of requests.values()) {
        if (pending.socket === current) {
          pending.isCancelled = true
        }
      }

      if (isStopped) {
        return
      }

      onStatus(event.code === POLICY_CLOSE_CODE ? 'conflict' : 'disconnected')

      timer = window.setTimeout(connect, retry + (Math.random() * retry) / RETRY_JITTER_DIVISOR)

      retry = Math.min(MAX_RETRY_MS, retry * RETRY_MULTIPLIER)
    }
  }

  connect()

  return () => {
    isStopped = true

    clearTimeout(timer)

    socket?.close()
  }
}
