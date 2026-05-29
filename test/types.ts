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
        target: 'any'
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
