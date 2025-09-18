import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist', // 👈 must stay 'dist' for gh-pages
  },
  server: {
    port: 3000,
    open: true,
  },
  base: '/metro/', // 👈 required for GitHub Pages (repo name)
})
