import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cp, lstat, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const designer = fileURLToPath(new URL('../', import.meta.url));
const target = path.resolve(process.argv[2] || '../mcp');
const manifest = JSON.parse(await readFile(path.join(target, 'package.json'), 'utf8'));
if (manifest.name !== 'ui-designer-mcp') throw new Error('Pass the UI Designer MCP project directory.');
const destination = path.join(target, 'generated');
const stage = await mkdtemp(path.join(target, '.export-'));
try {
  await build({
    entryPoints: [path.join(designer, 'scripts/runtime-entry.ts')],
    outfile: path.join(stage, 'designerRuntime.cjs'),
    platform: 'node', format: 'cjs', bundle: true, target: 'node20',
    loader: { '.scss': 'empty', '.css': 'empty' }, logLevel: 'warning',
  });
  // Load the same Node entry the MCP will consume before replacing a previous export.
  const { registeredAdapterIds: adapterIds } = require(path.join(stage, 'designerRuntime.cjs'));
  for (const id of adapterIds) {
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error('Invalid adapter ID: ' + id);
    const recipes = path.join(designer, 'src/adapters', id, 'recipes');
    try {
      await cp(recipes, path.join(stage, 'recipe-assets', id), {
        recursive: true, filter: async file => {
          const stat = await lstat(file);
          return stat.isDirectory() || (stat.isFile() && file.endsWith('.png'));
        },
      });
    } catch (error) { if (error.code !== 'ENOENT' || error.path !== recipes) throw error; }
  }
  await cp(path.join(designer, 'docs/contracts/README.md'), path.join(stage, 'execution-contract.md'));
  let sourceCommit = null;
  try {
    const inputs = ['src', 'package.json', 'package-lock.json', 'scripts', 'docs/contracts', 'tsconfig.json'];
    sourceCommit = execFileSync('git', ['log', '-1', '--format=%H', '--', ...inputs], {
      cwd: designer, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || null;
  } catch { /* Source archives have no Git history. */ }
  const bundle = path.join(stage, 'designerRuntime.cjs');
  const bytes = await readFile(bundle);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  await writeFile(bundle + '.gz', gzipSync(bytes));
  await rm(bundle);
  await writeFile(path.join(stage, 'export.json'), JSON.stringify({ format: 1, sourceCommit, adapterIds, sha256 }, null, 2) + '\n');
  // Only replace this generator's output, after the new export completed successfully.
  const backup = stage + '-previous';
  let replaced = false;
  try {
    const previous = JSON.parse(await readFile(path.join(destination, 'export.json'), 'utf8'));
    if (previous.format !== 1) throw new Error('Unexpected generated directory format.');
    await rename(destination, backup);
    replaced = true;
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  try {
    await rename(stage, destination);
  } catch (error) {
    if (replaced) await rename(backup, destination);
    throw error;
  }
  if (replaced) await rm(backup, { recursive: true, force: true });
  console.info('MCP export ready:', destination, adapterIds.join(', '));
} finally { await rm(stage, { recursive: true, force: true }); }
