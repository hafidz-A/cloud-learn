interface ImportMetaEnv {
  /** Overrides the sync server (src/sync/api.ts), for example to point at another Supabase project. */
  readonly VITE_SYNC_URL?: string
  readonly VITE_SYNC_KEY?: string
}
