import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { getGuideSections } from './getGuideSections.js';
import { getResult } from './getResult.js';

import { readOnly } from '../constants/toolOptions.js';
import { assertBundleVersion, getGuideSummary, getKnowledgeBundle, getSha256 } from '../knowledge.js';

export const registerReadDesignGuideTool = (server: McpServer): void => {
  server.registerTool(
    'read_design_guide',
    {
      description:
        'Read ONE guide discovered by start_design_task. Required revision prevents silently mixing profile versions. Does not load unrelated guides.',
      annotations: readOnly,
      inputSchema: {
        id: z.string(),
        bundleRevision: z.string(),
        mode: z.enum(['content', 'outline']).default('content'),
        sectionId: z.string().regex(/^section-\d+$/).optional(),
      },
    },
    ({ id, bundleRevision, mode, sectionId }) =>
      getResult(async () => {
        const bundle = await getKnowledgeBundle();

        assertBundleVersion(bundle, undefined, bundleRevision);

        const guide = bundle.manifest.guides.find((entry) => entry.id === id);

        if (!guide) {
          throw new Error('Unknown guide ID. Use start_design_task to discover valid IDs.');
        }

        const content = bundle.contents.get(id)!.content;
        const sections = getGuideSections(content);
        const summary = {
          ...getGuideSummary(bundle, guide),
          version: bundle.manifest.version,
          bundleRevision,
        };
        if (mode === 'outline') {
          if (sectionId) throw new Error('Outline mode cannot select a section.');
          return {
            ...summary,
            mode,
            sections: sections.map(({ id: section, title, content: body }) => ({
              id: section,
              title,
              estimatedTokens: Math.ceil(body.length / 4),
            })),
            readingRule: 'Read required foundations and all sections relevant to the current screen. Section IDs are valid only for this revision. An empty outline requires a full read.',
          };
        }
        if (sectionId) {
          const section = sections.find((entry) => entry.id === sectionId);
          if (!section) throw new Error('Unknown section ID. Read the outline for this revision.');
          return {
            ...summary,
            fullGuideSha256: summary.sha256,
            sha256: getSha256(section.content),
            estimatedTokens: Math.ceil(section.content.length / 4),
            sectionId,
            title: section.title,
            content: section.content,
          };
        }
        return { ...summary, content };
      }),
  );
};
