import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaBuilderPath = path.resolve(
  __dirname,
  '../src/pages/supplier/invited-supplier/schemaBuilder.ts'
);

const schemaSource = readFileSync(schemaBuilderPath, 'utf8');

test('schema builder contains supplier invite API endpoints', () => {
  assert.match(schemaSource, /supplier-invite\/page-list/);
  assert.match(schemaSource, /supplier-invite\/save-batch/);
  assert.match(schemaSource, /supplier-invite\/invite/);
});

test('schema builder defines fallback search options for supplier invite', () => {
  assert.match(schemaSource, /FALLBACK_SEARCH_OPTIONS/);
  assert.match(schemaSource, /supplierName/);
  assert.match(schemaSource, /inviteStatus/);
  assert.match(schemaSource, /authStatus/);
});

test('schema builder registers status badge column for invite and auth status', () => {
  assert.match(schemaSource, /status-badge/);
  assert.match(schemaSource, /inviteStatus/);
  assert.match(schemaSource, /authStatus/);
});
