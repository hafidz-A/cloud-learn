import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { initialProgress, useProgress } from '../store/progress'
import { pull, push, SyncHttpError } from './api'
import { mergeProgress, readSyncData, stableJson, SYNC_KEYS, toSyncData, type SyncData } from './merge'

// Syncing progress between devices (plan stage 8). A device either creates a
// sync code or enters one from another device. After that it pulls, merges, and
// pushes on start, when the app comes back, when it goes online, and a few
// seconds after every change. Without internet the app works as before.

export type SyncStatus = 'idle' | 'syncing' | 'offline' | 'error'

type SyncState = {
  /** Secret sync code (16 characters, no dashes), or null when this device is not connected. */
  code: string | null
  /** Server version this device last merged; 0 until the first merge after connecting. */
  version: number
  lastSyncedAt: string | null
  status: SyncStatus
  /** What went wrong, in words for the player. */
  message: string | null
}

export const useSync = create<SyncState>()(
  persist((): SyncState => ({ code: null, version: 0, lastSyncedAt: null, status: 'idle', message: null }), {
    name: 'langit-sync',
    version: 1,
    storage: createJSONStorage(() => localStorage),
    partialize: ({ code, version, lastSyncedAt }) => ({ code, version, lastSyncedAt }),
  }),
)

// Codes use 32 characters without look-alikes (no I, O, 0, 1): 16 of them are 80 random bits.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export const CODE_LENGTH = 16

export function newCode(): string {
  return [...crypto.getRandomValues(new Uint8Array(CODE_LENGTH))].map((b) => ALPHABET[b % ALPHABET.length]).join('')
}

export function normalizeCode(input: string): string {
  return input.toUpperCase().replace(/[\s-]/g, '')
}

export function isValidCode(code: string): boolean {
  return code.length === CODE_LENGTH && [...code].every((c) => ALPHABET.includes(c))
}

/** "ABCD-EFGH-JKLM-NPQR" */
export function formatCode(code: string): string {
  return code.match(/.{1,4}/g)?.join('-') ?? code
}

const DEFAULTS = toSyncData(initialProgress)
const TRIGGER_KEYS = SYNC_KEYS.filter((key) => key !== 'activeExam')
const now = () => new Date().toISOString()

function failureText(e: unknown): string {
  if (!navigator.onLine || e instanceof TypeError) return 'Tidak ada internet. Coba lagi saat online.'
  if (e instanceof SyncHttpError) return `Server sinkron sedang bermasalah (kode ${e.status}). Progres tetap aman di perangkat ini.`
  return 'Sinkron gagal. Progres tetap aman di perangkat ini.'
}

function fail(e: unknown) {
  const offline = !navigator.onLine || e instanceof TypeError
  useSync.setState({ status: offline ? 'offline' : 'error', message: failureText(e) })
}

function done(version: number) {
  useSync.setState({ version, lastSyncedAt: now(), status: 'idle', message: null })
}

// Set while merged progress is written into the store, so that write does not schedule another sync.
let applying = false

function applyLocal(data: SyncData) {
  applying = true
  try {
    useProgress.setState(data)
    useProgress.getState().refreshDay()
  } finally {
    applying = false
  }
}

async function syncOnce() {
  const code = useSync.getState().code
  if (!code) return
  useSync.setState({ status: 'syncing', message: null })
  try {
    for (let attempt = 0; attempt < 5; attempt++) {
      const joining = useSync.getState().version === 0
      const remote = await pull(code)
      if (useSync.getState().code !== code) return // disconnected while waiting
      // Local progress is read only now, so answers given while waiting are part of the merge.
      const local = toSyncData(useProgress.getState())
      const theirs = remote ? readSyncData(remote.data, DEFAULTS) : null
      const merged = theirs ? mergeProgress(local, theirs, { joining }) : local
      if (stableJson(merged) !== stableJson(local)) applyLocal(merged)
      if (remote && theirs && stableJson(merged) === stableJson(theirs)) return done(remote.version)
      // No saved progress for this code (for example a restored server): it is created again.
      const saved = await push(code, merged, remote?.version ?? 0)
      if (saved !== null) return done(saved)
      // Another device wrote first: pull again and merge that too.
    }
    throw new Error('sync kept conflicting')
  } catch (e) {
    fail(e)
  }
}

let running: Promise<void> | null = null
let runAgain = false

/** Pulls, merges, and pushes. Calls during a sync run it once more afterwards. */
export function syncNow(): Promise<void> {
  if (!useSync.getState().code) return Promise.resolve()
  if (running) {
    runAgain = true
    return running
  }
  running = (async () => {
    try {
      do {
        runAgain = false
        await syncOnce()
      } while (runAgain)
    } finally {
      running = null
    }
  })()
  return running
}

/** Makes a new code with this device's progress. Returns an error message, or null when it worked. */
export async function createSync(): Promise<string | null> {
  useSync.setState({ status: 'syncing', message: null })
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const code = newCode()
      const version = await push(code, toSyncData(useProgress.getState()), 0)
      if (version !== null) {
        useSync.setState({ code, version, lastSyncedAt: now(), status: 'idle', message: null })
        return null
      }
    }
    throw new Error('no free code')
  } catch (e) {
    fail(e)
    return failureText(e)
  }
}

/** Connects to a code from another device and merges both progresses. Returns an error message, or null. */
export async function joinSync(input: string): Promise<string | null> {
  const code = normalizeCode(input)
  if (!isValidCode(code)) return 'Kode harus 16 huruf dan angka, seperti ABCD-EFGH-JKLM-NPQR.'
  try {
    if (!(await pull(code))) return 'Kode ini tidak ditemukan. Periksa lagi hurufnya.'
  } catch (e) {
    return failureText(e)
  }
  useSync.setState({ code, version: 0, lastSyncedAt: null })
  await syncNow()
  const { status, message } = useSync.getState()
  return status === 'idle' ? null : message
}

/** Stops syncing on this device. Its progress stays, and the code keeps working elsewhere. */
export function disconnectSync() {
  useSync.setState({ code: null, version: 0, lastSyncedAt: null, status: 'idle', message: null })
}

/** Starts syncing in the background. Returns a function that stops it. */
export function startSync(): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  let pending = false
  const flush = () => {
    clearTimeout(timer)
    pending = false
    void syncNow()
  }
  const unsubscribe = useProgress.subscribe((s, prev) => {
    if (applying || !useSync.getState().code) return
    // The exam timer changes activeExam every second without stamping activeExamAt: that alone never syncs.
    if (!TRIGGER_KEYS.some((key) => s[key] !== prev[key])) return
    pending = true
    clearTimeout(timer)
    timer = setTimeout(flush, 3000)
  })
  // Hiding or closing the tab sends the remaining time of a running exam, even without other changes.
  const onVisibility = () => {
    if (document.visibilityState === 'visible' || pending || useProgress.getState().activeExam) flush()
  }
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('online', flush)
  flush()
  return () => {
    clearTimeout(timer)
    unsubscribe()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('online', flush)
  }
}
