import assert from 'node:assert';
import {
  createViewManifest,
  createViewProof,
  createViewRecord,
  createViewRegistryGraph,
  decodeViewJsonl,
  defineView,
  encodeViewJsonl,
  materializeView,
  queryViewManifest,
  redactViewManifest,
  traceViewImpact,
  validateViewManifest
} from '../dist/index.js';

const view = createViewManifest({
  id: 'profile.editor',
  package: '@app/profile',
  feature: 'profile',
  source: {
    path: '/profile',
    schema: {
      type: 'object',
      required: ['email'],
      properties: {
        id: { type: 'string', readOnly: true },
        email: { type: 'string', format: 'email' },
        role: { type: 'string', enum: ['admin', 'editor', 'viewer'] },
        metrics: {
          type: 'object',
          properties: {
            score: { type: 'number' }
          }
        }
      }
    }
  },
  defaults: {
    string: 'field.text',
    enum: 'field.select',
    object: 'group.section',
    number: 'field.number'
  },
  representations: {
    'canvas.scatter': {
      kind: 'mark.circle',
      target: 'canvas',
      channels: {
        x: {
          from: '/profile/metrics/score',
          scale: 'linear',
          domain: [0, 100],
          axis: { title: 'Score' },
          updateTriggers: ['profile.metrics.score']
        },
        color: {
          value: 'green',
          legend: { title: 'Status' }
        }
      },
      lod: {
        profile: 'profile-minimap',
        levels: ['full', 'dot'],
        significance: '/profile/metrics/score',
        priority: 2,
        cost: 0.5,
        minZoom: 0,
        maxZoom: 8,
        hysteresis: 0.25,
        degrade: 'dot',
        variants: { full: 'profile-card', dot: 'profile-dot' }
      }
    },
    'shader.uniforms': {
      kind: 'shader.uniforms',
      target: 'webgpu',
      shader: { module: 'profile.wgsl' },
      attributes: { bindings: ['score'] }
    }
  },
  fields: {
    '/profile/id': {
      label: 'ID',
      mode: 'readonly',
      representation: 'text.code'
    },
    '/profile/email': {
      writePath: '/draft/profile/email',
      validate: ['required', 'email']
    },
    '/profile/role': {
      representation: 'field.select',
      editableWhen: { capability: 'profile.role.write' }
    },
    '/profile/metrics/score': {
      representation: 'canvas.scatter',
      writePath: '/draft/profile/metrics/score',
      virtual: {
        keyBy: 'id',
        count: 1000,
        estimatedSize: 32,
        overscan: 8,
        lanes: 2,
        gap: 4,
        paddingStart: 12,
        paddingEnd: 12,
        scrollMargin: 24,
        measureKey: 'profile-score-row',
        rangeExtractor: 'sticky-active',
        sticky: ['header'],
        rangePath: '/view/ranges/profile'
      },
      validate: ['dirty']
    }
  },
  flows: {
    edit: {
      draftFrom: '/profile',
      draftPath: '/draft/profile',
      submit: {
        id: 'profile.save',
        action: 'profile.save',
        event: 'form.submit',
        input: {
          id: { from: '/profile/id' },
          email: { from: '/draft/profile/email' },
          score: { from: '/draft/profile/metrics/score' }
        },
        requiresValid: true,
        requiresDirty: true,
        reads: ['/draft/profile'],
        writes: ['/profile'],
        effects: ['fetch:/api/profile'],
        tags: ['submit']
      }
    },
    review: {
      mode: 'readonly',
      actions: {
        approve: {
          id: 'profile.approve',
          action: 'profile.approve',
          input: { id: { from: '/profile/id' } },
          reads: ['/profile/id'],
          writes: ['/profile/status']
        }
      }
    }
  },
  metadata: {
    token: 'secret-token'
  }
});

assert.strictEqual(defineView({ id: 'minimal' }).id, 'minimal');
assert.deepStrictEqual(validateViewManifest(view).filter((issue) => issue.severity === 'error'), []);
assert.strictEqual(view.summary.fieldCount >= 4, true);
assert.strictEqual(view.representations['canvas.scatter'].target, 'canvas');

const frame = materializeView(view, {
  flow: 'edit',
  state: {
    profile: {
      id: 'u1',
      email: 'old@example.test',
      role: 'viewer',
      metrics: { score: 3 }
    },
    draft: {
      profile: {
        email: 'new@example.test',
        metrics: { score: 9 }
      }
    }
  },
  capabilities: ['profile.role.write'],
  validation: 'all',
  generatedAt: 123
});

assert.strictEqual(frame.kind, 'frontier.view.frame');
assert.strictEqual(frame.summary.editableCount > 0, true);
assert.strictEqual(frame.summary.errorCount, 0);
assert.strictEqual(frame.actions.length, 1);
assert.strictEqual(frame.actions[0].id, 'profile.save');
assert.strictEqual(frame.actions[0].ready, true);
assert.deepStrictEqual(frame.actions[0].input, {
  id: 'u1',
  email: 'new@example.test',
  score: 9
});

