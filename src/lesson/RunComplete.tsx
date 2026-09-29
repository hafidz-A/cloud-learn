import { Clock, Target, Trophy, Zap } from 'lucide-react'
import { animate, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { Mascot, type Mood } from '../components/Mascot'
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

export type StatKind = 'xp' | 'accuracy' | 'time' | 'score'

const STAT_STYLE: Record<StatKind, { strip: string; border: string; icon: ReactNode }> = {
  xp: { strip: 'bg-matahari text-tinta', border: 'border-matahari', icon: <Zap size={22} className="fill-matahari text-matahari-dalam" aria-hidden="true" /> },
  accuracy: { strip: 'bg-mint text-tinta', border: 'border-mint', icon: <Target size={22} className="text-mint-dalam" aria-hidden="true" /> },
  score: { strip: 'bg-mint text-tinta', border: 'border-mint', icon: <Trophy size={22} className="text-mint-dalam" aria-hidden="true" /> },
  time: { strip: 'bg-biru-dalam text-white', border: 'border-biru-dalam', icon: <Clock size={22} className="text-biru-dalam" aria-hidden="true" /> },
}

export type RunCompleteProps = {
  heading: string
  subtitle: string
  mood: Mood
  /** The one big celebration; off for a failed checkpoint. */
  celebrate: boolean
  xp: number
  stats: { kind: StatKind; label: string; value: string }[]
  note: string
  primary: { label: string; onClick: () => void }
  secondary?: { label: string; onClick: () => void }
}

/** Finish screen for lessons, practice, and checkpoints. */
export function RunComplete({ heading, subtitle, mood, celebrate, xp, stats, note, primary, secondary }: RunCompleteProps) {
  const reduceMotion = useReducedMotion()
  const [xpShown, setXpShown] = useState(reduceMotion || !celebrate ? xp : 0)

  useEffect(() => {
    if (reduceMotion || !celebrate) return
    const controls = animate(0, xp, { duration: 0.9, delay: 0.3, onUpdate: (v) => setXpShown(Math.round(v)) })
    return () => controls.stop()
  }, [reduceMotion, celebrate, xp])

  return (
    <main className="flex min-h-dvh flex-col items-center px-4 pb-44 pt-[calc(48px+env(safe-area-inset-top))] text-center">
      <div className="relative">
        {celebrate && !reduceMotion && <Confetti />}
        <motion.div
          initial={celebrate ? { scale: 0.6, opacity: 0 } : false}
          animate={celebrate ? { scale: 1, opacity: 1, y: [0, -14, 0, -8, 0] } : undefined}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
          <Mascot mood={mood} size={168} />
        </motion.div>
      </div>

      <h1 className="mt-6 font-display text-28 font-bold">{heading}</h1>
      <p className="mt-1 text-17 text-tinta-lembut">{subtitle}</p>

      <div className={`mt-8 grid w-full gap-3`} style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
        {stats.map((st) => {
          const style = STAT_STYLE[st.kind]
          return (
            <div key={st.label} className={`overflow-hidden rounded-2xl border-2 bg-white ${style.border}`}>
              <p className={`py-1 font-display text-13 font-bold ${style.strip}`}>{st.label}</p>
              <p className="flex items-center justify-center gap-1.5 py-3 font-display text-20 font-bold">
                {style.icon}
                {st.kind === 'xp' ? (
                  <span role="img" aria-label={`${xp} XP`}>
                    +{xpShown}
                  </span>
                ) : (
                  st.value
                )}
              </p>
            </div>
          )
        })}
      </div>

      <p className="mt-6 text-15 text-tinta-lembut">{note}</p>

      <LessonFooter>
        <Button block autoFocus onClick={primary.onClick}>
          {primary.label}
        </Button>
        {secondary && (
          <Button variant="putih" block className="mt-3" onClick={secondary.onClick}>
            {secondary.label}
          </Button>
        )}
      </LessonFooter>
    </main>
  )
}
