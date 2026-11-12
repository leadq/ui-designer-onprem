import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';

const id = z.string().regex(/^[a-z][a-z0-9-]*$/);
const ruleMetadata = z.object({
  id: id.optional(), title: z.string().min(1).optional(), summary: z.string().min(1).optional(),
  when: id.optional(), status: z.enum(['ready', 'needs-project-input']).optional(),
  targets: z.array(z.enum(['design', 'react'])).min(1).optional(),
  sources: z.array(z.enum(['image', 'prompt', 'editor'])).min(1).optional(),
  phases: z.array(z.enum(['understand', 'implement', 'verify'])).min(1).optional(),
  modes: z.array(z.enum(['basic', 'detailed'])).min(1).optional(),
}).strict();

const folders = ['shared', 'designer', 'codegen', 'patterns', 'architecture'];

// A rule carries its own optional metadata; adding a Markdown file needs no registry edit.
export const readPromptFiles = async (root: string) => {
  const paths: string[] = [];
  const walk = async (directory: string): Promise<void> => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) throw new Error(`Prompt symlinks are not supported: ${entry.name}`);
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') paths.push(file);
    }
  };
  if ((await lstat(root)).isSymbolicLink()) throw new Error('Prompt root must not be a symlink.');
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (entry.name === 'README.md') continue;
    if (!folders.includes(entry.name) || !entry.isDirectory()) {
      throw new Error(`Unknown prompt entry ${entry.name}; use ${folders.join(', ')} (see prompts/README.md).`);
    }
    await walk(path.join(root, entry.name));
  }
  return Promise.all(paths.sort().map(async file => {
    const raw = await readFile(file, 'utf8');
    const match = raw.match(/^<!-- rule\s*\n([\s\S]*?)\n-->\s*/);
    if (raw.startsWith('<!-- rule') && !match) throw new Error(`Invalid rule header: ${file}`);
    let metadata: z.infer<typeof ruleMetadata>;
    try { metadata = ruleMetadata.parse(match ? JSON.parse(match[1]) : {}); }
    catch (cause) { throw new Error(`Invalid rule metadata: ${file}`, { cause }); }
    const content = raw.slice(match?.[0].length ?? 0).trim();
    if (!content) throw new Error(`Empty prompt: ${file}`);
    const relative = path.relative(root, file).split(path.sep).join('/');
    const [folder, pattern] = relative.split('/');
    if (folder === 'patterns' && !relative.includes('/', relative.indexOf('/') + 1) && !metadata.when) {
      throw new Error(`Pattern rules need a topic directory or when metadata: ${relative}`);
    }
    const ruleId = metadata.id ?? relative.replace(/\.md$/, '').replaceAll('/', '-');
    id.parse(ruleId);
    const targets: ('design' | 'react')[] = folder === 'designer' ? ['design']
      : (['codegen', 'architecture'].includes(folder) || (folder === 'patterns' && path.basename(file) === 'code.md')) ? ['react'] : ['design', 'react'];
    if (metadata.targets?.some(target => !targets.includes(target))) {
      throw new Error(`Rule target conflicts with its folder: ${relative}`);
    }
    return {
      guide: {
        ...metadata, id: ruleId, file: relative,
        title: metadata.title ?? content.match(/^# (.+)$/m)?.[1] ?? ruleId,
        when: metadata.when ?? (folder === 'patterns' ? pattern : 'always'),
        status: metadata.status ?? 'ready' as const,
        targets: metadata.targets ?? targets,
        phases: metadata.phases ?? (folder === 'shared' ? ['understand', 'implement', 'verify'] as const : ['implement'] as const),
        origin: 'prompt' as const,
      },
      content,
    };
  }));
};