const idNode = frame.nodes.find((node) => node.sourcePath === '/profile/id');
assert.ok(idNode);
assert.strictEqual(idNode.readonly, true);

const scoreNode = frame.nodes.find((node) => node.sourcePath === '/profile/metrics/score');
assert.ok(scoreNode);
assert.strictEqual(scoreNode.representation.target, 'canvas');
assert.strictEqual(scoreNode.virtual?.overscan, 8);
assert.strictEqual(scoreNode.virtual?.lanes, 2);
assert.strictEqual(scoreNode.virtual?.gap, 4);
assert.strictEqual(scoreNode.virtual?.measureKey, 'profile-score-row');
assert.deepStrictEqual(scoreNode.virtual?.sticky, ['header']);
assert.strictEqual(scoreNode.lod?.profile, 'profile-minimap');
assert.strictEqual(scoreNode.lod?.priority, 2);
assert.strictEqual(scoreNode.lod?.degrade, 'dot');
assert.deepStrictEqual(scoreNode.channels.x.domain, [0, 100]);
assert.deepStrictEqual(scoreNode.channels.x.axis, { title: 'Score' });
assert.deepStrictEqual(scoreNode.channels.x.updateTriggers, ['profile.metrics.score']);
assert.deepStrictEqual(scoreNode.channels.color.legend, { title: 'Status' });
assert.strictEqual(scoreNode.dirty, true);

const blocked = materializeView(view, {
  flow: 'edit',
  state: {
    profile: { id: 'u1', email: 'old@example.test', role: 'viewer', metrics: { score: 3 } },
    draft: { profile: { email: 'not-an-email', metrics: { score: 3 } } }
  },
  validation: 'all'
});
assert.strictEqual(blocked.actions[0].ready, false);
assert.ok(blocked.issues.some((issue) => issue.code === 'format.email'));
assert.ok(blocked.issues.some((issue) => issue.code === 'action-blocked'));

const constrained = createViewManifest({
  id: 'constraints',
  source: {
    path: '/settings',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', minimum: 2, maximum: 4, multipleOf: 2 },
        code: { type: 'string', minLength: 3, maxLength: 5, pattern: '^[A-Z]+$' }
      }
    }
  }
});
const constrainedFrame = materializeView(constrained, {
  state: { settings: { count: 5, code: 'ab' } },
  validation: 'all'
});
assert.ok(constrainedFrame.issues.some((issue) => issue.code === 'range.maximum'));
assert.ok(constrainedFrame.issues.some((issue) => issue.code === 'length.minimum'));
assert.ok(constrainedFrame.issues.some((issue) => issue.code === 'pattern'));

const query = queryViewManifest(view, { representations: ['mark.circle'], paths: ['/profile/metrics'] });
assert.deepStrictEqual(query.fields.map((field) => field.sourcePath), ['/profile/metrics/score']);
assert.notStrictEqual(query.fields[0], view.fields.find((field) => field.sourcePath === '/profile/metrics/score'));

const graph = createViewRegistryGraph(view);
assert.ok(graph.entries.some((entry) => entry.id === 'profile.editor'));
assert.ok(graph.entries.some((entry) => entry.kind === 'view-field'));
assert.ok(graph.edges.some((edge) => edge.kind === 'uses-representation'));

const impact = traceViewImpact(view, { actions: ['profile.save'] });
assert.ok(impact.actionIds.includes('profile.save'));
assert.ok(impact.nodes.includes('entry:profile.save'));

const jsonl = encodeViewJsonl(view, { redactKeys: ['token'] });
const decoded = decodeViewJsonl(jsonl);
assert.strictEqual(decoded.id, view.id);
assert.notStrictEqual(decoded, view);
assert.strictEqual(decoded.metadata?.token, '[REDACTED]');
assert.strictEqual(createViewProof(decoded, 1).hash, createViewProof(decodeViewJsonl(encodeViewJsonl(decoded)), 1).hash);

const redacted = redactViewManifest(view);
const redactedAgain = redactViewManifest(view);
assert.strictEqual(redacted.metadata?.token, '[REDACTED]');
assert.notStrictEqual(redactedAgain, redacted);
assert.strictEqual(redactedAgain.metadata?.token, '[REDACTED]');

const record = createViewRecord({
  viewId: view.id,
  actionId: 'profile.save',
  status: 'ready',
  reads: ['/draft/profile'],
  writes: ['/profile'],
  affected: ['fetch:/api/profile']
});
assert.strictEqual(record.entryId, 'profile.save');
assert.deepStrictEqual(record.reads, ['/draft/profile']);

console.log('frontier view smoke passed');
