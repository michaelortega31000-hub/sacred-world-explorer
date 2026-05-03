import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  define: {
    // Build-time fallback for Supabase publishable values.
    // Lovable's Secrets store rejects VITE_-prefixed names and .env is gitignored,
    // so deployed bundles otherwise miss these. The anon key is safe in client bundles
    // (protected by RLS). Real env vars (local .env) still take precedence.
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
      process.env.VITE_SUPABASE_URL || 'https://uekqjlaguhzotiuqskvb.supabase.co'
    ),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVla3FqbGFndWh6b3RpdXFza3ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDgxODMsImV4cCI6MjA3NDgyNDE4M30.Y6LSLi7NWu6VZ5lh5RAi-eTII0wY7iDSK4eo0xiNMKo'
    ),
    'import.meta.env.VITE_SUPABASE_PROJECT_ID': JSON.stringify(
      process.env.VITE_SUPABASE_PROJECT_ID || 'uekqjlaguhzotiuqskvb'
    ),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force a single React instance (fixes "Invalid hook call" in some Vite/iframe preview setups)
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react-dom/client": path.resolve(__dirname, "node_modules/react-dom/client"),
      scheduler: path.resolve(__dirname, "node_modules/scheduler"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "scheduler",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "@react-three/postprocessing"
    ],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "scheduler"
    ],
    force: true,
  },
}));
