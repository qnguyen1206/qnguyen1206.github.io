import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },
    
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large components into separate chunks
          'projects': ['./src/sections/projects.js'],
          'skills': ['./src/sections/skills.js'],
          'certificates': ['./src/sections/certificates.js']
        }
      }
    },
    
    // Generate source maps for debugging
    sourcemap: false,
    
    // Optimize bundle size
    chunkSizeWarningLimit: 1000
  },
  
  // Asset optimization
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg']
})