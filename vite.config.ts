import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://monopoly-express-logistica-6dd9qmqx6.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
