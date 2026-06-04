import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Stamps sw.js with a build-time cache version so the browser detects a new SW on every deploy. */
function swCacheBust(): Plugin {
  return {
    name: 'sw-cache-bust',
    generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && file.fileName === 'sw.js' && typeof file.source === 'string') {
          const version = `sff-${Date.now()}`
          file.source = file.source.replace(
            /const CACHE_NAME = ['"]sff-v1['"]/,
            `const CACHE_NAME = '${version}'`,
          )
        }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), swCacheBust()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'icons': ['lucide-react'],
        },
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Increase chunk size warning to 300kB
    chunkSizeWarningLimit: 300,
    // Strip console.log/warn from production (keep console.error)
    minify: 'esbuild',
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['debugger'] : [],
    pure: process.env.NODE_ENV === 'production' ? ['console.log', 'console.warn'] : [],
  },
})
