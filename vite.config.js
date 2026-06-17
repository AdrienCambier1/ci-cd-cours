import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'AUTH_')
  const authUsername = env.AUTH_USERNAME ?? process.env.AUTH_USERNAME ?? ''
  const authPassword = env.AUTH_PASSWORD ?? process.env.AUTH_PASSWORD ?? ''

  return {
    base: '/ci-cd-cours/',
    define: {
      'process.env.AUTH_USERNAME': JSON.stringify(authUsername),
      'process.env.AUTH_PASSWORD': JSON.stringify(authPassword),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
