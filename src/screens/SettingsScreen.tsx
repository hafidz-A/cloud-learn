import { useState, type CSSProperties, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { Toggle } from '../components/Toggle'
import type { DailyGoal } from '../lib/types'
import { useProgress } from '../store/progress'

const GOALS: { value: DailyGoal; label: string }[] = [
  { value: 20, label: 'Santai' },
  { value: 50, label: 'Rutin' },
  { value: 100, label: 'Serius' },
]

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border-2 border-kabut bg-white p-4 shadow-[0_4px_0_var(--color-kabut)]">
      <h2 className="font-display text-17 font-bold">{title}</h2>
      {children}
    </section>
  )
}

function SwitchRow({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (on: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-display text-17 font-bold">{label}</p>
        <p className="text-15 text-tinta-lembut">{hint}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  )
}

export function SettingsScreen() {
  const s = useProgress()
  const [confirming, setConfirming] = useState(false)

  return (
    <main className="space-y-5 px-4 pb-32 pt-6">
      <h1 className="font-display text-28 font-bold">Pengaturan</h1>

      <Card title="Target harian">
        <p className="mt-1 text-15 text-tinta-lembut">Berapa XP yang mau kamu kumpulkan setiap hari? Satu lesson = 10–15 XP.</p>
        <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Target harian">
          {GOALS.map((g) => {
            const on = s.dailyGoal === g.value
            return (
              <button
                key={g.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => s.setDailyGoal(g.value)}
                className={`btn-3d min-h-16 cursor-pointer rounded-2xl border-2 px-2 py-2 ${on ? 'border-biru bg-biru-muda' : 'border-kabut bg-white'}`}
                style={{ '--edge': on ? 'var(--color-biru)' : 'var(--color-kabut)' } as CSSProperties}
              >
                <span className="block font-display text-20 font-bold">{g.value} XP</span>
                <span className="block text-13 text-tinta-lembut">{g.label}</span>
              </button>
            )
          })}
        </div>
      </Card>

      <Card title="Permainan">
        <div className="mt-3 space-y-4">
          <SwitchRow
            label="Hearts"
            hint="5 nyawa, berkurang saat salah. Matikan kalau terasa menghambat."
            checked={s.heartsEnabled}
            onChange={s.setHeartsEnabled}
          />
          <SwitchRow label="Suara" hint="Bunyi pendek saat benar, salah, dan lesson selesai." checked={s.soundEnabled} onChange={s.setSoundEnabled} />
        </div>
      </Card>

      <Card title="Reset progres">
        <p className="mt-1 text-15 text-tinta-lembut">
          Hapus XP, streak, lesson yang sudah selesai, antrean latihan, dan riwayat ujian di perangkat ini. Tidak bisa dibatalkan.
        </p>
        {confirming ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="putih" onClick={() => setConfirming(false)}>
              Batal
            </Button>
            <Button
              variant="koral"
              onClick={() => {
                s.resetProgress()
                setConfirming(false)
              }}
            >
              Ya, reset
            </Button>
          </div>
        ) : (
          <Button variant="putih" block className="mt-4" onClick={() => setConfirming(true)}>
            Reset progres
          </Button>
        )}
      </Card>
    </main>
  )
}
