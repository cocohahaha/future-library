import { defineConfig } from 'vite';

// base: './' keeps every asset path relative so dist/ works from any
// GitHub Pages sub-path (https://user.github.io/repo/) or a plain file server.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 900,
    target: 'es2019'
  }
});
