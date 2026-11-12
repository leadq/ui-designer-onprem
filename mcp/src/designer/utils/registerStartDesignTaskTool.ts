import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { getDesignTaskPlan } from './getDesignTaskPlan.js';
import { getTaskGuidance } from '../taskGuidance.js';
import { getResult } from './getResult.js';

import { MAX_STARTER_PATTERNS, patternSchema, readOnly } from '../constants/toolOptions.js';
import { assertBundleVersion, getGuideSummary, getKnowledgeBundle } from '../knowledge.js';

export const registerStartDesignTaskTool = (server: McpServer): void => {
  server.registerTool(
    'start_design_task',
    {
      description:
        'Legacy progressive discovery for prompt/screenshot/design → JSON or React. Prefer get_design_contract for a batched contract-first path. Returns a guide index, ordered next steps and applicable required guidance bodies. Discover first, read only required guides using the returned bundleRevision. No browser session needed.',
      annotations: readOnly,
      inputSchema: {
        goal: z.enum(['design', 'react']),
        mode: z.enum(['basic', 'detailed']).optional(),
        phase: z.enum(['understand', 'implement']).default('implement'),
        source: z.enum(['auto', 'editor', 'image', 'prompt']).default('auto'),
        patterns: z.array(z.string().regex(/^[a-z][a-z0-9-]*$/)).max(MAX_STARTER_PATTERNS).default([]),
        expectedVersion: z.string().optional(),
      },
    },
    ({ goal, patterns, expectedVersion, phase, source, mode }) =>
      getResult(async () => {
        const bundle = await getKnowledgeBundle();

        assertBundleVersion(bundle, expectedVersion);

        const effectivePhase = mode ? phase : 'understand';
        const { needsEditor, steps } = getDesignTaskPlan({
          goal, patterns, phase: effectivePhase, source, mode,
        });
        const guidance = getTaskGuidance(bundle, { goal, source, mode, phase: effectivePhase, patterns });
        const requiredGuides = bundle.manifest.guides.filter(guide => guidance.required.some(required => required.id === guide.id));
        const requiredIds = new Set(requiredGuides.map((guide) => guide.id));

        return {
          guidance,
          version: bundle.manifest.version,
          profile: bundle.manifest.profile,
          phase: effectivePhase,
          requestedPhase: phase,
          mode: mode ?? null,
          requiresModeSelection: !mode,
          questionPolicy: {
            maxTotalQuestions: mode === 'detailed' ? 10 : 3,
            targetQuestions: mode === 'detailed' ? 5 : null,
            includesCommonQuestions: true,
            sourceWidth: 'Ask once when neither CSS viewport nor card/modal reference width is known; image dimensions alone are not CSS evidence.',
          },
          source,
          screenScope: {
            default: 'all-current-document-frames-or-supplied-images',
            explicitSelection: 'requested-screens-only',
            documentRead: 'full-document-not-filtered-package',
            selectedElementEdit: 'requested-element-only',
            grouping: 'explicit-relations-then-visual-evidence-and-project-strategy',
          },
          editorContext: needsEditor
            ? 'required'
            : source === 'auto'
              ? 'conditional'
              : 'optional-for-editor-output',
          patternOptions: [...new Set([...patternSchema.options, ...bundle.manifest.guides.filter(guide => guide.origin === 'prompt' && guide.file.startsWith('patterns/')).map(guide => guide.when)])],
          bundleRevision: bundle.revision,
          requiredGuides: requiredGuides.map((guide) => getGuideSummary(bundle, guide)),
          laterGuides:
            goal === 'react' && effectivePhase === 'implement'
              ? bundle.manifest.guides
                  .filter((guide) => guide.when === 'after-implementation')
                  .map((guide) => getGuideSummary(bundle, guide))
              : [],
          otherGuides: bundle.manifest.guides
            .filter((guide) => !requiredIds.has(guide.id) && guide.when !== 'after-implementation')
            .map((guide) => getGuideSummary(bundle, guide)),
          steps,
          visualReview: { default: 'none', activation: 'explicit-user-request' },
          capabilities: {
            contract: 'get_design_contract',
            editorContext: 'get_editor_context',
            catalog: true,
            validation: true,
            scaffoldDownload: true,
            referenceImages: true,
            editorImport: 'append-with-browser-ack',
            editorUpdate: 'node-merge-patch-with-browser-ack',
            screenshotAnalysis: 'IDE agent',
            frameRender: 'render_design_frame',
            renderConfigured: Boolean(process.env.DESIGNER_RENDER_URL),
            targetFilesystemWrites: false,
          },
        };
      }),
  );
};
