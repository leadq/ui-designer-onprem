import type { ReferenceImage } from '@root/types/references'

const HEX_BYTE_WIDTH = 2
const MAX_IMAGE_MEGABYTES = 10
const BYTES_PER_KIBIBYTE = 1024
const MAX_DECODED_PIXELS = 24000000
const MAX_IMAGE_DIMENSION = 4096
const HEX_RADIX = 16
const MAX_IMAGE_NAME_LENGTH = 200

export const getNormalizedReference = async (file: File): Promise<ReferenceImage> => {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    throw new Error('reference.invalidType')
  }

  if (file.size > MAX_IMAGE_MEGABYTES * BYTES_PER_KIBIBYTE * BYTES_PER_KIBIBYTE) {
    throw new Error('reference.tooLarge')
  }

  let bitmap: ImageBitmap

  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error('reference.invalidImage')
  }

  try {
    if (bitmap.width * bitmap.height > MAX_DECODED_PIXELS) {
      throw new Error('reference.tooLarge')
    }

    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')

    canvas.width = Math.max(1, Math.round(bitmap.width * scale))

    canvas.height = Math.max(1, Math.round(bitmap.height * scale))

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('reference.invalidImage')
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))

    if (!blob || blob.size > MAX_IMAGE_MEGABYTES * BYTES_PER_KIBIBYTE * BYTES_PER_KIBIBYTE) {
      throw new Error('reference.tooLarge')
    }

    const sha256 = [
      ...new Uint8Array(await crypto.subtle.digest('SHA-256', await blob.arrayBuffer())),
    ]
      .map((byte) => byte.toString(HEX_RADIX).padStart(HEX_BYTE_WIDTH, '0'))
      .join('')

    return {
      id: crypto.randomUUID(),
      name: file.name.slice(0, MAX_IMAGE_NAME_LENGTH),
      width: canvas.width,
      height: canvas.height,
      bytes: blob.size,
      createdAt: Date.now(),
      blob,
      sha256,
    }
  } finally {
    bitmap.close()
  }
}
