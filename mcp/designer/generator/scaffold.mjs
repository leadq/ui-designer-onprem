import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, realpath, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const GENERATOR_VERSION = '1.0.0';
const assertName = (value, expression, label) => {
  if (typeof value !== 'string' || !expression.test(value)) throw new Error(`Invalid ${label}`);
  return value;
};
const RESERVED_NAMES = new Set(['await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'null', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield']);
const assertImport = value => assertName(value, /^(?:@?[A-Za-z0-9_][A-Za-z0-9_./@-]*|\.\.?\/[A-Za-z0-9_./-]+)$/, 'import path');

// No filesystem writes here: callers can review every byte before applying.
export const buildScaffold = config => {
  if (config.version !== GENERATOR_VERSION) throw new Error('Generator version mismatch');
  const component = assertName(config.componentName, /^[A-Z][A-Za-z0-9]*$/, 'componentName');
  const page = assertName(config.pageName, /^[A-Z][A-Za-z0-9]*Page$/, 'pageName');
  if (component === page) throw new Error('Page and domain component names must be different');
  const primitive = assertName(config.primitiveName, /^[A-Z][A-Za-z0-9]*$/, 'primitiveName');
  const primitiveImport = assertImport(config.primitiveImport);
  if ([component, page, 'styles'].includes(primitive)) throw new Error('Primitive name conflicts with generated declarations');
  const styleFile = config.styleFile ?? 'styles.module.scss';
  if (!['styles.module.scss', 'style.module.scss'].includes(styleFile)) throw new Error('Unsupported styleFile');
  const rootClass = component[0].toLowerCase() + component.slice(1);
  const files = {
    [`src/pages/${page}/index.tsx`]: `import { ${component} } from '../../components/${component}';\n\nexport const ${page} = () => <${component} />;\n`,
    [`src/components/${component}/index.tsx`]: `import { ${primitive} } from '${primitiveImport}';\n\nimport styles from './${styleFile}';\n\n// DESIGNER_PLACEHOLDER: implement the design with the existing UI library.\nexport const ${component} = () => <${primitive} className={styles.${rootClass}} />;\n`,
    [`src/components/${component}/${styleFile}`]: `.${rootClass} {\n  display: flex;\n  flex-direction: column;\n}\n`,
  };
  if (config.api) {
    const api = config.api;
    const name = assertName(api.name, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/, 'api.name');
    const baseImport = assertImport(api.baseApiImport);
    const baseName = assertName(api.baseApiName, /^[a-z][A-Za-z0-9]*$/, 'api.baseApiName');
    const endpoint = assertName(api.endpointName, /^[a-z][A-Za-z0-9]*$/, 'api.endpointName');
    if (RESERVED_NAMES.has(baseName) || ['API_URL', 'ResponseData', 'featureApi'].includes(baseName)) throw new Error('Base API name conflicts with generated declarations');
    if (typeof api.url !== 'string' || !api.url.startsWith('/') || api.url.startsWith('//') || /[\r\n]/.test(api.url)) throw new Error('api.url must be a confirmed relative endpoint path');
    if (!['GET', 'POST'].includes(api.method)) throw new Error('api.method must be GET or POST');
    files[`src/apis/${name}/types.ts`] = '// DESIGNER_PLACEHOLDER: replace unknown using the confirmed service or approved demo contract.\nexport type ResponseData = unknown;\n' + (api.method === 'POST' ? 'export type RequestData = unknown;\n' : '');
    files[`src/apis/${name}/index.ts`] = `import { ${baseName} } from '${baseImport}';\n\nimport type { ResponseData${api.method === 'POST' ? ', RequestData' : ''} } from './types';\n\n// Template-local URL; move to the project constants after integration.\nconst API_URL = ${JSON.stringify(api.url)};\n\nexport const featureApi = ${baseName}.injectEndpoints({\n  endpoints: builder => ({\n    ${endpoint}: builder.${api.method === 'GET' ? 'query<ResponseData, void>({\n      query: () => API_URL,' : "mutation<ResponseData, RequestData>({\n      query: body => ({ url: API_URL, method: 'POST', body }),"}\n    }),\n  }),\n  overrideExisting: false,\n});\n`;
    files[`src/mocks/${name}.json`] = '{}\n';
  }
  const completionChecklist = Object.keys(files).map(file => ({
    file,
    status: 'pending',
    kind: file.startsWith('src/pages/') ? 'route-integration'
      : file.startsWith('src/mocks/') ? 'fixture-content-and-dev-interceptor'
        : file.startsWith('src/apis/') ? 'api-contract-and-consumption'
          : file.endsWith('.scss') ? 'layout-and-visual-check'
            : 'ui-content-and-behavior',
    instruction: file.startsWith('src/pages/') ? 'Verify the existing router/provider integration; preserve form state across steps.'
      : file.startsWith('src/mocks/') ? 'Replace the empty fixture with consistent screen data in the project format; verify dev-only interception.'
        : file.startsWith('src/apis/') ? 'Complete types and endpoint consumption from confirmed service or approved demo evidence; no invented production contract.'
          : file.endsWith('.scss') ? 'Implement hierarchy, spacing and sizing using the project rules; inspect the rendered screen.'
            : 'Replace the placeholder with all observed content and required interactions; follow the project form/stepper examples.',
  }));
  return { version: GENERATOR_VERSION, files, completionChecklist, nextSteps: [
    'Implement UI, layout and state from the validated design.',
    'Register the page using the existing router.',
    ...(config.api ? ['Replace API types/fixture with the confirmed service or approved demo contract; connect the existing DEV-ONLY URL interceptor.'] : []),
    'After implementation, read unit-tests guidance and use the existing test harness.',
  ] };
};

