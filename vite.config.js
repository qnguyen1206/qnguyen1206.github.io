import { defineConfig } from 'vite'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: './',

   plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'pokemon-tcg-tracker/data/*',
          dest: 'pokemon-tcg-tracker/data'
        },
        {
          src: 'LMC4730/game.js',
          dest: 'LMC4730'
        },
        {
          src: 'LMC4730/gate-themes.css',
          dest: 'LMC4730'
        },
        {
          src: 'LMC4730/data/*.js',
          dest: 'LMC4730/data'
        }
      ]
    })
  ],

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
        'pokemon-tcg-tracker': resolve(__dirname, 'pokemon-tcg-tracker/index.html'),
        'LMC4730': resolve(__dirname, 'LMC4730/index.html')
      },
    },
    
    // Generate source maps for debugging
    sourcemap: false,
    
    // Optimize bundle size
    chunkSizeWarningLimit: 1000
  },
  
  // Asset optimization
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg']
})
