import { BookOpen, Check, Crown, Lock, Star, Trophy } from 'lucide-react'
import { useEffect, useEffectEvent, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { COURSES, courseOf, unitNumber, type Checkpoint } from '../content/course'
import { pathStates, type NodeState } from '../lib/path'
import { navigate } from '../lib/router'
import { CHECKPOINT_PASS, XP_CHECKPOINT, XP_PER_LESSON } from '../lib/scoring'
import type { CourseId, Lesson, Unit } from '../lib/types'
import { useCourseProgress } from '../store/progress'

const NODE_LOOK: Record<NodeState, { className: string; edge: string }> = {
  done: { className: 'bg-matahari text-tinta', edge: 'var(--color-matahari-dalam)' },
  active: { className: 'bg-biru text-white', edge: 'var(--color-biru-dalam)' },
  open: { className: 'bg-biru text-white', edge: 'var(--color-biru-dalam)' },
  locked: { className: 'bg-kabut text-tinta-lembut', edge: 'var(--color-kabut-dalam)' },
  soon: { className: 'bg-kabut text-tinta-lembut', edge: 'var(--color-kabut-dalam)' },
}

const STATE_LABEL: Record<NodeState, string> = {
  done: 'selesai',
  active: 'lesson berikutnya',
  open: 'bisa dimainkan',
  locked: 'terkunci',
  soon: 'segera hadir',
}

/** Horizontal offset in px for the winding path. Alternates direction per unit. */
function offsetFor(lessonIndex: number, unitIndex: number): number {
  const direction = unitIndex % 2 === 0 ? 1 : -1
  return Math.round(Math.sin((lessonIndex * Math.PI) / 2.5) * 70) * direction
}

type Selected = { kind: 'lesson' | 'checkpoint'; id: string } | null

function Popover({ offset, onClose, children }: { offset: number; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const close = useEffectEvent(onClose)

  useEffect(() => {
    ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    const onPointer = (e: PointerEvent) => {
      // Taps on another node are handled by that node's own click.
      if (!ref.current?.contains(e.target as Node) && !(e.target as Element).closest('[data-node]')) close()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div
      ref={ref}
      role="dialog"
      className="absolute inset-x-4 top-full z-10 mt-3 scroll-mb-28 rounded-2xl border-2 border-kabut bg-white p-4 text-left shadow-[0_4px_0_var(--color-kabut)]"
    >
      <span
        aria-hidden="true"
        className="absolute -top-[9px] h-4 w-4 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-kabut bg-white"
        style={{ left: `calc(50% + ${offset}px)` }}
      />
      {children}
    </div>
  )
}

function StartBubble({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border-2 border-kabut bg-white px-3 py-1 font-display text-15 font-bold text-biru-dalam"
    >
      {label}
      <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-kabut bg-white" />
    </div>
  )
}

function LessonNode({
  unit,
  unitIndex,
  lesson,
  lessonIndex,
  state,
  pathOpen,
  selected,
  onSelect,
}: {
  unit: Unit
  unitIndex: number
  lesson: Lesson
  lessonIndex: number
  state: NodeState
  pathOpen: boolean
  selected: boolean
  onSelect: (open: boolean) => void
}) {
  const done = useCourseProgress(courseOf(lesson.id)).lessonsDone[lesson.id]
  const look = NODE_LOOK[state]
  const offset = offsetFor(lessonIndex, unitIndex)
  const Icon = state === 'done' ? Check : state === 'locked' || state === 'soon' ? Lock : Star
  const start = () => navigate({ name: 'lesson', lessonId: lesson.id })

  return (
    <li className={`relative flex justify-center pb-2 ${state === 'active' ? 'pt-12' : 'pt-2'}`}>
      <div style={{ transform: `translateX(${offset}px)` }}>
        <div className={`relative ${state === 'active' ? 'motion-safe:animate-bob' : ''}`}>
          {state === 'active' && <StartBubble label="Mulai" />}
          <button
            type="button"
            data-node={lesson.id}
            data-node-state={state}
            aria-expanded={selected}
            aria-label={`${lesson.title}, lesson ${lessonIndex + 1} unit ${unitNumber(unit)}, ${STATE_LABEL[state]}`}
            onClick={() => onSelect(!selected)}
            className={`btn-3d flex h-[72px] w-[72px] cursor-pointer items-center justify-center rounded-full ${look.className}`}
            style={{ '--edge': look.edge, '--depth': '6px' } as CSSProperties}
          >
            <Icon size={32} strokeWidth={3} className={state === 'active' || state === 'open' ? 'fill-white' : ''} />
          </button>
        </div>
      </div>

      {selected && (
        <Popover offset={offset} onClose={() => onSelect(false)}>
          <p className="font-display text-20 font-bold">{lesson.title}</p>
          <p className="mt-0.5 text-13 text-tinta-lembut">
            Unit {unitNumber(unit)} · Lesson {lessonIndex + 1} dari {unit.lessons.length}
          </p>
          {state === 'soon' && <p className="mt-3 text-15 text-tinta-lembut">Soal untuk lesson ini sedang disiapkan.</p>}
          {state === 'locked' && (
            <p className="mt-3 text-15 text-tinta-lembut">
              {pathOpen
                ? 'Selesaikan lesson sebelumnya dulu untuk membuka lesson ini.'
                : 'Lulus checkpoint jalur sebelumnya dulu untuk membuka jalur ini.'}
            </p>
          )}
          {(state === 'active' || state === 'open') && (
            <Button block className="mt-4" onClick={start}>
              Mulai · +{XP_PER_LESSON} XP
            </Button>
          )}
          {state === 'done' && done && (
            <>
              <p className="mt-2 text-15">
                Akurasi terbaik {Math.round(done.bestAccuracy * 100)}% · selesai {done.count}×
              </p>
              <Button block className="mt-4" onClick={start}>
                Ulangi
              </Button>
            </>
          )}
        </Popover>
      )}
    </li>
  )
}

function CheckpointNode({
  checkpoint,
  state,
  lessonsLeft,
  selected,
  onSelect,
}: {
  checkpoint: Checkpoint
  state: NodeState
  lessonsLeft: number
  selected: boolean
  onSelect: (open: boolean) => void
}) {
  const result = useCourseProgress(courseOf(checkpoint.id)).checkpoints[checkpoint.id]
  const look = NODE_LOOK[state]
  const start = () => navigate({ name: 'checkpoint', checkpointId: checkpoint.id })
  return (
    <li className={`relative flex justify-center pb-2 ${state === 'active' ? 'pt-14' : 'pt-4'}`}>
      <div className={`relative ${state === 'active' ? 'motion-safe:animate-bob' : ''}`}>
        {state === 'active' && <StartBubble label="Saatnya checkpoint" />}
        <button
          type="button"
          data-node={checkpoint.id}
          data-node-state={state}
          aria-expanded={selected}
          aria-label={`${checkpoint.title}, ${STATE_LABEL[state]}`}
          onClick={() => onSelect(!selected)}
          className={`btn-3d flex min-h-[76px] cursor-pointer items-center justify-center gap-3 whitespace-nowrap rounded-3xl px-7 font-display text-20 font-bold ${look.className}`}
          style={{ '--edge': look.edge, '--depth': '6px' } as CSSProperties}
        >
          {state === 'locked' || state === 'soon' ? <Lock size={28} strokeWidth={2.5} /> : <Trophy size={30} strokeWidth={2.5} />}
          {checkpoint.title}
        </button>
      </div>
      {selected && (
        <Popover offset={0} onClose={() => onSelect(false)}>
          <p className="font-display text-20 font-bold">{checkpoint.title}</p>
          <p className="mt-2 text-15">
            {checkpoint.questionCount} soal campuran dari seluruh jalur {checkpoint.path}. Skor minimal{' '}
            {Math.round(CHECKPOINT_PASS * 100)}% untuk membuka jalur berikutnya.
          </p>
          {state === 'soon' ? (
            <p className="mt-2 text-15 text-tinta-lembut">Soal untuk jalur ini sedang disiapkan.</p>
          ) : state === 'locked' ? (
            <p className="mt-2 text-15 text-tinta-lembut">Buka jalur ini dulu lewat checkpoint sebelumnya.</p>
          ) : (
            <>
              {result && <p className="mt-2 text-15">Skor terbaik {Math.round(result.bestScore * 100)}%</p>}
              {state !== 'done' && lessonsLeft > 0 && (
                <p className="mt-2 text-13 text-tinta-lembut">
                  Masih ada {lessonsLeft} lesson di jalur ini. Kalau lulus sekarang, kamu langsung lompat ke jalur berikutnya.
                </p>
              )}
              <Button block className="mt-4" onClick={start}>
                {state === 'done' ? 'Ulangi checkpoint' : `Mulai checkpoint · +${XP_CHECKPOINT} XP`}
              </Button>
            </>
          )}
        </Popover>
      )}
    </li>
  )
}

function UnitCard({ unit }: { unit: Unit }) {
  const { lessonsDone, unitLevel } = useCourseProgress(courseOf(unit.id))
  const level = unitLevel[unit.id] ?? 0
  const done = unit.lessons.filter((l) => lessonsDone[l.id]).length
  return (
    <div className="mx-4 mb-4 mt-6 rounded-2xl border-2 border-kabut bg-white px-4 py-3 shadow-[0_4px_0_var(--color-kabut)]">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-13 font-semibold text-biru-dalam">
          Unit {unitNumber(unit)}
          <span className="font-normal text-tinta-lembut">
            {' '}
            · {done}/{unit.lessons.length} lesson
          </span>
        </p>
        <p
          role="img"
          className="flex items-center gap-1 font-display text-13 font-bold"
          aria-label={`Level unit ${level} dari 3`}
          title="Level naik setiap kali semua lesson di unit ini diulang"
        >
          <Crown size={16} className={level > 0 ? 'fill-matahari text-matahari-dalam' : 'text-tinta-lembut'} aria-hidden="true" />
          <span aria-hidden="true">{level}/3</span>
        </p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="min-w-0 font-display text-20 font-bold">{unit.title}</h2>
        <button
          type="button"
          onClick={() => navigate({ name: 'guide', unitId: unit.id })}
          aria-label={`Panduan unit ${unitNumber(unit)}: ${unit.title}`}
          className="flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border-2 border-kabut bg-white px-3 font-display text-13 font-semibold"
        >
          <BookOpen size={16} aria-hidden="true" className="text-biru-dalam" />
          Panduan
        </button>
      </div>
    </div>
  )
}

/** The vertical, winding path of one course's lessons and checkpoints on the home screen. */
export function PathMap({ course }: { course: CourseId }) {
  const { paths: PATHS, units: UNITS, checkpoints: CHECKPOINTS } = COURSES[course]
  const { lessonsDone, checkpoints: checkpointResults } = useCourseProgress(course)
  const states = useMemo(
    () => pathStates(course, { lessonsDone, checkpoints: checkpointResults }),
    [course, lessonsDone, checkpointResults],
  )
  const [selected, setSelected] = useState<Selected>(null)

  useEffect(() => {
    // Open on the next lesson, or on the last finished one when nothing is next.
    const target =
      document.querySelector('[data-node-state="active"]') ??
      [...document.querySelectorAll('[data-node-state="done"]')].at(-1)
    target?.scrollIntoView({ block: 'center' })
  }, [])

  const select = (kind: 'lesson' | 'checkpoint', id: string) => (open: boolean) => setSelected(open ? { kind, id } : null)

  return (
    <div className="pb-32">
      {PATHS.map((path) => {
        const checkpoint = CHECKPOINTS.find((c) => c.path === path.id)!
        const pathUnits = UNITS.filter((u) => u.path === path.id)
        const lessonsLeft = pathUnits.flatMap((u) => u.lessons).filter((l) => !lessonsDone[l.id]).length
        return (
          <section key={path.id} aria-labelledby={`path-${path.id}`}>
            <div className="mx-4 mt-8 flex items-center gap-3">
              <span className="h-0.5 flex-1 rounded-full bg-kabut" />
              <h2 id={`path-${path.id}`} className="flex items-center gap-1.5 font-display text-15 font-semibold text-tinta-lembut">
                {!states.pathOpen[path.id] && <Lock size={14} aria-label="terkunci" />}
                Jalur {path.id} · {path.title}
              </h2>
              <span className="h-0.5 flex-1 rounded-full bg-kabut" />
            </div>

            {pathUnits.map((unit) => {
              const unitIndex = UNITS.indexOf(unit)
              return (
                <div key={unit.id}>
                  <UnitCard unit={unit} />
                  <ol className="space-y-3">
                    {unit.lessons.map((lesson, lessonIndex) => (
                      <LessonNode
                        key={lesson.id}
                        unit={unit}
                        unitIndex={unitIndex}
                        lesson={lesson}
                        lessonIndex={lessonIndex}
                        state={states.lessons[lesson.id]}
                        pathOpen={states.pathOpen[path.id]}
                        selected={selected?.kind === 'lesson' && selected.id === lesson.id}
                        onSelect={select('lesson', lesson.id)}
                      />
                    ))}
                  </ol>
                </div>
              )
            })}

            <ol className="mt-6">
              <CheckpointNode
                checkpoint={checkpoint}
                state={states.checkpoints[checkpoint.id]}
                lessonsLeft={lessonsLeft}
                selected={selected?.kind === 'checkpoint' && selected.id === checkpoint.id}
                onSelect={select('checkpoint', checkpoint.id)}
              />
            </ol>
          </section>
        )
      })}
    </div>
  )
}
