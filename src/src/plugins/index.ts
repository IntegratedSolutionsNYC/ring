// Plugin system entry point
export interface RingPlugin {
  name: string;
  init: (client: any) => void;
}

const plugins: RingPlugin[] = [];

export function registerPlugin(plugin: RingPlugin) {
  plugins.push(plugin);
}

export function initPlugins(client: any) {
  plugins.forEach((plugin) => plugin.init(client));
}

export { plugins };