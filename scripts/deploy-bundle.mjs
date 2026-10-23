// Prints the JSON `files` array for a Vercel create_deployment call.
// Used when Git auto-deploy is not connected. Usage: node scripts/deploy-bundle.mjs > /tmp/files.json
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const include = ['app', 'components', 'lib', 'content', 'public', 'package.json', 'tsconfig.json', 'next.config.mjs'];
const binary = /\.(png|jpe?g|gif|webp|ico|woff2?)$/i;
const files = [];

function walk(p) {
  if (statSync(p).isDirectory()) return readdirSync(p).forEach((f) => walk(join(p, f)));
  const file = relative(root, p);
  files.push(binary.test(file)
    ? { file, data: readFileSync(p).toString('base64'), encoding: 'base64' }
    : { file, data: readFileSync(p, 'utf8'), encoding: 'utf-8' });
}

include.forEach((p) => walk(join(root, p)));
process.stdout.write(JSON.stringify(files));
