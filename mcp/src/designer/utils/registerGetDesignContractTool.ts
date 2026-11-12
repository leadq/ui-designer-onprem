import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { getDesignContract } from './getDesignContract.js';
import { getResult } from './getResult.js';

import { readOnly } from '../constants/toolOptions.js';

export const registerGetDesignContractTool = (server: McpServer): void => {
  server.registerTool('get_design_contract', {
    description: 'Entry for prompt/image → Designer or direct React, and Designer → React. Set goal/source/mode and observed patterns; required guidance bodies are included automatically. taskPhase=verify delivers completion rules. Discover newly added pattern names in guideIndex; there is no fixed pattern enum. overview returns shared field meanings, live adapter component summaries and a strategy/guide index WITHOUT loading strategy bodies. After understanding purpose and scale, details batches only selected component props/defaults/slots/native mappings and guides/sections. No editor, import, screenshot or render. Reuse the same contractRevision; allComponents is explicit opt-in.',
    annotations: readOnly,
    inputSchema: {
      adapterId: z.string().min(1),
    goal: z.enum(['design', 'react']).default('design'),
    source: z.enum(['auto', 'prompt', 'image', 'editor']).default('auto'),
    mode: z.enum(['basic', 'detailed']).optional(),
    taskPhase: z.enum(['understand', 'implement', 'verify']).optional(),
    patterns: z.array(z.string().regex(/^[a-z][a-z0-9-]*$/)).max(30).default([]),
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
