export interface BridgeMessage {
  type?: string
  protocol?: number
  code?: string
  requestId?: string
  operation?: string
  args?: Record<string, unknown>
}
