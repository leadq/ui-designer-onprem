import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { getKnowledgeBundle } from './knowledge.js';
import { registerGetRecipeImageTool } from './utils/registerGetRecipeImageTool.js';
import { registerGetDesignContractTool } from './utils/registerGetDesignContractTool.js';
import { registerGetDesignCatalogTool } from './utils/registerGetDesignCatalogTool.js';
import { registerGetDesignerAssetTool } from './utils/registerGetDesignerAssetTool.js';
import { registerReadDesignGuideTool } from './utils/registerReadDesignGuideTool.js';
import { registerStartDesignTaskTool } from './utils/registerStartDesignTaskTool.js';
import { registerValidateDesignTool } from './utils/registerValidateDesignTool.js';

export const registerDesignerTools = async (server: McpServer): Promise<void> => {
  registerStartDesignTaskTool(server);

  registerReadDesignGuideTool(server);

  registerGetDesignCatalogTool(server);

  registerGetDesignContractTool(server);

  registerGetRecipeImageTool(server);

  registerValidateDesignTool(server);

  registerGetDesignerAssetTool(server);

  const initial = await getKnowledgeBundle();

  for (const guide of initial.manifest.guides) {
    server.registerResource(
      guide.id,
      `designer://guides/${guide.id}`,
      {
        title: guide.title,
        description: `Read on demand: ${guide.when}; ${guide.status}`,
        mimeType: 'text/markdown',
      },
      async (uri) => {
        const bundle = await getKnowledgeBundle();
        const entry = bundle.contents.get(guide.id);

        if (!entry) {
          throw new Error('Guide no longer exists; rediscover the bundle');
        }

        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'text/markdown',
              text: `Bundle ${bundle.manifest.version}; revision ${bundle.revision}\n\n${entry.content}`,
            },
          ],
        };
      },
    );
  }

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
            text: `Inspect my supplied screenshot/design. Prefer get_design_contract overview with the known adapter, then batch needed component and strategy details after understanding purpose and scale. Render only when I explicitly request visual review. For legacy discovery call start_design_task with goal ${goal ?? 'design'}, phase understand and source auto; ask Basic or Detailed if not already selected, ask once for an approximate CSS viewport or modal/card width if neither is known, then rediscover with the chosen mode, phase implement and observed patterns. For screen generation inspect requested/selected screens or all supplied/current-document screens if unspecified. In both modes recognize clear wizard structure from JSON and available images, even without arrows; read forms/wizard and project strategy for provider/stepper/next-back, excluding modal/state variants from steps. Read its required guides by revision, use the actual registry and preserve the selected theme. Do not invent project-specific rules or API behavior. Editor import is optional. Use validate_design before delivering JSON.`,
          },
        },
      ],
    }),
  );
};
