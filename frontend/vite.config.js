/**
 * vite.config.js
 * The Vite dev server proxies /api and /uploads requests to the
 * Express backend on port 5000 — so the React app can call the API
 * with relative URLs like "/api/trips".
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
