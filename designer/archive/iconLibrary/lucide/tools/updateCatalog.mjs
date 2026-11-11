import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { icons } = require('lucide-react');
const names = Object.keys(icons).sort();
await writeFile(new URL('../catalog.json', import.meta.url), `${JSON.stringify(names, null, 2)}\n`);
process.stdout.write(`Updated Lucide catalog: ${names.length} icons\n`);
