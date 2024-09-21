import checker from "vite-plugin-checker"
import { defineConfig } from "vite"
import { resolve } from 'path';
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        "register": resolve(__dirname, 'src/pages/register.html'),
        "login": resolve(__dirname,'src/pages/login.html'),
      },
      output: {
        dir: 'dist/',
        chunkFileNames: "assets/main.js",
        assetFileNames: "assets/[name].[ext]"
      }
    }
  },
  plugins: [
    checker({
      typescript: true,
    })
  ]
}) 