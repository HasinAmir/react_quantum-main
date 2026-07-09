import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        forum: resolve(__dirname, 'forum.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
