import assert from 'node:assert';
import {
  createViewManifest,
  createViewProof,
  decodeViewJsonl,
  encodeViewJsonl,
  materializeView,
  queryViewManifest,
  redactViewManifest,
  traceViewImpact,
  validateViewManifest
} from '../dist/index.js';

const args = parseArgs(process.argv.slice(2));
const cases = readPositiveInt(args.cases, 300);
let seed = readPositiveInt(args.seed, 0x71e775);

for (let caseIndex = 0; caseIndex < cases; caseIndex++) {
  const fieldCount = randInt(3, 36);
  const schemaProperties = {};
  const fields = {};
  const profile = {};
  const draft = {};

  for (let i = 0; i < fieldCount; i++) {
    const name = 'field' + i;
    const kind = pick(['string', 'number', 'boolean', 'enum']);
    const sourcePath = '/entity/' + name;
    schemaProperties[name] = schemaForKind(kind);
    profile[name] = valueForKind(kind, i);
    draft[name] = i % 3 === 0 ? alternateValueForKind(kind, i) : profile[name];
    fields[sourcePath] = {
      writePath: '/draft/entity/' + name,
      representation: representationForKind(kind),
      validate: validationForKind(kind),
      editableWhen: i % 5 === 0 ? { capability: 'cap.' + (i % 4) } : undefined,
      virtual: i % 7 === 0 ? { keyBy: 'id', estimatedSize: 24 + (i % 8), overscan: i % 5 } : undefined,
      lod: i % 9 === 0 ? { profile: 'lod.' + (i % 3), levels: ['full', 'small', 'dot'], significance: sourcePath } : undefined,
      tags: ['fuzz', kind]
    };
  }

  const manifest = createViewManifest({
    id: 'fuzz.view.' + caseIndex,
    source: {
      path: '/entity',
      schema: {
        type: 'object',
        required: Object.keys(schemaProperties).filter((_, index) => index % 4 === 0),
        properties: schemaProperties
      }
    },
    fields,
    flows: {
      edit: {
        draftFrom: '/entity',
        draftPath: '/draft/entity',
        submit: {
          id: 'entity.save.' + caseIndex,
          action: 'entity.save',
          input: { draft: { from: '/draft/entity' } },
          requiresValid: true,
          requiresDirty: true,
          reads: ['/draft/entity'],
          writes: ['/entity']
        }
      }
    },
    metadata: { token: 'case-secret-' + caseIndex }
  });

  assert.deepStrictEqual(validateViewManifest(manifest).filter((issue) => issue.severity === 'error'), []);
  assert.strictEqual(manifest.summary.fieldCount, fieldCount);

  const state = { entity: profile, draft: { entity: draft } };
  const capabilities = ['cap.0', 'cap.1', 'cap.2', 'cap.3'].filter((_, index) => (caseIndex + index) % 2 === 0);
  const frame = materializeView(manifest, { flow: 'edit', state, capabilities, validation: 'all', includeHidden: true });
  assert.strictEqual(frame.nodes.length, fieldCount);
  assert.strictEqual(frame.actions.length, 1);
  assert.strictEqual(frame.summary.fieldCount, fieldCount);
  for (const node of frame.nodes) {
    assert.strictEqual(typeof node.id, 'string');
    assert.ok(node.sourcePath.startsWith('/entity/'));
    assert.strictEqual(typeof node.representation.kind, 'string');
    if (node.virtual) assert.ok(node.virtual.estimatedSize === undefined || node.virtual.estimatedSize > 0);
    if (node.lod) assert.ok(node.lod.levels.length > 0);
  }

  const sampleField = manifest.fields[randInt(0, manifest.fields.length - 1)];
  const query = queryViewManifest(manifest, { paths: [sampleField.sourcePath], tags: ['fuzz'] });
  assert.ok(query.fields.some((field) => field.id === sampleField.id));

  const impact = traceViewImpact(manifest, { fields: [sampleField.id] });
  assert.ok(impact.fieldIds.includes(sampleField.id));

  const jsonl = encodeViewJsonl(manifest, { redactKeys: ['token'] });
  const decoded = decodeViewJsonl(jsonl);
  assert.strictEqual(decoded.metadata?.token, '[REDACTED]');
  assert.strictEqual(decoded.summary.fieldCount, manifest.summary.fieldCount);
  assert.strictEqual(createViewProof(decoded, 1).hash, createViewProof(decodeViewJsonl(encodeViewJsonl(decoded)), 1).hash);

  const redacted = redactViewManifest(manifest);
  assert.strictEqual(redacted.metadata?.token, '[REDACTED]');
}

console.log(`frontier view fuzz passed: cases=${cases}`);

function schemaForKind(kind) {
  if (kind === 'number') return { type: 'number', minimum: 0, maximum: 100 };
  if (kind === 'boolean') return { type: 'boolean' };
  if (kind === 'enum') return { type: 'string', enum: ['red', 'green', 'blue'] };
  return { type: 'string', format: randInt(0, 5) === 0 ? 'email' : undefined };
}

function valueForKind(kind, index) {
  if (kind === 'number') return index;
  if (kind === 'boolean') return index % 2 === 0;
  if (kind === 'enum') return pick(['red', 'green', 'blue']);
  return 'value-' + index + '@example.test';
}

function alternateValueForKind(kind, index) {
  if (kind === 'number') return index + 10;
  if (kind === 'boolean') return index % 2 !== 0;
  if (kind === 'enum') return pick(['red', 'green', 'blue']);
  return 'changed-' + index + '@example.test';
}

function representationForKind(kind) {
  if (kind === 'number') return randInt(0, 1) === 0 ? 'field.number' : { kind: 'mark.bar', target: 'canvas', channels: { y: { value: randInt(0, 100) } } };
  if (kind === 'boolean') return 'field.toggle';
  if (kind === 'enum') return 'field.select';
  return 'field.text';
}

function validationForKind(kind) {
  if (kind === 'string') return ['required', 'email'];
  if (kind === 'enum') return ['enum'];
  return ['type'];
}

function rand() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 0x100000000;
}

function randInt(min, max) {
  return min + Math.floor(rand() * (max - min + 1));
}

function pick(values) {
  return values[randInt(0, values.length - 1)];
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--cases') out.cases = argv[++i];
    else if (arg === '--seed') out.seed = argv[++i];
  }
  return out;
}

function readPositiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}
