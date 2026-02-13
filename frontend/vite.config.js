import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const raw = proxyRes.headers['set-cookie'];
            if (!raw) return;
            const cookies = Array.isArray(raw) ? raw : [raw];
            const rewrite = (cookie) =>
              (cookie
                .replace(/;\s*Secure/gi, '')
                .replace(/;\s*Domain=[^;]+/gi, '')
                .trim() + '; Domain=localhost');
            proxyRes.headers['set-cookie'] = cookies.map(rewrite);
          });
        },
      },
    },
  },
})
