import { useState } from 'react'
import { Button } from '../components/Button'
import { useProgress } from '../store/progress'
import { ComingSoonScreen } from './ComingSoonScreen'

export function SettingsScreen() {
  const resetProgress = useProgress((s) => s.resetProgress)
  const [confirming, setConfirming] = useState(false)

  return (
    <ComingSoonScreen title="Pengaturan" note="Target harian, hearts, dan suara bisa diatur di sini mulai tahap 4.">
      <section className="mt-6 rounded-2xl border-2 border-kabut bg-white p-4 shadow-[0_4px_0_var(--color-kabut)]">
        <h2 className="font-display text-17 font-bold">Reset progres</h2>
        <p className="mt-1 text-15 text-tinta-lembut">Hapus XP dan semua lesson yang sudah selesai di perangkat ini.</p>
        {confirming ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="putih" onClick={() => setConfirming(false)}>
              Batal
            </Button>
            <Button
              variant="koral"
              onClick={() => {
                resetProgress()
                setConfirming(false)
              }}
            >
              Reset
            </Button>
          </div>
        ) : (
          <Button variant="putih" block className="mt-4" onClick={() => setConfirming(true)}>
            Reset progres
          </Button>
        )}
      </section>
    </ComingSoonScreen>
  )
}
