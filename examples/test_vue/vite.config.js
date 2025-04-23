import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ImageTools from '../../src/index.ts'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        index_2: resolve(__dirname, 'index_2.html'),
        test: resolve(__dirname, './src/pages/test.html')
      }
    }
  },
  plugins: [
    vue(),
    ImageTools({
      A:111
    })
  ]
})

