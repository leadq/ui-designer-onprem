import { copyFile, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rename, rm, chmod } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const { values } = parseArgs({ options: {
  from: { type: 'string' }, output: { type: 'string' }, check: { type: 'boolean', default: false },
  help: { type: 'boolean', default: false },
} });
if (values.help) {
  console.log('Yeni ZIP kökünde: node scripts/update.mjs --from /eski/proje --check\nHazırla: node scripts/update.mjs --from /eski/proje --output /yeni/hazir-proje');
  process.exit(0);
}

const inside = (file, directory) => file === directory || file.startsWith(directory + '/');
const generated = new Set(['.git', 'node_modules', 'build', 'dist', 'coverage', '.cache', '.turbo', 'playwright-report', 'test-results', '.DS_Store']);
const skip = file => file.split('/').some(part => generated.has(part)) || inside(file, 'mcp/generated') || inside(file, 'designer/work/test-runs')
  || ['designer/share/designer-config.json', 'designer/public/designer-config.json', 'mcp/designer/contracts/execution-contract.md'].includes(file);
const exists = async file => { try { await lstat(file); return true; } catch (error) { if (error.code === 'ENOENT') return false; throw error; } };
const scan = async (root, directory = '') => {
  const files = new Map();
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    const file = directory ? `${directory}/${entry.name}` : entry.name;
    if (skip(file)) continue;
    if (entry.isSymbolicLink()) throw new Error(`Symlink taşınmaz: ${file}`);
    if (entry.isDirectory()) {
      for (const [name, info] of await scan(root, file)) files.set(name, info);
    } else if (entry.isFile()) files.set(file, await lstat(path.join(root, file)));
    else throw new Error(`Normal dosya değil: ${file}`);
  }
  return files;
};
const projectRoots = ['', 'designer/', 'mcp/'];
const mutableTrees = ['designer/src/adapters', 'mcp/prompts'];
const configTrees = ['config', 'deploy', 'deployment', 'k8s', 'helm', '.azure-pipelines', '.github/workflows', '.github/actions', '.circleci', '.vscode', 'share', 'public'];
const configFile = name => /^(package\.json|package-lock\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|\.npmrc|\.yarnrc(?:\.yml)?|\.gitignore|\.dockerignore|\.editorconfig|update\.paths\.json)$/.test(name)
  || /^\.env(?:\..+)?$/.test(name) || /^(?:Dockerfile|Containerfile)(?:\..+)?$/.test(name)
  || /(?:^\.?[^/]*config(?:\.[^/]+)?|^\.(?:eslint|prettier|stylelint)rc(?:\.[^/]+)?)$/.test(name)
  || /\.(?:yaml|yml)$/.test(name);
const normal = file => mutableTrees.some(tree => inside(file, tree)) || projectRoots.some(prefix => {
  if (!file.startsWith(prefix)) return false;
  const relative = file.slice(prefix.length);
  return (!relative.includes('/') && configFile(relative)) || configTrees.some(tree => inside(relative, tree));
});
const protectedPath = file => (inside(file, 'designer/src') && !inside(file, 'designer/src/adapters'))
  || inside(file, 'mcp/src') || inside(file, 'mcp/designer') || skip(file);
const safeExtra = file => typeof file === 'string' && file.length > 0 && !path.isAbsolute(file)
  && !file.includes('\\') && file.split('/').every(part => part && part !== '.' && part !== '..');
const json = async (root, file) => {
  let value;
  try { value = JSON.parse(await readFile(path.join(root, file), 'utf8')); }
  catch { throw new Error(`JSON okunamadı: ${file}`); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`JSON nesnesi bekleniyor: ${file}`);
  return value;
};

