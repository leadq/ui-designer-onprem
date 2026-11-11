import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { getResult } from './getResult.js';

import { readOnly } from '../constants/toolOptions.js';
import { assertBundleVersion, getKnowledgeBundle } from '../knowledge.js';

export const registerGetDesignerAssetTool = (server: McpServer): void => {
  server.registerTool(
    'get_designer_asset',
    {
      description:
        'Fetch a versioned artifact by ID: designer-agent, mcp-vscode, scaffold, scaffold-config. Returns exact UTF-8 content + SHA-256, suggested destination and version. Save unchanged and verify hash locally. MCP never executes scaffold; use dry-run before --write in target project.',
      annotations: readOnly,
      inputSchema: {
        id: z.enum(['designer-agent', 'mcp-vscode', 'scaffold', 'scaffold-config']),
        bundleRevision: z.string(),
      },
    },
    ({ id, bundleRevision }) =>
      getResult(async () => {
        const bundle = await getKnowledgeBundle();

        assertBundleVersion(bundle, undefined, bundleRevision);

        const asset = bundle.manifest.assets.find((entry) => entry.id === id);

        if (!asset) {
          throw new Error('Asset unavailable in this profile');
        }

        return {
          id,
          destination: asset.destination,
          version: bundle.manifest.version,
          bundleRevision,
          ...bundle.contents.get(id),
        };
      }),
  );
};
