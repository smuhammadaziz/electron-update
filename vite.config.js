import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        // Main process entry file of package.json declaration.
        entry: 'electron/main.ts', // Adjust if your main process file is different
      },
      preload: {
        // Optional: Use preload scripts to expose Node.js APIs securely.
        input: path.join(__dirname, 'electron/preload.ts'), // Adjust path as needed
      },
      // Optional: Use Node.js API in the Renderer process. (Be cautious with security)
      renderer: {},
    }),
  ],
})