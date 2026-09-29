import { Clock, Target, Zap } from 'lucide-react'
import { animate, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { Mascot } from '../components/Mascot'
import { formatDuration } from '../lib/date'
import { leaveLesson } from '../lib/router'
import { XP_FLAWLESS_BONUS, type LessonSummary } from '../lib/scoring'
import { LessonFooter } from './LessonFooter'

const CONFETTI_COLORS = ['var(--color-matahari)', 'var(--color-biru)', 'var(--color-mint)', 'var(--color-koral)']

/** Burst of small shapes behind the mascot. Skipped entirely for reduced motion. */
function Confetti() {
  const pieces = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2
    const distance = 110 + (i % 3) * 30
    return { i, x: Math.cos(angle) * distance, y: Math.sin(angle) * distance * 0.8, round: i % 2 === 0 }
  })
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2">
      {pieces.map((p) => (
        <motion.span
          key={p.i}
          className={`absolute h-3 w-3 ${p.round ? 'rounded-full' : 'rounded-sm'}`}
          style={{ background: CONFETTI_COLORS[p.i % CONFETTI_COLORS.length] }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, scale: 1, opacity: [1, 1, 0], rotate: 180 }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: 0.15 + (p.i % 4) * 0.04, opacity: { times: [0, 0.65, 1], duration: 1.6 } }}
        />
      ))}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  strip,
  border,
}: {
  label: string
  value: ReactNode
  icon: ReactNode
  strip: string
  border: string
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border-2 bg-white ${border}`}>
      <p className={`py-1 font-display text-13 font-bold ${strip}`}>{label}</p>
      <p className="flex items-center justify-center gap-1.5 py-3 font-display text-20 font-bold">
        {icon}
        {value}
      </p>
    </div>
  )
}

/** The one big celebration: XP earned, accuracy, and time. */
export function LessonComplete({ summary, lessonTitle }: { summary: LessonSummary; lessonTitle: string }) {
  const reduceMotion = useReducedMotion()
  const [xpShown, setXpShown] = useState(reduceMotion ? summary.xp : 0)
  const flawless = summary.correct === summary.total

  useEffect(() => {
    if (reduceMotion) return
    const controls = animate(0, summary.xp, {
      duration: 0.9,
      delay: 0.3,
      onUpdate: (v) => setXpShown(Math.round(v)),
    })
    return () => controls.stop()
  }, [reduceMotion, summary.xp])

  return (
    <main className="flex min-h-dvh flex-col items-center px-4 pb-36 pt-[calc(48px+env(safe-area-inset-top))] text-center">
      <div className="relative">
        {!reduceMotion && <Confetti />}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -14, 0, -8, 0] }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
          <Mascot mood="gembira" size={168} />
        </motion.div>
      </div>

      <h1 className="mt-6 font-display text-28 font-bold">Lesson selesai!</h1>
      <p className="mt-1 text-17 text-tinta-lembut">{lessonTitle}</p>

      <div className="mt-8 grid w-full grid-cols-3 gap-3">
        <StatCard
          label="XP"
          value={<span aria-label={`${summary.xp} XP`}>+{xpShown}</span>}
          icon={<Zap size={22} className="fill-matahari text-matahari-dalam" aria-hidden="true" />}
          strip="bg-matahari text-tinta"
          border="border-matahari"
        />
        <StatCard
          label="Akurasi"
          value={`${Math.round(summary.accuracy * 100)}%`}
          icon={<Target size={22} className="text-mint-dalam" aria-hidden="true" />}
          strip="bg-mint text-tinta"
          border="border-mint"
        />
        <StatCard
          label="Waktu"
          value={formatDuration(summary.durationMs)}
          icon={<Clock size={22} className="text-biru-dalam" aria-hidden="true" />}
          strip="bg-biru-dalam text-white"
          border="border-biru-dalam"
        />
      </div>

      <p className="mt-6 text-15 text-tinta-lembut">
        {flawless
          ? `Tanpa kesalahan! Termasuk bonus +${XP_FLAWLESS_BONUS} XP.`
          : `${summary.correct} dari ${summary.total} soal benar di percobaan pertama.`}
      </p>

      <LessonFooter>
        <Button block autoFocus onClick={leaveLesson}>
          Lanjut
        </Button>
      </LessonFooter>
    </main>
  )
}
