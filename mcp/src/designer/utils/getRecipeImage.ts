import { createHash } from 'node:crypto';
import { open, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

import { getDesignContract } from './getDesignContract.js';

const imageSchema = z.object({
  id: z.string().min(1), file: z.string().regex(/^[a-zA-Z0-9_-]+\.png$/),
  caption: z.string().min(1), sha256: z.string().regex(/^[a-f0-9]{64}$/),
  width: z.number().int().positive().max(2048), height: z.number().int().positive().max(2048),
});
const packetSchema = z.object({ components: z.array(z.object({ type: z.string(),
  recipes: z.array(z.object({ id: z.string(), images: z.array(imageSchema).optional() })).optional(),
})) });
const assetRoot = fileURLToPath(new URL('../../recipe-assets/', import.meta.url));

export const getRecipeImage = async (request: {
  adapterId: string; componentType: string; recipeId: string; imageId: string; contractRevision: string;
}) => {
  const packet = await getDesignContract({ adapterId: request.adapterId, phase: 'details',
    contractRevision: request.contractRevision, componentTypes: [request.componentType], allComponents: false, guides: [] });
  const component = packetSchema.parse(packet.catalog).components[0];
  const recipe = component.recipes?.find(({ id }) => id === request.recipeId);
  const images = recipe?.images ?? [];
  if (new Set(images.map(({ id }) => id)).size !== images.length) throw new Error('Duplicate recipe image ID.');
  const image = images.find(({ id }) => id === request.imageId);
  if (!image) throw new Error('Unknown recipe image for this component.');
  if (![request.adapterId, request.componentType, request.recipeId].every((id) => /^[a-zA-Z0-9_-]+$/.test(id))) {
    throw new Error('Invalid recipe asset identity.');
  }
  try {
    const root = await realpath(assetRoot);
    const recipeRoot = path.join(root, request.adapterId, request.componentType, request.recipeId, 'screenshots');
    const file = await realpath(path.join(recipeRoot, image.file));
    if (!file.startsWith(recipeRoot + path.sep)) throw new Error('Outside recipe.');
    const handle = await open(file, 'r');
    let data: Buffer;
    try {
      const stat = await handle.stat();
      if (!stat.isFile() || stat.size > 1024 * 1024 || stat.size < 24) throw new Error('Invalid size.');
      // Bounded read even if a deployment replaces the file during this request.
      data = Buffer.alloc(stat.size + 1);
      const { bytesRead } = await handle.read(data, 0, data.length, 0);
      if (bytesRead !== stat.size) throw new Error('Changed asset.');
      data = data.subarray(0, bytesRead);
    } finally { await handle.close(); }
    if (data.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' ||
      data.toString('ascii', 12, 16) !== 'IHDR' || data.readUInt32BE(16) !== image.width ||
      data.readUInt32BE(20) !== image.height || createHash('sha256').update(data).digest('hex') !== image.sha256) {
      throw new Error('Asset does not match metadata.');
    }
    return { content: [
      { type: 'text' as const, text: JSON.stringify({ ...request, caption: image.caption,
        width: image.width, height: image.height, sha256: image.sha256,
        purpose: 'Prepared recipe reference, not a capture of the current design. Use the recipe example and registered props/slots; appearance does not prove hidden behavior.' }) },
      { type: 'image' as const, mimeType: 'image/png', data: data.toString('base64') },
    ] };
  } catch { throw new Error('Recipe image unavailable or inconsistent; rebuild the backend assets and metadata.'); }
};
