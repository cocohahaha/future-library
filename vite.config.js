import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// three.js is imported from its ES sources (three/src) instead of the
// prebuilt single file, so Rollup can drop unused modules and split the
// library across two chunks. Every emitted JS chunk stays under ~450 KB.
const threeSrc = fileURLToPath(new URL('./node_modules/three/src/Three.js', import.meta.url));

// three's own build strips comments and blank lines from its GLSL chunks;
// importing the sources skips that step, so do the same here (and drop
// indentation, which GLSL ignores). Our own /* glsl */ strings get the same.
function trimThreeGlsl() {
  return {
    name: 'trim-three-glsl',
    transform(code, id) {
      // three's chunks, and our own /* glsl */ strings under src/
      if (!/three[\\/]src[\\/].*\.glsl\.js$/.test(id) && !/[\\/]src[\\/].*\.js$/.test(id.replace(/^.*node_modules.*$/, ''))) return null;
      const out = code.replace(/\/\* glsl \*\/`([\s\S]*?)`/g, (_, body) => {
        const trimmed = body
          .replace(/\r/g, '')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/^[ \t]*\/\/.*$/gm, '')
          .replace(/^[ \t]+/gm, '')
          .replace(/\n{2,}/g, '\n');
        return '/* glsl */`' + trimmed + '`';
      });
      return { code: out, map: null };
    }
  };
}

// base: './' keeps every asset path relative so dist/ works from any
// GitHub Pages sub-path (https://user.github.io/repo/) or a plain file server.
export default defineConfig({
  base: './',
  resolve: {
    alias: [{ find: /^three$/, replacement: threeSrc }]
  },
  plugins: [trimThreeGlsl()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 450,
    target: 'es2020',
    rollupOptions: {
      output: {
        // renderer + shader library in one chunk, the scene graph / math /
        // geometry core in another, our app in the entry chunk
        manualChunks(id) {
          if (!id.includes('/three/src/')) return undefined;
          // ShaderMaterial (core) pulls these three small renderer modules
          if (/UniformsUtils|default_vertex|default_fragment/.test(id)) return 'three-core';
          if (id.includes('/three/src/renderers/') || id.includes('/three/src/extras/PMREMGenerator')) return 'three-render';
          return 'three-core';
        }
      }
    }
  }
});
