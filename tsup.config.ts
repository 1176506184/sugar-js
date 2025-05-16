import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['./compiler.plugin.ts'],
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  outDir: '/'
});
