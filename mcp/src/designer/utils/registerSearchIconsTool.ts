import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { readOnly } from '../constants/toolOptions.js';
import { getDesignerRuntime } from '../runtime.js';
import { getResult } from './getResult.js';

const maximumResults = 30;
const defaultResults = 20;

export const registerSearchIconsTool = (server: McpServer) => {
  server.registerTool('search_icons', {
    description: 'Look up all needed design icons in one call, e.g. queries ["navigation", "arrow up", "trash", "settings"]. Results follow input order. Each query has ranked active glyph IDs and its full match count, including zero. All words in a phrase must occur. A complete libraryId:iconId checks that active ID exactly. Results share a budget in rounds: normally 20 IDs, or one per requested query if more than 20, up to 30. Use returned IDs as props.glyph.',
    inputSchema: {
      queries: z.array(z.string().trim().min(1).max(80).regex(/[\p{L}\p{N}]/u)).min(1).max(maximumResults),
      limit: z.number().int().min(1).max(maximumResults).optional().describe('Maximum glyph IDs across all groups.'),
    },
    annotations: readOnly,
  }, ({ queries, limit }) => getResult(() => getDesignerRuntime().getIconSearchResults(queries, limit ?? Math.max(defaultResults, queries.length))));
};
