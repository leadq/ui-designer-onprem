import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { getResult } from './getResult.js';

import { MAX_REQUESTED_COMPONENT_TYPES, readOnly } from '../constants/toolOptions.js';
import { getDesignerRuntime } from '../runtime.js';

export const registerGetDesignCatalogTool = (server: McpServer): void => {
  server.registerTool(
    'get_design_catalog',
    {
      description:
        'Actual UI adapter registry, independent of an active browser. Without adapterId: libraries. With adapterId: component names/short descriptions/brief visualHints without recipe indices or recipe bodies. With componentTypes: only those components including visualHints/recipes/props/defaults/slots/preview bindings/native export names and authoring guidance. Reports layout inheritance, initialization and unsupported-feature policy. list_components instead lists nodes already in a design.',
      annotations: readOnly,
      inputSchema: {
        adapterId: z.string().optional(),
        componentTypes: z.array(z.string()).min(1).max(MAX_REQUESTED_COMPONENT_TYPES).optional(),
      },
    },
    ({ adapterId, componentTypes }) =>
      getResult(() => {
        if (componentTypes && !adapterId) {
          throw new Error('adapterId is required when requesting componentTypes');
        }

        return getDesignerRuntime().getDesignCatalog(adapterId, componentTypes);
      }),
  );
};
