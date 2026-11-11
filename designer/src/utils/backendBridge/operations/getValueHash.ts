const HEX_BYTE_WIDTH = 2
const HEX_RADIX = 16

export const getValueHash = async (input: unknown) => {
  const bytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(JSON.stringify(input)),
  )

  return [...new Uint8Array(bytes)]
    .map((value) => value.toString(HEX_RADIX).padStart(HEX_BYTE_WIDTH, '0'))
    .join('')
}
