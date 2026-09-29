import { BookOpen, RotateCcw, Sparkles, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ProgressBar } from '../components/ProgressBar'
import { isExercise, materialFor } from '../content/course'
import { blockBack, leaveFlow } from '../lib/router'
import { sound } from '../lib/sound'
import { useProgress } from '../store/progress'
import { ExerciseView } from './ExerciseView'
import { ExitSheet } from './ExitSheet'
import { FeedbackSheet } from './FeedbackSheet'
import { HeartsCounter } from './HeartsCounter'
import { IntroView } from './IntroView'
import { LearnView } from './LearnView'
import { MaterialSheet } from './MaterialSheet'
import { OutOfHearts } from './OutOfHearts'
import { RunComplete, type RunCompleteProps } from './RunComplete'
import {
  advance,
  answerCurrent,
  currentEntry,
  firstTryResults,
  isFirstAttempt,
  progressOf,
  readCard,
  startSession,
  type Session,
  type SessionItem,
} from './session'
import type { TeachingCard } from '../lib/types'
import type { Verdict } from './types'

export type RunKind = 'lesson' | 'practice' | 'checkpoint'

export type RunPlan = {
  kind: RunKind
  title: string
  items: SessionItem[]
}

/**
 * Rules per kind:
 * - lesson:     learn cards, wrong answers come back at the end, every miss costs a heart
 * - practice:   wrong answers come back, every first-try right answer earns a heart back
 * - checkpoint: no retries and no hearts; the first-try score decides
 */
const RULES: Record<RunKind, { retryWrong: boolean; hearts: 'lose' | 'gain' | 'none' }> = {
  lesson: { retryWrong: true, hearts: 'lose' },
  practice: { retryWrong: true, hearts: 'gain' },
  checkpoint: { retryWrong: false, hearts: 'none' },
}

function Badge({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-1.5 self-start rounded-lg bg-koral-muda px-2 py-1 font-display text-13 font-semibold">
      {icon}
      {children}
    </p>
  )
}

