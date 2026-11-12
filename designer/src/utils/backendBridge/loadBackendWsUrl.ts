const CONFIG_TIMEOUT_MS = 10000

export const loadBackendWsUrl = async (controller: AbortController) => {
  const timeout = window.setTimeout(() => controller.abort(), CONFIG_TIMEOUT_MS)

  try {
    const response = await fetch(new URL('designer-config.json', document.baseURI), {
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error('Designer connection configuration could not be loaded.')
    }

    const config: unknown = await response.json()

    if (
      !config ||
      typeof config !== 'object' ||
      !('backendWsUrl' in config) ||
      typeof config.backendWsUrl !== 'string'
    ) {
      throw new Error('Designer connection configuration is invalid.')
    }

    const address = config.backendWsUrl.trim()
    const isRelative = address.startsWith('/') && !address.startsWith('//')
    const url = new URL(address, window.location.origin)

    if (isRelative) {
      url.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    }

    if (
      (!isRelative && !['ws:', 'wss:'].includes(url.protocol)) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      address.includes('\\') ||
      (window.location.protocol === 'https:' && url.protocol !== 'wss:')
    ) {
      throw new Error(
        'Designer requires a public WebSocket address matching the page security protocol.',
      )
    }

    return url.href
  } finally {
    window.clearTimeout(timeout)
  }
}
