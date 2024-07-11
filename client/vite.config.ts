import checker from "vite-plugin-checker"
import { defineConfig } from "vite"
import { resolve } from 'path';
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        "main": resolve(__dirname, 'index.html'),
        "register": resolve(__dirname, 'src/pages/register.html'),
        "login": resolve(__dirname,'src/pages/login.html'),
      }
    }
  },
  plugins: [
    checker({
      typescript: true,
    })
  ]
}) 