import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import {
  createViewManifest,
  createViewProof,
  createViewRegistryGraph,
  decodeViewJsonl,
  encodeViewJsonl,
  materializeView,
  queryViewManifest,
  redactViewManifest,
  traceViewImpact
} from '../dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(__dirname, '..');
const repoRoot = path.basename(path.dirname(packageDir)) === 'packages'
  ? path.resolve(packageDir, '..', '..')
  : packageDir;
const args = parseArgs(process.argv.slice(2));
const fieldCount = readPositiveInt(args.fields, 1000);
const rounds = readPositiveInt(args.rounds, 30);
const outPath = args.out ? path.resolve(repoRoot, args.out) : null;

const input = makeViewInput(fieldCount);
let manifest = createViewManifest(input);
let frame = materializeView(manifest, { flow: 'edit', state: makeState(fieldCount), capabilities: ['bench.edit'], validation: 'field' });
let jsonl = encodeViewJsonl(manifest);
let cursor = 0;

const rows = [
  measure('create-manifest-' + fieldCount, 1, () => {
    manifest = createViewManifest(input);
    return manifest.fields.length + manifest.diagnostics.length;
  }),
  measure('materialize-frame-' + fieldCount, 1, () => {
    frame = materializeView(manifest, { flow: 'edit', state: makeState(fieldCount), capabilities: ['bench.edit'], validation: 'field' });
    return frame.nodes.length + frame.issues.length;
  }),
  measure('query-path-' + fieldCount, 64, () => {
    const pathValue = '/rows/' + (cursor++ % fieldCount) + '/value';
    return queryViewManifest(manifest, { paths: [pathValue] }).fields.length;
  }),
  measure('query-representation-' + fieldCount, 64, () => {
    const representation = cursor++ % 3 === 0 ? 'field.number' : cursor % 3 === 1 ? 'mark.circle' : 'field.text';
    return queryViewManifest(manifest, { representations: [representation] }).fields.length;
  }),
  measure('impact-field-' + fieldCount, 16, () => {
    const field = manifest.fields[cursor++ % manifest.fields.length];
    return traceViewImpact(manifest, { fields: [field.id] }).fieldIds.length;
  }),
  measure('registry-graph-' + fieldCount, 1, () => {
    const graph = createViewRegistryGraph(manifest, { package: '@shapeshift-labs/frontier-view' });
    return graph.entries.length + graph.edges.length;
  }),
  measure('jsonl-encode-' + fieldCount, 1, () => {
    jsonl = encodeViewJsonl(manifest);
    return jsonl.length;
  }),
  measure('jsonl-decode-' + fieldCount, 1, () => decodeViewJsonl(jsonl).fields.length),
  measure('redact-manifest-' + fieldCount, 1, () => redactViewManifest(manifest).fields.length),
  measure('proof-' + fieldCount, 4, () => createViewProof(manifest).hash.length)
];

const report = {
  package: '@shapeshift-labs/frontier-view',
  version: readPackageVersion(),
  generatedAt: new Date().toISOString(),
  node: process.version,
  platform: process.platform + ' ' + process.arch,
  fieldCount,
  rounds,
  rows
};

if (outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
}

console.log(report.package + ' package benchmark');
console.log('Node ' + report.node + ' on ' + report.platform + ', fields=' + fieldCount + ', rounds=' + rounds);
console.log('These are Frontier-only package measurements, not competitor comparisons.');
console.log('');
console.log(padRight('Fixture', 34) + padLeft('Median', 12) + padLeft('p95', 12));
for (const row of rows) {
  console.log(padRight(row.fixture, 34) + padLeft(formatUs(row.medianUs), 12) + padLeft(formatUs(row.p95Us), 12));
}
if (outPath) console.log('\nwrote ' + path.relative(repoRoot, outPath));

function makeViewInput(count) {
  const properties = {};
  const fields = {};
  for (let i = 0; i < count; i++) {
    const name = String(i);
    properties[name] = {
      type: 'object',
      properties: {
        id: { type: 'string', readOnly: true },
        value: { type: i % 2 === 0 ? 'number' : 'string' },
        visible: { type: 'boolean' }
      }
    };
    fields['/rows/' + i + '/value'] = {
      writePath: '/draft/rows/' + i + '/value',
      representation: i % 5 === 0
        ? { kind: 'mark.circle', target: 'canvas', channels: { y: { from: '/rows/' + i + '/value' } } }
        : i % 2 === 0 ? 'field.number' : 'field.text',
      validate: ['type'],
      virtual: i % 16 === 0 ? { keyBy: 'id', estimatedSize: 28, overscan: 8 } : undefined,
      lod: i % 32 === 0 ? { profile: 'row-lod', levels: ['full', 'compact', 'dot'], significance: '/rows/' + i + '/value' } : undefined,
      tags: ['bench', i % 2 === 0 ? 'numeric' : 'text']
    };
  }
  return {
    id: 'bench.view',
    source: {
      path: '/rows',
      schema: {
        type: 'object',
        properties
      }
    },
    fields,
    flows: {
      edit: {
        draftFrom: '/rows',
        draftPath: '/draft/rows',
        submit: {
          id: 'rows.save',
          action: 'rows.save',
          input: { rows: { from: '/draft/rows' } },
          requiresDirty: true,
          reads: ['/draft/rows'],
          writes: ['/rows']
        }
      }
    },
    metadata: { token: 'bench-secret' }
  };
}

function makeState(count) {
  const rows = {};
  const draftRows = {};
  for (let i = 0; i < count; i++) {
    const value = i % 2 === 0 ? i : 'value-' + i;
    rows[i] = { id: 'row-' + i, value, visible: i % 3 !== 0 };
    draftRows[i] = { id: 'row-' + i, value: i % 4 === 0 ? (typeof value === 'number' ? value + 1 : value + '-x') : value, visible: i % 3 !== 0 };
  }
  return { rows, draft: { rows: draftRows } };
}

function measure(fixture, batchSize, fn, innerOps = 1) {
  const values = [];
  let sink = 0;
  for (let round = 0; round < rounds; round++) {
    const started = performance.now();
    for (let i = 0; i < batchSize; i++) sink += fn();
    values[values.length] = ((performance.now() - started) * 1000) / (batchSize * innerOps);
  }
  if (sink === -1) console.log('sink=' + sink);
  values.sort((left, right) => left - right);
  return {
    fixture,
    medianUs: percentile(values, 0.5),
    p95Us: percentile(values, 0.95)
  };
}

function percentile(values, p) {
  return values[Math.min(values.length - 1, Math.floor((values.length - 1) * p))] ?? 0;
}

function formatUs(value) {
  if (value >= 1000) return (value / 1000).toFixed(2) + ' ms';
  return value.toFixed(2) + ' us';
}

function padRight(value, width) {
  return String(value).padEnd(width, ' ');
}

function padLeft(value, width) {
  return String(value).padStart(width, ' ');
}

function readPackageVersion() {
  return JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8')).version;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--fields') out.fields = argv[++i];
    else if (arg === '--rounds') out.rounds = argv[++i];
    else if (arg === '--out') out.out = argv[++i];
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: npm run bench -- [--fields 1000] [--rounds 30] [--out benchmarks/results/frontier-view-package-bench-latest.json]');
      process.exit(0);
    }
  }
  return out;
}

function readPositiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}
