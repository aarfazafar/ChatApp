import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    allowedHosts: ['2d7f-2409-40e0-105a-d7bb-85a3-d4c9-abbd-1c0c.ngrok-free.app'],
  },
})
