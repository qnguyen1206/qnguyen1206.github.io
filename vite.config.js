import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',

  // Copy the 3705 folder to dist during build
  publicDir: 'public',
  
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
      input: {
        main: resolve(__dirname, 'index.html'),
        'pokemon-tcg-tracker': resolve(__dirname, 'pokemon-tcg-tracker/index.html')
      },
      output: {
        manualChunks: {
          // Split large components into separate chunks
          'projects': ['./src/sections/projects.js'],
          'skills': ['./src/sections/skills.js'],
          'certificates': ['./src/sections/certificates.js'],
          'blog': ['./src/sections/blog.js'],
          'contacts': ['./src/sections/contacts.js'],
          'blog-posts': ['./src/sections/blog-posts.js'],
          'resume': ['./src/sections/resume.js'],
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