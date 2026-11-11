import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { getResult } from './getResult.js';

import { readOnly } from '../constants/toolOptions.js';
import { getDesignerRuntime } from '../runtime.js';

export const registerValidateDesignTool = (server: McpServer): void => {
  server.registerTool(
    'validate_design',
    {
      description:
        'Validate nested or flat JSON through the SAME parser/flow manifest used by the editor, plus registry and theme/layout checks for generated designs. Read contract first. Does not import or render. Return normalized JSON only when output requests it to save context.',
      annotations: readOnly,
      inputSchema: {
        document: z.unknown(),
        output: z.enum(['summary', 'nested', 'flat']).default('summary'),
      },
    },
    ({ document, output }) =>
      getResult(() => getDesignerRuntime().validateDesign(document, output)),
  );
};
