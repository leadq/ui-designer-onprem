import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { readOnly } from '../constants/toolOptions.js';
import { getDesignerRuntime } from '../runtime.js';
import { getResult } from './getResult.js';

export const registerSearchIconsTool = (server: McpServer) => {
  server.registerTool('search_icons', {
    description: 'Search the active design icon library by 1–3 alternative names or keyword phrases for one intent (e.g. "navigation", "map pin", "route"). Returns ranked, unique glyph IDs and the total match count. Exact names come first. Use a returned ID as props.glyph. No browser or images required.',
    inputSchema: {
      queries: z.array(z.string().trim().min(1).max(80).regex(/[\p{L}\p{N}]/u)).min(1).max(3),
      limit: z.number().int().min(1).max(30).default(20),
    },
    annotations: readOnly,
  }, ({ queries, limit }) => getResult(() => getDesignerRuntime().getIconSearchResults(queries, limit)));
};
