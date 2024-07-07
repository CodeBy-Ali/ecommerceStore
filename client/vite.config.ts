import checker from "vite-plugin-checker"
import { defineConfig } from "vite"
import { resolve } from 'path';
export default defineConfig({
  plugins: [
    checker({
      typescript: true,
    })
  ]
}) 