import {
  createViewManifest,
  materializeView,
  type FrontierViewFrame,
  type FrontierViewManifest,
  type FrontierViewManifestInput
} from '../dist/index.js';

const input = {
  id: 'types.view',
  source: {
    path: '/profile',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' }
      }
    }
  },
  fields: {
    '/profile/email': {
      writePath: '/draft/profile/email',
      validate: ['required', 'email'],
      representation: {
        kind: 'field.email',
        target: 'any',
        channels: {
          value: {
            from: '/profile/email',
            domain: ['a@example.test', 'b@example.test'],
            updateTriggers: ['profile.email']
          }
        },
        virtual: {
          count: 2,
          lanes: 1,
          gap: 4,
          measureKey: 'email-row'
        },
        lod: {
          levels: ['full', 'compact'],
          priority: 1,
          degrade: 'compact'
        }
      }
    }
  }
} satisfies FrontierViewManifestInput;

const manifest: FrontierViewManifest = createViewManifest(input);
const frame: FrontierViewFrame = materializeView(manifest, {
  state: {
    profile: { email: 'a@example.test' },
    draft: { profile: { email: 'b@example.test' } }
  }
});

frame.nodes[0]?.representation.kind satisfies string;
frame.nodes[0]?.representation.virtual?.lanes satisfies number | undefined;
frame.nodes[0]?.representation.channels.value.updateTriggers satisfies string[] | undefined;
