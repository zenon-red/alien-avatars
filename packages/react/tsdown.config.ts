import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  platform: 'neutral',
  format: ['esm', 'cjs'],
  external: ['react', 'react/jsx-runtime'],
  dts: true,
  minify: true,
  sourcemap: true,
})
