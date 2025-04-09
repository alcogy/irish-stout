import { defineConfig } from 'tsup'
import esbuildCssModulesPlugin from 'esbuild-css-modules-plugin';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  shims: true,
  clean: true,
})