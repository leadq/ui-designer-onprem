import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

import { readPromptFiles } from './promptFiles.js';

const ESTIMATED_CHARACTERS_PER_TOKEN = 4;

const bundleRoot = path.resolve(fileURLToPath(new URL('../../designer/', import.meta.url)));
const entrySchema = z.object({ id: z.string().regex(/^[a-z][a-z0-9-]*$/), file: z.string() });

const manifestSchema = z.object({
  version: z.string(),
  profile: z.string(),
  guides: z.array(
    entrySchema.extend({
      title: z.string(),
      summary: z.string().optional(),
      when: z.string(),
      status: z.enum(['ready', 'needs-project-input']),
      targets: z.array(z.enum(['design', 'react'])).optional(),
      phases: z.array(z.enum(['understand', 'implement', 'verify'])).optional(),
      sources: z.array(z.enum(['prompt', 'image', 'editor'])).optional(),
      modes: z.array(z.enum(['basic', 'detailed'])).optional(),
      origin: z.enum(['contract', 'prompt']).optional(),
    }),
  ),
  assets: z.array(entrySchema.extend({ destination: z.string() })),
});

export type GuideEntry = z.infer<typeof manifestSchema>['guides'][number];
export interface BundleContent {
  content: string;
  sha256: string;
}
export const getSha256 = (value: string): string =>
  createHash('sha256').update(value).digest('hex');

// Filenames are maintained by the server owner, never supplied by an MCP caller.
export const getKnowledgeBundle = async () => {
  if (process.env.DESIGNER_PROFILE_DIR) {
    throw new Error('DESIGNER_PROFILE_DIR is retired: move editable Markdown into prompts/ and use DESIGNER_PROMPTS_DIR. Technical contracts stay in designer/contracts; see prompts/README.md.');
  }
  const root = bundleRoot;

  const manifestText = await readFile(path.join(root, 'manifest.json'), 'utf8');
  const manifest = manifestSchema.parse(JSON.parse(manifestText));
  const ids = [...manifest.guides, ...manifest.assets].map((entry) => entry.id);

  if (new Set(ids).size !== ids.length) {
    throw new Error('Duplicate guide/asset ID in bundle');
  }

  const files = [...manifest.guides, ...manifest.assets].map((entry) => {
    const file = path.resolve(root, entry.file);
    if (!file.startsWith(`${root}${path.sep}`)) {
      throw new Error(`Bundle path escapes root: ${entry.id}`);
    }

    return { id: entry.id, file };
  });

  // Promise.all preserves manifest order even when reads complete out of order.
  const entries = await Promise.all(
    files.map(async ({ id, file }) => {
      const content = await readFile(file, 'utf8');

      return [id, { content, sha256: getSha256(content) }] as const;
    }),
  );

  const promptRoot = process.env.DESIGNER_PROMPTS_DIR
    ? path.resolve(process.env.DESIGNER_PROMPTS_DIR)
    : path.resolve(bundleRoot, '../prompts');
  const rules = await readPromptFiles(promptRoot);
  for (const rule of rules) {
    if (ids.includes(rule.guide.id)) throw new Error(`Reserved or duplicate guide/asset ID: ${rule.guide.id}`);
    ids.push(rule.guide.id);
    manifest.guides.push(manifestSchema.shape.guides.element.parse(rule.guide));
    entries.push([rule.guide.id, { content: rule.content, sha256: getSha256(rule.content) }]);
  }
  const contents = new Map<string, BundleContent>(entries);

  const revision = getSha256(
    manifestText + [...contents].map(([id, entry]) => `${id}:${entry.sha256}`).join('\n')
      + (rules.length ? JSON.stringify(rules.map(rule => rule.guide)) : ''),
  );

  return { manifest, contents, revision };
};

export type KnowledgeBundle = Awaited<ReturnType<typeof getKnowledgeBundle>>;

export const assertBundleVersion = (
  bundle: KnowledgeBundle,
  expectedVersion?: string,
  expectedRevision?: string,
): void => {
  if (expectedVersion && expectedVersion !== bundle.manifest.version) {
    throw new Error('Bundle version mismatch; update the agent/profile together.');
  }

  if (expectedRevision && expectedRevision !== bundle.revision) {
    throw new Error(
      'Bundle revision changed; rediscover and reread the required guides before continuing.',
    );
  }
};

export const getGuideSummary = (bundle: KnowledgeBundle, guide: GuideEntry) => ({
  id: guide.id,
  title: guide.title,
  origin: guide.origin ?? 'contract',
  targets: guide.targets,
  phases: guide.phases,
  sources: guide.sources,
  modes: guide.modes,
  summary: guide.summary,
  when: guide.when,
  status: guide.status,
  uri: `designer://guides/${guide.id}`,
  sha256: bundle.contents.get(guide.id)!.sha256,
  readingMode: guide.id === 'execution-contract' ? 'outline-then-sections' : 'full',
  estimatedTokens: Math.ceil(
    bundle.contents.get(guide.id)!.content.length / ESTIMATED_CHARACTERS_PER_TOKEN,
  ),
});
