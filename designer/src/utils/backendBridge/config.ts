// Public endpoint only. Missing configuration leaves MCP disconnected; there is no fallback transport.
export const BACKEND_WS_URL = process.env.__BACKEND_WS_KEY__ as string | undefined
