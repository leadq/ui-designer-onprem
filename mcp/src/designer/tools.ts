import { ResourceTemplate, type McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { getKnowledgeBundle } from './knowledge.js';
import { registerGetRecipeImageTool } from './utils/registerGetRecipeImageTool.js';
import { registerGetDesignContractTool } from './utils/registerGetDesignContractTool.js';
import { registerGetDesignCatalogTool } from './utils/registerGetDesignCatalogTool.js';
import { registerGetDesignerAssetTool } from './utils/registerGetDesignerAssetTool.js';
import { registerReadDesignGuideTool } from './utils/registerReadDesignGuideTool.js';
import { registerSearchIconsTool } from './utils/registerSearchIconsTool.js';
import { registerStartDesignTaskTool } from './utils/registerStartDesignTaskTool.js';
import { registerValidateDesignTool } from './utils/registerValidateDesignTool.js';

export const registerDesignerTools = async (server: McpServer): Promise<void> => {
  registerStartDesignTaskTool(server);

  registerReadDesignGuideTool(server);
  registerSearchIconsTool(server);

  registerGetDesignCatalogTool(server);

  registerGetDesignContractTool(server);

  registerGetRecipeImageTool(server);

  registerValidateDesignTool(server);

  registerGetDesignerAssetTool(server);

  // Validate the bundle at startup; list/read also discover rules added without restarting.
  await getKnowledgeBundle();
  server.registerResource('design-guides', new ResourceTemplate('designer://guides/{id}', {
    list: async () => {
      const bundle = await getKnowledgeBundle();
      return { resources: bundle.manifest.guides.map(guide => ({
        uri: `designer://guides/${guide.id}`, name: guide.id, title: guide.title,
        description: `Read on demand: ${guide.when}; ${guide.status}`, mimeType: 'text/markdown',
      })) };
    },
  }), { mimeType: 'text/markdown' }, async (uri, { id }) => {
    const bundle = await getKnowledgeBundle();
    const entry = typeof id === 'string' && bundle.manifest.guides.some(guide => guide.id === id)
      ? bundle.contents.get(id) : undefined;
    if (!entry) throw new Error('Guide no longer exists; rediscover the bundle');
    return { contents: [{ uri: uri.href, mimeType: 'text/markdown',
      text: `Bundle ${bundle.manifest.version}; revision ${bundle.revision}\n\n${entry.content}` }] };
  });

  server.registerPrompt(
    'design_from_image',
    {
      description: 'Start a semantic screenshot-to-design task with on-demand guidance.',
      argsSchema: { goal: z.enum(['design', 'react']).optional() },
    },
    ({ goal }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Use the supplied image as source=image and goal=${goal ?? 'design'}. Discover the actual adapter, then call get_design_contract overview with goal/source/mode. Apply guidance.required; after understanding, request details with selected componentTypes and all relevant patterns. For direct React, Designer import/JSON is optional. Before completion request taskPhase=verify. start_design_task remains the alternative discovery entry.`,
          },
        },
      ],
    }),
  );
};
