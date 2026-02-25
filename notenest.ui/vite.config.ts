import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // important if you want external access (ngrok, LAN)
  port: 5173,
  strictPort: true,
  allowedHosts: [
    'localhost',          // default
    '.ngrok.io',          // allow any subdomain of ngrok
    'delsie-unlaudable-alecia.ngrok-free.dev', // if testing a real dev domain
  ],
  }
})
