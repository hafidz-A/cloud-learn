import { motion } from 'framer-motion'
import { useEffect, useEffectEvent } from 'react'
import { Button } from '../components/Button'
import { Mascot } from '../components/Mascot'

/** Confirms leaving a lesson halfway; nothing from the lesson is saved. */
export function ExitSheet({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) {
  const onKey = useEffectEvent((e: KeyboardEvent) => e.key === 'Escape' && onStay())
  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKey(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-tinta/40" onClick={onStay}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-title"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] rounded-t-3xl bg-white px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-6 text-center"
      >
        <Mascot mood="sedih" size={88} className="mx-auto" />
        <h2 id="exit-title" className="mt-3 font-display text-20 font-bold">
          Yakin mau berhenti?
        </h2>
        <p className="mt-1 text-15 text-tinta-lembut">Progres lesson ini belum tersimpan kalau kamu keluar sekarang.</p>
        <Button block className="mt-5" autoFocus onClick={onStay}>
          Lanjut belajar
        </Button>
        <Button variant="putih" block className="mt-3" onClick={onLeave}>
          Keluar
        </Button>
      </motion.div>
    </div>
  )
}
