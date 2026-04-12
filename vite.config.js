import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        enquire: resolve(__dirname, 'enquire.html'),
        declaration: resolve(__dirname, 'declaration.html'),
        connect: resolve(__dirname, 'connect.html'),
        rohit: resolve(__dirname, 'rohit.html'),
      },
    },
  },
});
