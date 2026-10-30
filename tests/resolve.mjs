// Lets `node --test` run the TypeScript sources directly (Node 22.18+ strips types): resolves the `@/` alias,
// extensionless relative imports, `next/server` (a CommonJS file without an exports map), and the `server-only`
// marker package, which only matters inside Next.
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src');
const EMPTY = 'data:text/javascript,export{}';

export async function resolve(specifier, context, next) {
  if (specifier === 'server-only') return { url: EMPTY, shortCircuit: true };
  if (specifier === 'next/server') return next('next/server.js', context);
  let target = null;
  if (specifier.startsWith('@/')) target = path.join(SRC, specifier.slice(2));
  else if (specifier.startsWith('.') && context.parentURL?.startsWith('file:') && !path.extname(specifier)) {
    target = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
  }
  if (target) {
    for (const candidate of [`${target}.ts`, `${target}.tsx`, path.join(target, 'index.ts')]) {
      if (existsSync(candidate)) return next(pathToFileURL(candidate).href, context);
    }
  }
  return next(specifier, context);
}
