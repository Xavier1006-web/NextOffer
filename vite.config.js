import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'NextOffer',
        short_name: 'NextOffer',
        description: 'Track and manage your job applications',
        theme_color: '#ffffff',
        icons: [
          // Since we don't have custom icons yet, we can skip or use default ones if any. 
          // VitePWA can generate some or we just provide placeholder config to prevent errors.
        ]
      }
    })
  ],
})

