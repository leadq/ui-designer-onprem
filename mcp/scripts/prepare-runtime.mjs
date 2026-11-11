import { cp, readFile, rm, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const source = new URL('../generated/', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
let metadata;
try { metadata = JSON.parse(await readFile(new URL('export.json', source), 'utf8')); }
catch (cause) { throw new Error('Export the configured Designer first: npm run export:mcp -- /path/to/mcp', { cause }); }
const runtime = gunzipSync(await readFile(new URL('designerRuntime.cjs.gz', source)));
if (metadata.format !== 1 || createHash('sha256').update(runtime).digest('hex') !== metadata.sha256)
  throw new Error('Incomplete Designer export. Generate it again.');
await writeFile(new URL('designerRuntime.cjs', dist), runtime);
const recipes = new URL('recipe-assets', dist);
await rm(recipes, { recursive: true, force: true });
try { await cp(new URL('recipe-assets', source), recipes, { recursive: true }); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
await cp(new URL('execution-contract.md', source), new URL('../designer/guides/execution-contract.md', import.meta.url));
