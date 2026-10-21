import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Expose only the two public Supabase settings needed by the browser app.
  envPrefix: ['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY'],
  plugins: [
    react(),
    tailwindcss(),
  ],
})