let stage;
try {
  if (!values.from) throw new Error('--from /eski/proje gerekli. --help ile kullanımı görün.');
  const release = await realpath(fileURLToPath(new URL('../', import.meta.url)));
  const source = await realpath(values.from);
  const nested = (a, b) => a === b || a.startsWith(b + path.sep);
  if (nested(source, release) || nested(release, source)) throw new Error('Eski proje ile yeni ZIP ayrı klasörlerde olmalı.');
  for (const root of [source, release]) for (const project of ['designer', 'mcp']) {
    await json(root, `${project}/package.json`);
  }
  const previous = await scan(source);
  const next = await scan(release);
  const extraConfig = previous.has('update.paths.json') ? await json(source, 'update.paths.json') : { include: [] };
  if (Object.keys(extraConfig).some(key => key !== 'include') || !Array.isArray(extraConfig.include) || !extraConfig.include.every(safeExtra)) {
    throw new Error('update.paths.json yalnız {"include":["göreli/yol"]} biçiminde olmalı.');
  }
  for (const prefix of extraConfig.include) {
    const matches = [...previous.keys()].filter(file => inside(file, prefix));
    if (!matches.length || protectedPath(prefix) || matches.some(file => protectedPath(file) || (next.has(file) && !normal(file)))) {
      throw new Error(`Ek taşıma yolu yok, üretilmiş veya ürün dosyasını ezebilir: ${prefix}`);
    }
  }
  const carry = [...previous.keys()].filter(file => file !== 'mcp/prompts/README.md' && (normal(file) || extraConfig.include.some(prefix => inside(file, prefix)))).sort();
  const selected = new Set(carry);
  // Unknown top-level config must be named explicitly; old product source is never inferred as customization.
  const productTrees = ['src', 'docs', 'archive', 'installation', 'tests', 'work', '.ai', '.agents', '.github', 'designer', 'mcp'];
  const unassigned = [...previous.keys()].filter(file => !selected.has(file) && !next.has(file) && !protectedPath(file) && projectRoots.some(prefix => {
    if (!file.startsWith(prefix)) return false;
    const relative = file.slice(prefix.length);
    return !relative.endsWith('.md') && !productTrees.some(tree => inside(relative, tree));
  })).sort();
  const packageChanges = [];
  for (const project of ['designer', 'mcp']) {
    const file = `${project}/package.json`;
    const before = await json(source, file);
    const after = await json(release, file);
    for (const section of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies', 'overrides', 'resolutions', 'engines']) {
      for (const [name, requirement] of Object.entries(after[section] || {})) {
        if (/__[A-Z][A-Z0-9_]*__/.test(name + JSON.stringify(requirement))) continue;
        if (JSON.stringify(before[section]?.[name]) !== JSON.stringify(requirement)) packageChanges.push(`${file}: ${section}.${name}`);
      }
    }
    for (const field of ['type', 'packageManager']) if (after[field] !== undefined && before[field] !== after[field]) packageChanges.push(`${file}: ${field}`);
    const scripts = ['predev', 'postdev', 'prebuild', 'postbuild', 'prestart', 'poststart', 'prepare', 'postinstall', ...(project === 'designer' ? ['configure', 'export:mcp'] : ['build', 'start', 'start:backend'])];
    for (const name of scripts) if (after.scripts?.[name] !== undefined && before.scripts?.[name] !== after.scripts[name]) {
      packageChanges.push(`${file}: scripts.${name}`);
    }
  }
  const promptDifferences = [];
  for (const file of new Set([...previous.keys(), ...next.keys()])) {
    if (!inside(file, 'mcp/prompts') || file === 'mcp/prompts/README.md') continue;
    if (!previous.has(file) || !next.has(file) || !(await readFile(path.join(source, file))).equals(await readFile(path.join(release, file)))) promptDifferences.push(file);
  }
  const output = values.output && path.resolve(values.output);
  let destination, parent;
  if (output) {
    parent = await realpath(path.dirname(output));
    destination = path.join(parent, path.basename(output));
    if (nested(destination, source) || nested(source, destination) || nested(destination, release) || nested(release, destination)) {
      throw new Error('Çıktı eski proje ve yeni ZIP dışında yeni bir klasör olmalı.');
    }
    if (await exists(destination)) throw new Error('Çıktı klasörü zaten var; mevcut proje ezilmez.');
  }
  const report = { mode: values.check || !values.output ? 'check' : 'prepare', from: source, release,
    output: values.output ? path.resolve(values.output) : null, carry, promptDifferences: promptDifferences.sort(), packageChanges, unassigned };
  console.log(JSON.stringify(report, null, 2));
  if (packageChanges.length || unassigned.length) throw new Error('Hazırlama durduruldu. Paket gereksinimlerini uzlaştırın; ek config/deployment yollarını update.paths.json include listesine ekleyin. Hiçbir proje değiştirilmedi.');
  if (values.check || !values.output) process.exit(0);
  // Build a complete sibling directory before publishing it. Both inputs remain untouched.
  stage = await mkdtemp(path.join(parent, '.designer-update-'));
  const assembled = new Map([...next.keys()].map(file => [file, release]));
  for (const tree of mutableTrees) {
    for (const file of assembled.keys()) if (inside(file, tree)) assembled.delete(file);
  }
  for (const project of ['designer', 'mcp']) for (const lock of ['package-lock.json', 'npm-shrinkwrap.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lock', 'bun.lockb']) assembled.delete(`${project}/${lock}`);
  for (const file of carry) assembled.set(file, source);
  // Usage documentation follows the new product; executable prompt rules retain the team's complete set.
  if (next.has('mcp/prompts/README.md')) assembled.set('mcp/prompts/README.md', release);
  for (const [file, root] of assembled) {
    const info = await lstat(path.join(root, file));
    if (!info.isFile() || info.isSymbolicLink()) throw new Error(`Taşıma sırasında dosya türü değişti: ${file}`);
    const target = path.join(stage, file);
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(path.join(root, file), target);
    await chmod(target, info.mode & 0o777);
  }
  if (await exists(destination)) throw new Error('Çıktı klasörü işlem sırasında oluşturuldu; üzerine yazılmadı.');
  await rename(stage, destination);
  stage = undefined;
  console.log('Hazırlandı. Paketleri yeniden kurun; Designer configure/build, MCP export/build ve bağlantı kabulünü tamamlayın.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (stage) await rm(stage, { recursive: true, force: true });
}
