/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Image imports
declare module '*.jpeg'
declare module '*.jpg'
declare module '*.png'
declare module '*.webp'
declare module '*.avif'
