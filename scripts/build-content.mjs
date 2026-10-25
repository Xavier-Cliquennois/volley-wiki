// Publishes the wiki content for the mobile app: writes
// `<outDir>/content/v1/fr.json` and `en.json` (contract v1, owned by the app
// repository, see scripts/content/validate-contract.mjs) and fails when a
// document breaks the contract. Run after `vite build` (`pnpm build`).
//
// Usage: node scripts/build-content.mjs [outDir]   (default: dist)
//
// Plain JavaScript on purpose: the Docker build runs Node 20, which cannot
// load TypeScript itself. Vite's runner loads the TypeScript exporter.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { runnerImport } from 'vite';
import { validateInput } from './content/validate-contract.mjs';

const MAX_BYTES = 1024 * 1024;
const outDir = path.resolve(process.argv[2] ?? 'dist', 'content', 'v1');

const { module } = await runnerImport('./scripts/content/export.ts');
const now = new Date();
let failed = false;

mkdirSync(outDir, { recursive: true });
for (const lang of module.LANGS) {
  const doc = module.buildDocument(lang, now);
  const json = JSON.stringify(doc);
  const bytes = Buffer.byteLength(json, 'utf8');
  const errors = validateInput(doc);
  if (bytes > MAX_BYTES) errors.push(`${lang}: ${bytes} bytes, max ${MAX_BYTES}`);
  if (errors.length > 0) {
    failed = true;
    console.error(`content ${lang}: ${errors.length} contract error(s)`);
    for (const e of errors) console.error(`  - ${e}`);
    continue;
  }
  writeFileSync(path.join(outDir, `${lang}.json`), json);
  console.log(`content ${lang}: ${doc.contentVersion}, ${bytes} bytes, untranslated [${doc.untranslated.join(', ')}]`);
}

if (failed) {
  console.error('content: publication refused, fix the texts in the site sources');
  process.exit(1);
}