/** Plays a lesson, practice session, or checkpoint, then shows the finish screen from `onFinish`. */
export function Player({
  plan,
  onFinish,
}: {
  plan: RunPlan
  /** Saves the result and returns what the finish screen shows. `results` are first attempts per exercise. */
  onFinish: (results: boolean[], durationMs: number) => RunCompleteProps
}) {
  const rules = RULES[plan.kind]
  const recordAnswer = useProgress((s) => s.recordAnswer)
  const recordReview = useProgress((s) => s.recordReview)
  const loseHeart = useProgress((s) => s.loseHeart)
  const gainHeart = useProgress((s) => s.gainHeart)
  const heartsLeft = useProgress((s) => (s.heartsEnabled ? s.hearts : Infinity))

  const [startedAt] = useState(() => Date.now())
  const [session, setSession] = useState(() => startSession(plan.items, { retryWrong: rules.retryWrong }))
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [finished, setFinished] = useState<RunCompleteProps | null>(null)
  const [confirmExit, setConfirmExit] = useState(false)
  // Learn cards reopened from a question ("Lihat materi" or "Pelajari lagi").
  const [material, setMaterial] = useState<TeachingCard[] | null>(null)
  const materialOpen = useRef(false)
  useEffect(() => {
    materialOpen.current = material !== null
  }, [material])
  const [sheetHeight, setSheetHeight] = useState(0)
  const onSheetHeight = useCallback((px: number) => setSheetHeight(px), [])

  // A lesson cannot start or go on without hearts.
  const outOfHearts = rules.hearts === 'lose' && heartsLeft <= 0 && !verdict

  // Once something was answered, the back button asks first, like the close button.
  // Pressing back again while the question is open closes it.
  const started = Object.keys(session.firstTry).length > 0 || session.pos > 0
  const holdBack = started && !finished && !outOfHearts
  // While the material sheet is open, back closes it instead.
  useEffect(
    () =>
      holdBack
        ? blockBack(() => (materialOpen.current ? setMaterial(null) : setConfirmExit((open) => !open)))
        : undefined,
    [holdBack],
  )

  const current = finished ? undefined : currentEntry(session)?.item
  const cardsForItem = useMemo(() => (current && isExercise(current) ? materialFor(current) : []), [current])

  if (finished) return <RunComplete {...finished} />
  if (outOfHearts) return <OutOfHearts />

  const entry = currentEntry(session)
  const { item } = entry
  const handleVerdict = (v: Verdict) => {
    if (verdict || !isExercise(item)) return
    if (isFirstAttempt(session)) {
      // Stats and the review queue count first attempts only.
      if (entry.fromReview) recordReview(item.id, item.concept, v.correct)
      else recordAnswer(item.id, item.concept, v.correct)
      if (v.correct && rules.hearts === 'gain') gainHeart()
    }
    if (!v.correct && rules.hearts === 'lose') loseHeart()
    if (v.correct) sound.correct()
    else sound.wrong()
    setVerdict(v)
    setSession((s) => answerCurrent(s, v.correct))
  }

  const goNext = (from: Session) => {
    window.scrollTo({ top: 0 })
    const next = advance(from)
    if (next) {
      setSession(next)
      setVerdict(null)
      return
    }
    const done = onFinish(firstTryResults(from), Date.now() - startedAt)
    if (done.celebrate) sound.complete()
    setFinished(done)
  }

  const handleClose = () => (started ? setConfirmExit(true) : leaveFlow())

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-20 flex items-center gap-3 bg-langit pb-2 pl-2 pr-4 pt-[calc(8px+env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={handleClose}
          aria-label={`Keluar dari ${plan.title}`}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-tinta-lembut"
        >
          <X size={28} strokeWidth={2.75} />
        </button>
        <ProgressBar value={progressOf(session)} label={`Progres ${plan.title}`} />
        {rules.hearts === 'none' ? (
          <span className="shrink-0 font-display text-15 font-semibold text-tinta-lembut">
            {Math.min(session.pos + 1, session.totalItems)}/{session.totalItems}
          </span>
        ) : (
          <HeartsCounter />
        )}
      </div>

      <main
        className="flex flex-1 flex-col px-4 pt-4"
        style={{ paddingBottom: Math.max(128, sheetHeight + 24) }}
        data-run={plan.kind}
        data-step={session.pos}
        data-item-id={item.id}
        data-item-type={item.type}
        data-retry={entry.retry || undefined}
      >
        {entry.retry && <Badge icon={<RotateCcw size={14} strokeWidth={2.75} aria-hidden="true" />}>Soal yang tadi salah</Badge>}
        {!entry.retry && entry.refresher && (
          <Badge icon={<Sparkles size={14} strokeWidth={2.75} aria-hidden="true" />}>Ulangan dari lesson sebelumnya</Badge>
        )}
        {isExercise(item) && cardsForItem.length > 0 && (
          <button
            type="button"
            onClick={() => setMaterial(cardsForItem)}
            className="mb-3 flex min-h-11 cursor-pointer items-center gap-1.5 self-start rounded-xl border-2 border-kabut bg-white px-3 font-display text-13 font-semibold"
          >
            <BookOpen size={16} aria-hidden="true" />
            Lihat materi
          </button>
        )}
        {item.type === 'learn' ? (
          <LearnView key={entry.key} card={item} onDone={() => goNext(readCard(session))} />
        ) : item.type === 'intro' ? (
          <IntroView key={entry.key} intro={item} onDone={() => goNext(readCard(session))} />
        ) : (
          <ExerciseView key={entry.key} exercise={item} answered={verdict !== null} onVerdict={handleVerdict} />
        )}
      </main>

      <p className="sr-only" aria-live="assertive">
        {verdict && isExercise(item) ? `${verdict.correct ? 'Benar' : 'Kurang tepat'}. ${item.explanation}` : ''}
      </p>

      {verdict && isExercise(item) && (
        <FeedbackSheet
          key={entry.key}
          verdict={verdict}
          explanation={item.explanation}
          retryNext={!verdict.correct && rules.retryWrong}
          material={cardsForItem.slice(0, 2)}
          onOpenMaterial={(card) => setMaterial([card])}
          onContinue={() => goNext(session)}
          onHeight={onSheetHeight}
        />
      )}

      {material && <MaterialSheet cards={material} onClose={() => setMaterial(null)} />}
      {confirmExit && <ExitSheet onStay={() => setConfirmExit(false)} onLeave={() => leaveFlow()} />}
    </div>
  )
}