const assertSafeParents = async (root, relativePath) => {
  const segments = relativePath.split('/');
  let current = root;
  for (const part of segments.slice(0, -1)) {
    current = path.join(current, part);
    try {
      const stat = await lstat(current);
      if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`Unsafe parent: ${current}`);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  try { await lstat(path.join(root, relativePath)); }
  catch (error) { if (error.code === 'ENOENT') return; throw error; }
  throw new Error(`Refusing to overwrite: ${relativePath}`);
};

export const runScaffold = async (config, targetRoot, shouldWrite = false) => {
  const root = await realpath(targetRoot);
  const plan = buildScaffold(config);
  for (const file of Object.keys(plan.files)) await assertSafeParents(root, file);
  const written = [];
  try {
    if (shouldWrite) for (const [file, content] of Object.entries(plan.files)) {
      await assertSafeParents(root, file);
      await mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await writeFile(path.join(root, file), content, { flag: 'wx' });
      written.push(file);
    }
  } catch (error) {
    for (const file of written) await unlink(path.join(root, file));
    throw error;
  }
  return { ...plan, root, mode: shouldWrite ? 'written' : 'dry-run', sha256: Object.fromEntries(Object.entries(plan.files).map(([file, content]) => [file, createHash('sha256').update(content).digest('hex')])) };
};

const main = async () => {
  const args = process.argv.slice(2);
  const allowed = new Set(['--config', '--root', '--write']);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (!allowed.has(args[i]) || options[args[i]] !== undefined) throw new Error(`Unknown or repeated argument: ${args[i]}`);
    if (args[i] === '--write') options[args[i]] = true;
    else { const key = args[i]; const value = args[++i]; if (!value || value.startsWith('--')) throw new Error(`Missing ${key}`); options[key] = value; }
  }
  if (!options['--config'] || !options['--root']) throw new Error('Usage: node scaffold.mjs --config scaffold.json --root /project [--write]');
  const config = JSON.parse(await readFile(options['--config'], 'utf8'));
  console.log(JSON.stringify(await runScaffold(config, options['--root'], Boolean(options['--write'])), null, 2));
};
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
