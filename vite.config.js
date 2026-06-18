import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const authEnv = loadEnv(mode, process.cwd(), 'AUTH_')
  const apiEnv = loadEnv(mode, process.cwd(), 'API_')
  const authUsername = authEnv.AUTH_USERNAME ?? process.env.AUTH_USERNAME ?? ''
  const authPassword = authEnv.AUTH_PASSWORD ?? process.env.AUTH_PASSWORD ?? ''
  const apiUrl = apiEnv.API_URL ?? process.env.API_URL ?? ''

  return {
    base: '/ci-cd-cours/',
    define: {
      'process.env.AUTH_USERNAME': JSON.stringify(authUsername),
      'process.env.AUTH_PASSWORD': JSON.stringify(authPassword),
      'process.env.API_URL': JSON.stringify(apiUrl),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
