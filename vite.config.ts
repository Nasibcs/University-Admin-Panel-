import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Vite requires `base` to end with `/` (e.g. GitHub Pages project site).
const rawBase = process.env.VITE_BASE_PATH || "/University-Admin-Panel-"
const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`

export default defineConfig({
  plugins: [react()],
  base,
})