import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // With only one of the two set, the build succeeds but the forms cannot save
  // anything. Stop here so a half-configured deploy never goes live.
  if (Boolean(env.VITE_SUPABASE_URL) !== Boolean(env.VITE_SUPABASE_ANON_KEY)) {
    const missing = env.VITE_SUPABASE_URL ? 'VITE_SUPABASE_ANON_KEY' : 'VITE_SUPABASE_URL'
    throw new Error(`${missing} is not set. Set both Supabase variables, or neither (neither runs the forms in demo mode).`)
  }
  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react(), tailwindcss()],
  }
})
