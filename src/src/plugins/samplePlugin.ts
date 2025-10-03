import type { RingPlugin } from './index';
import { registerPlugin } from './index';

const samplePlugin: RingPlugin = {
  name: 'SamplePlugin',
  init: (client) => {
    // Example: log when plugin is initialized
    console.log('SamplePlugin initialized with client', client);
  },
};

registerPlugin(samplePlugin);
