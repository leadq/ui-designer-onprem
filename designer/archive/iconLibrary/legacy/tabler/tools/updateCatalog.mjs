import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { icons } = require('@tabler/icons-react');
const names = Object.keys(icons).filter(name => /^Icon[A-Z0-9]/.test(name)).sort();
await writeFile(new URL('../catalog.json', import.meta.url), `${JSON.stringify(names, null, 2)}\n`);
process.stdout.write(`Updated Tabler catalog: ${names.length} icons\n`);
