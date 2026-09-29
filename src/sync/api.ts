// Calls to the Supabase project "langit" (see supabase/migrations). The
// publishable key is meant to ship in the app: the table itself is closed, and
// the two functions only answer to a secret sync code.

const SYNC_URL = import.meta.env.VITE_SYNC_URL ?? 'https://cbcqutrkmpylpyvctutv.supabase.co'
const KEY = import.meta.env.VITE_SYNC_KEY ?? 'sb_publishable_707cPLyhV2W1FW-p0qH5jw_vRvB8H9G'

export class SyncHttpError extends Error {
  readonly status: number
  constructor(status: number) {
    super(`HTTP ${status}`)
    this.status = status
  }
}

async function rpc<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${SYNC_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new SyncHttpError(res.status)
  return (await res.json()) as T
}

/** The saved progress for a code with its version, or null when the code is unknown. */
export async function pull(code: string): Promise<{ data: unknown; version: number } | null> {
  const rows = await rpc<{ data: unknown; version: number }[]>('sync_pull', { p_code: code })
  return rows[0] ?? null
}

/**
 * Saves progress. With version 0 it creates the code (null: the code is taken).
 * Otherwise it only writes while `version` is still the latest; null means
 * another device wrote first.
 */
export async function push(code: string, data: unknown, version: number): Promise<number | null> {
  return rpc<number | null>('sync_push', { p_code: code, p_data: data, p_version: version })
}
