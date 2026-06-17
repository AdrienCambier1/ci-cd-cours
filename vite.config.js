import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'AUTH_')

  return {
    base: '/ci-cd-cours/',
    define: {
      'process.env.AUTH_USERNAME': JSON.stringify(env.AUTH_USERNAME ?? ''),
      'process.env.AUTH_PASSWORD': JSON.stringify(env.AUTH_PASSWORD ?? ''),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
