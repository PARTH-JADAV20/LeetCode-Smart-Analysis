import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  plugins: [
    react(),
    copy({
      targets: [
        { src: 'extension/manifest.json', dest: 'dist-extension' },
        { src: 'extension/styles.css', dest: 'dist-extension' },
        { src: 'extension/icons/*', dest: 'dist-extension/icons' },
      ],
      hook: 'writeBundle', // Run after bundles are written
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist-extension', // Output directory for the Chrome extension build
    emptyOutDir: true,
    rollupOptions: {
      input: {
        contentScript: resolve(__dirname, 'extension/contentScript.ts'),
        smartAnalysisUI: resolve(__dirname, 'extension/ui/SmartTab.tsx'), // Entry for the React UI
      },
      output: {
        entryFileNames: '[name].js', // contentScript.js, smartAnalysisUI.js
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
