import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [react()],
  server: {
    proxy: { 
      '/auth': {  
        target: 'http://localhost:8080',
        changeOrigin: true,
        logLevel: 'debug',
      },
      '/clients': {  
        target: 'http://localhost:8080',
        changeOrigin: true,
        logLevel: 'debug',
      },
      '/products': {  
        target: 'http://localhost:8080',
        changeOrigin: true,
        logLevel: 'debug',
      },
      '/sales': {  
        target: 'http://localhost:8080',
        changeOrigin: true,
        logLevel: 'debug',
      },
      '/users': {  
        target: 'http://localhost:8080',
        changeOrigin: true,
        logLevel: 'debug',
      }
    }
  },
})
