import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Multiple HTML entry points for MPA (Multi-Page Application)
  build: {
    rollupOptions: {
      input: {
        // Main pages
        main: resolve(__dirname, 'index.html'),
        properties: resolve(__dirname, 'properties/index.html'),
        apply: resolve(__dirname, 'apply/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        impact: resolve(__dirname, 'impact/index.html'),
        resources: resolve(__dirname, 'resources/index.html'),
        faq: resolve(__dirname, 'faq/index.html'),
        transparency: resolve(__dirname, 'transparency/index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html'),
        '404': resolve(__dirname, '404.html')
      },
      output: {
        // Clean up output structure
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // Optimize for static hosting
    outDir: 'dist',
    emptyOutDir: true,
    // Ensure proper base path handling
    assetsDir: 'assets'
  },
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    // Handle SPA routing for development
    fs: {
      strict: false
    }
  },
  // Path resolution for imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname)
    }
  },
  // Performance optimizations
  css: {
    devSourcemap: true
  },
  // Build optimizations
  esbuild: {
    drop: ['console', 'debugger'] // Remove console.logs in production
  }
});
