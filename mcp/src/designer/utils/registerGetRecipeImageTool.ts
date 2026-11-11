import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { getRecipeImage } from './getRecipeImage.js';

import { readOnly } from '../constants/toolOptions.js';

export const registerGetRecipeImageTool = (server: McpServer): void => {
  server.registerTool('get_recipe_image', {
    description: 'Read ONE prepared component recipe reference as native MCP image content. First select candidates by overview names/descriptions/brief visualHints, read selected component details for visualHints and recipes, then fetch an image only if useful to distinguish native props/slots from separate siblings. Does not screenshot the editor or start a render loop. Requires the same contractRevision. No file paths/URLs accepted.',
    annotations: readOnly,
    inputSchema: { adapterId: z.string().min(1), componentType: z.string().min(1),
      recipeId: z.string().min(1), imageId: z.string().min(1), contractRevision: z.string().min(1) },
  }, async (args) => {
    try { return await getRecipeImage(args); }
    catch { return { isError: true, content: [{ type: 'text' as const,
      text: 'Recipe image could not be read. Rediscover the contract and check the selected component/recipe/image IDs and packaged assets.' }] }; }
  });
};
