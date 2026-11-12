import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseEnv } from 'node:util';

// Only public connection settings enter the browser; never serialize process.env.
const values = {};
for (const file of ['.env', '.env.local']) {
  try { Object.assign(values, parseEnv(await readFile(file, 'utf8'))); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
Object.assign(values, process.env);
const backendWsUrl = values.DESIGNER_BACKEND_WS_URL?.trim() || '/ws';
const url = new URL(backendWsUrl, 'https://designer.invalid');
const relative = backendWsUrl.startsWith('/') && !backendWsUrl.startsWith('//');
if ((!relative && !['ws:', 'wss:'].includes(url.protocol)) || url.username || url.password || url.search || url.hash || backendWsUrl.includes('\\')) {
  throw new Error('DESIGNER_BACKEND_WS_URL must be an absolute /path or ws(s)://host/path without credentials, query or hash.');
}
const output = path.resolve(process.argv[2] || 'share/designer-config.json');
await mkdir(path.dirname(output), { recursive: true });
const temporary = `${output}.${process.pid}.tmp`;
await writeFile(temporary, JSON.stringify({ backendWsUrl }, null, 2) + '\n');
await rename(temporary, output);
console.info(`Designer connection configuration written to ${output}`);
