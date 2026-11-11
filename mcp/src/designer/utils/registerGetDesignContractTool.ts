import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { getDesignContract } from './getDesignContract.js';
import { getResult } from './getResult.js';

import { readOnly } from '../constants/toolOptions.js';

export const registerGetDesignContractTool = (server: McpServer): void => {
  server.registerTool('get_design_contract', {
    description: 'Preferred JSON-first entry for prompt/image → Designer and Designer JSON → React. overview returns shared field meanings, live adapter component names/short descriptions/brief visualHints and a strategy/guide index WITHOUT recipe indices, recipe bodies or strategy bodies. After understanding purpose and scale, details batches only selected component visualHints/recipes/props/defaults/slots/native mappings and guides/sections. No editor, import, screenshot or render. Reuse the same contractRevision; allComponents is explicit opt-in.',
    annotations: readOnly,
    inputSchema: {
      adapterId: z.string().min(1),
      phase: z.enum(['overview', 'details']).default('overview'),
      contractRevision: z.string().optional(),
      componentTypes: z.array(z.string().min(1)).min(1).max(100).optional(),
      allComponents: z.boolean().default(false),
      guides: z.array(z.object({
        id: z.string().min(1),
        sectionIds: z.array(z.string().regex(/^section-\d+$/)).min(1).max(30).optional(),
      })).max(12).default([]),
    },
  }, (args) => getResult(() => getDesignContract(args)));
};
