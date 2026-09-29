import { CloudCheck, CloudOff, Copy, LoaderCircle, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/Button'
import { dayKey } from '../lib/date'
import { createSync, disconnectSync, formatCode, joinSync, syncNow, useSync } from '../sync/sync'

function lastSyncedText(iso: string | null): string {
  if (!iso) return 'Belum pernah disinkron.'
  const d = new Date(iso)
  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  if (dayKey(d) === dayKey()) return `Tersinkron, terakhir pukul ${time}.`
  return `Tersinkron, terakhir ${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} pukul ${time}.`
}

const STATUS_LOOKS = {
  syncing: { Icon: LoaderCircle, tone: 'bg-langit', spin: true },
  offline: { Icon: CloudOff, tone: 'bg-matahari-muda', spin: false },
  error: { Icon: TriangleAlert, tone: 'bg-koral-muda', spin: false },
  idle: { Icon: CloudCheck, tone: 'bg-mint-muda', spin: false },
}

function StatusLine() {
  const { status, message, lastSyncedAt } = useSync()
  const { Icon, tone, spin } = STATUS_LOOKS[status]
  const text =
    status === 'syncing'
      ? 'Menyinkronkan...'
      : status === 'offline'
        ? 'Offline. Progres disinkron lagi saat ada internet.'
        : status === 'error'
          ? (message ?? 'Sinkron gagal.')
          : lastSyncedText(lastSyncedAt)
  return (
    <p role="status" className={`mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-15 ${tone}`}>
      <Icon size={18} aria-hidden="true" className={`mt-0.5 shrink-0 ${spin ? 'animate-spin motion-reduce:animate-none' : ''}`} />
      {text}
    </p>
  )
}

function Connected({ code }: { code: string }) {
  const syncing = useSync((s) => s.status === 'syncing')
  const [copied, setCopied] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(formatCode(code))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <StatusLine />
      <p className="mt-4 text-13 font-semibold text-tinta-lembut">Kode sinkron</p>
      <div className="mt-1 flex items-center gap-2">
        <p className="min-w-0 flex-1 rounded-xl bg-langit px-3 py-2 font-mono text-17 font-bold tracking-wider" aria-label={`Kode sinkron ${formatCode(code).split('').join(' ')}`}>
          {formatCode(code)}
        </p>
        <button
          type="button"
          onClick={copy}
          className="flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border-2 border-kabut bg-white px-3 font-display text-15 font-semibold"
        >
          <Copy size={16} aria-hidden="true" />
          {copied ? 'Tersalin' : 'Salin'}
        </button>
      </div>
      <p className="mt-2 text-15 text-tinta-lembut">
        Di perangkat lain, buka Pengaturan, pilih <span className="font-semibold text-tinta">Saya sudah punya kode</span>, lalu masukkan
        kode ini. Catat kodenya di tempat aman: siapa pun yang tahu kode ini bisa melihat dan mengubah progresmu.
      </p>
      <Button block className="mt-4" disabled={syncing} onClick={() => void syncNow()}>
        Sinkronkan sekarang
      </Button>
      {confirming ? (
        <div className="mt-3 rounded-xl bg-langit p-3">
          <p className="text-15">Perangkat ini berhenti sinkron. Progresnya tetap ada, dan kodenya masih bisa dipakai lagi nanti.</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button variant="putih" onClick={() => setConfirming(false)}>
              Batal
            </Button>
            <Button
              variant="koral"
              onClick={() => {
                disconnectSync()
                setConfirming(false)
              }}
            >
              Putuskan
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="putih" block className="mt-3" onClick={() => setConfirming(true)}>
          Putuskan sinkron
        </Button>
      )}
    </>
  )
}

function NotConnected() {
  const [joining, setJoining] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async (action: () => Promise<string | null>) => {
    setBusy(true)
    setError(null)
    setError(await action())
    setBusy(false)
  }

  return (
    <>
      <p className="mt-1 text-15 text-tinta-lembut">
        Simpan progres di server supaya sama di HP dan PC, dan tetap aman kalau HP hilang. Tidak perlu akun.
      </p>
      {joining ? (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault()
            void run(() => joinSync(input))
          }}
        >
          <label className="block">
            <span className="text-13 font-semibold text-tinta-lembut">Kode dari perangkat lain</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ABCD-EFGH-JKLM-NPQR"
              autoComplete="off"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              className="mt-1 block min-h-12 w-full rounded-2xl border-2 border-kabut bg-white px-3 font-mono text-17 font-bold tracking-wider uppercase outline-none placeholder:font-normal placeholder:text-tinta-lembut focus:border-biru"
            />
          </label>
          <Button type="submit" block className="mt-3" disabled={busy || !input.trim()}>
            {busy ? 'Menyambungkan...' : 'Sambungkan'}
          </Button>
          <Button variant="putih" block className="mt-3" disabled={busy} onClick={() => setJoining(false)}>
            Batal
          </Button>
        </form>
      ) : (
        <>
          <Button block className="mt-4" disabled={busy} onClick={() => void run(createSync)}>
            {busy ? 'Membuat kode...' : 'Buat kode sinkron'}
          </Button>
          <Button variant="putih" block className="mt-3" disabled={busy} onClick={() => setJoining(true)}>
            Saya sudah punya kode
          </Button>
        </>
      )}
      {error && (
        <p role="alert" className="mt-3 flex items-start gap-2 rounded-xl bg-koral-muda px-3 py-2 text-15">
          <TriangleAlert size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </>
  )
}

/** Content of the "Sinkron HP dan PC" card in Settings (plan stage 8). */
export function SyncSection() {
  const code = useSync((s) => s.code)
  return code ? <Connected code={code} /> : <NotConnected />
}
