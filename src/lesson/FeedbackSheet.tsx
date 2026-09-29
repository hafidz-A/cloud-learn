import { Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { Mascot } from '../components/Mascot'
import type { Verdict } from './types'

const PRAISE = ['Benar!', 'Mantap!', 'Tepat sekali!', 'Keren!']

/** Panel that slides up after "Periksa": mint when right, koral when wrong. */
export function FeedbackSheet({
  verdict,
  explanation,
  retryNext,
  onContinue,
  onHeight,
}: {
  verdict: Verdict
  explanation: string
  /** The exercise was queued again; say it comes back at the end of the lesson. */
  retryNext: boolean
  onContinue: () => void
  onHeight: (px: number) => void
}) {
  const [praise] = useState(() => PRAISE[Math.floor(Math.random() * PRAISE.length)])
  const ref = useRef<HTMLElement>(null)
  const ok = verdict.correct

  // Tell the player how tall the sheet is so the question can scroll above it.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => onHeight(el.offsetHeight))
    ro.observe(el)
    return () => {
      ro.disconnect()
      onHeight(0)
    }
  }, [onHeight])

  return (
    <motion.section
      ref={ref}
      aria-labelledby="feedback-title"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
      className={`fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[480px] rounded-t-3xl border-t-4 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-5 ${
        ok ? 'border-mint bg-mint-muda' : 'border-koral bg-koral-muda'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 id="feedback-title" className="flex items-center gap-2 font-display text-20 font-bold">
            <span
              aria-hidden="true"
              className={`flex h-8 w-8 items-center justify-center rounded-full ${ok ? 'bg-mint' : 'bg-koral'}`}
            >
              {ok ? <Check size={20} strokeWidth={3.5} /> : <X size={20} strokeWidth={3.5} />}
            </span>
            {ok ? praise : 'Kurang tepat'}
          </h2>
          {!ok && verdict.correctAnswer && (
            <p className="mt-2 text-15">
              <span className="font-bold">Jawaban benar: </span>
              <span lang="en">{verdict.correctAnswer}</span>
            </p>
          )}
          {verdict.note && <p className="mt-2 text-15">{verdict.note}</p>}
          <p className="mt-2 text-15">{explanation}</p>
          {retryNext && (
            <p className="mt-2 text-13 font-semibold text-tinta-lembut">Soal ini akan muncul lagi di akhir lesson.</p>
          )}
        </div>
        <Mascot mood={ok ? 'senang' : 'sedih'} size={64} className="shrink-0" />
      </div>
      <Button variant={ok ? 'mint' : 'koral'} block className="mt-4" autoFocus onClick={onContinue}>
        Lanjut
      </Button>
    </motion.section>
  )
}
