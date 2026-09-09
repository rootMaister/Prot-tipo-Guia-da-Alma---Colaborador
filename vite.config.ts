import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // The design system is consumed via `link:../design-system`, so Vite resolves
    // it through the symlink to its real path — where its own node_modules would
    // otherwise supply a second copy of React and break every hook call.
    dedupe: ['react', 'react-dom'],
    alias: {
      // fileURLToPath, not URL.pathname: this project's directory name contains an
      // accent and a space, which pathname returns percent-encoded.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
