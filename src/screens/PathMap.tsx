import { Check, Lock, Star, Trophy } from 'lucide-react'
import { useEffect, useEffectEvent, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { CHECKPOINTS, PATHS, UNITS, unitNumber, type Checkpoint } from '../content/course'
import { lessonStates, type NodeState } from '../lib/path'
import { navigate } from '../lib/router'
import type { Lesson, Unit } from '../lib/types'
import { useProgress } from '../store/progress'

const NODE_LOOK: Record<NodeState, { className: string; edge: string }> = {
  done: { className: 'bg-matahari text-tinta', edge: 'var(--color-matahari-dalam)' },
  active: { className: 'bg-biru text-white', edge: 'var(--color-biru-dalam)' },
  open: { className: 'bg-biru text-white', edge: 'var(--color-biru-dalam)' },
  soon: { className: 'bg-kabut text-tinta-lembut', edge: 'var(--color-kabut-dalam)' },
}

const STATE_LABEL: Record<NodeState, string> = {
  done: 'selesai',
  active: 'lesson berikutnya',
  open: 'bisa dimainkan',
  soon: 'segera hadir',
}

/** Horizontal offset in px for the winding path. Alternates direction per unit. */
function offsetFor(lessonIndex: number, unitIndex: number): number {
  const direction = unitIndex % 2 === 0 ? 1 : -1
  return Math.round(Math.sin((lessonIndex * Math.PI) / 2.5) * 70) * direction
}

type Selected = { kind: 'lesson'; id: string } | { kind: 'checkpoint'; id: string } | null

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

function LessonNode({
  unit,
  unitIndex,
  lesson,
  lessonIndex,
  state,
  selected,
  onSelect,
}: {
  unit: Unit
  unitIndex: number
  lesson: Lesson
  lessonIndex: number
  state: NodeState
  selected: boolean
  onSelect: (open: boolean) => void
}) {
  const bestAccuracy = useProgress((s) => s.lessonsDone[lesson.id]?.bestAccuracy)
  const look = NODE_LOOK[state]
  const offset = offsetFor(lessonIndex, unitIndex)
  const Icon = state === 'done' ? Check : state === 'soon' ? Lock : Star
  const start = () => navigate({ name: 'lesson', lessonId: lesson.id })

  return (
    <li className={`relative flex justify-center pb-2 ${state === 'active' ? 'pt-12' : 'pt-2'}`}>
      <div style={{ transform: `translateX(${offset}px)` }}>
        <div className={`relative ${state === 'active' ? 'motion-safe:animate-bob' : ''}`}>
          {state === 'active' && (
            <div
              aria-hidden="true"
              className="absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border-2 border-kabut bg-white px-3 py-1 font-display text-15 font-bold text-biru-dalam"
            >
              Mulai
              <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-kabut bg-white" />
            </div>
          )}
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
          {state === 'soon' ? (
            <p className="mt-3 text-15 text-tinta-lembut">Soal untuk lesson ini sedang disiapkan.</p>
          ) : (
            <>
              {bestAccuracy !== undefined && (
                <p className="mt-2 text-15">Akurasi terbaik {Math.round(bestAccuracy * 100)}%</p>
              )}
              <Button block className="mt-4" onClick={start}>
                {state === 'done' ? 'Ulangi' : 'Mulai'}
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
  selected,
  onSelect,
}: {
  checkpoint: Checkpoint
  selected: boolean
  onSelect: (open: boolean) => void
}) {
  return (
    <li className="relative flex justify-center pb-2 pt-4">
      <button
        type="button"
        data-node={checkpoint.id}
        data-node-state="soon"
        aria-expanded={selected}
        aria-label={`${checkpoint.title}, segera hadir`}
        onClick={() => onSelect(!selected)}
        className="btn-3d flex min-h-[72px] cursor-pointer items-center justify-center gap-3 whitespace-nowrap rounded-3xl bg-kabut px-7 font-display text-20 font-bold text-tinta-lembut"
        style={{ '--edge': 'var(--color-kabut-dalam)', '--depth': '6px' } as CSSProperties}
      >
        <Trophy size={30} strokeWidth={2.5} />
        {checkpoint.title}
      </button>
      {selected && (
        <Popover offset={0} onClose={() => onSelect(false)}>
          <p className="font-display text-20 font-bold">{checkpoint.title}</p>
          <p className="mt-2 text-15">
            {checkpoint.questionCount} soal campuran dari seluruh jalur {checkpoint.path}. Skor minimal 80% untuk
            membuka jalur berikutnya.
          </p>
          <p className="mt-2 text-15 text-tinta-lembut">Segera hadir.</p>
        </Popover>
      )}
    </li>
  )
}

function UnitCard({ unit }: { unit: Unit }) {
  const lessonsDone = useProgress((s) => s.lessonsDone)
  const done = unit.lessons.filter((l) => lessonsDone[l.id]).length
  return (
    <div className="mx-4 mb-4 mt-6 rounded-2xl border-2 border-kabut bg-white px-4 py-3 shadow-[0_4px_0_var(--color-kabut)]">
      <p className="font-display text-13 font-semibold text-biru-dalam">Unit {unitNumber(unit)}</p>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-20 font-bold">{unit.title}</h2>
        <p className="shrink-0 text-13 text-tinta-lembut">
          {done}/{unit.lessons.length} lesson
        </p>
      </div>
    </div>
  )
}

/** The vertical, winding path of lessons and checkpoints on the home screen. */
export function PathMap() {
  const lessonsDone = useProgress((s) => s.lessonsDone)
  const states = useMemo(() => lessonStates(UNITS, lessonsDone), [lessonsDone])
  const [selected, setSelected] = useState<Selected>(null)

  useEffect(() => {
    // Open on the next lesson, or on the last finished one when nothing is next.
    const target =
      document.querySelector('[data-node-state="active"]') ??
      [...document.querySelectorAll('[data-node-state="done"]')].at(-1)
    target?.scrollIntoView({ block: 'center' })
  }, [])

  const select = (next: Selected) => (open: boolean) => setSelected(open ? next : null)

  return (
    <div className="pb-32">
      {PATHS.map((path) => {
        const checkpoint = CHECKPOINTS.find((c) => c.path === path.id)!
        return (
          <section key={path.id} aria-labelledby={`path-${path.id}`}>
            <div className="mx-4 mt-8 flex items-center gap-3">
              <span className="h-0.5 flex-1 rounded-full bg-kabut" />
              <h2 id={`path-${path.id}`} className="font-display text-15 font-semibold text-tinta-lembut">
                Jalur {path.id} · {path.title}
              </h2>
              <span className="h-0.5 flex-1 rounded-full bg-kabut" />
            </div>

            {UNITS.map((unit, unitIndex) =>
              unit.path !== path.id ? null : (
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
                        state={states[lesson.id]}
                        selected={selected?.kind === 'lesson' && selected.id === lesson.id}
                        onSelect={select({ kind: 'lesson', id: lesson.id })}
                      />
                    ))}
                  </ol>
                </div>
              ),
            )}

            <ol className="mt-6">
              <CheckpointNode
                checkpoint={checkpoint}
                selected={selected?.kind === 'checkpoint' && selected.id === checkpoint.id}
                onSelect={select({ kind: 'checkpoint', id: checkpoint.id })}
              />
            </ol>
          </section>
        )
      })}
    </div>
  )
}
