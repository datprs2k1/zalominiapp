import { defineConfig } from 'vite';
import zaloMiniApp from 'zmp-vite-plugin';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: './src',
    base: '',
    plugins: [
      zaloMiniApp(),
      react({
        // Enable React Fast Refresh for better development experience
        fastRefresh: true,
        // Optimize JSX runtime for production
        jsxRuntime: 'automatic',
      }),
    ],
    build: {
      assetsInlineLimit: 4096, // Inline small assets (4KB) for better performance
      target: 'es2015',
      // Optimize bundle splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunk for stable dependencies
            vendor: ['react', 'react-dom', 'react-router-dom'],
            // UI library chunk
            ui: ['zmp-ui', 'framer-motion'],
            // Medical utilities chunk
            medical: ['jotai', 'react-hot-toast'],
          },
          // Optimize chunk file names for better caching
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      // Enable source maps for production debugging
      sourcemap: false,
      // Optimize minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    // Optimize development server
    server: {
      hmr: {
        overlay: false, // Disable error overlay for better mobile testing
      },
    },
    // Enable CSS code splitting
    css: {
      devSourcemap: true,
    },
  });
};
