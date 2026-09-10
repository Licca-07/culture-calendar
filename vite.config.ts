import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base so GitHub Pages (/culture-calendar/) and Vercel (/) both work.
export default defineConfig({
  base: './',
  plugins: [react()],
})
