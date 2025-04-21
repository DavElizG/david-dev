import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { splitVendorChunkPlugin } from 'vite'
// Eliminada la importación de visualizer

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    splitVendorChunkPlugin(),
    // Eliminado el plugin visualizer que generaba stats.html
  ],
  build: {
    assetsInlineLimit: 1024, // Solo inlinear assets muy pequeños (<1KB)
    chunkSizeWarningLimit: 800,
    reportCompressedSize: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'styled-components': ['styled-components'],
          '3d-libs': ['three', '@react-three/drei', '@react-three/fiber'],
          'icons': ['react-icons', 'devicons-react', 'simple-icons'],
        }
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['framer-motion']
  },
})