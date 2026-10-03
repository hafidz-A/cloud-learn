import { Check, FlaskConical, KeyRound, Lightbulb, Lock, SquareTerminal, Star } from 'lucide-react'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Button } from '../components/Button'
import { COURSES, courseOf, unitNumber } from '../content/course'
import { labFor } from '../content/labs'
import { lockReason, pathStates, type NodeState, type PathStates } from '../lib/path'
import { navigate } from '../lib/router'
import { XP_PER_LESSON } from '../lib/scoring'
import { KIND_LABEL, kindOf, layoutUnit, prereqBranch, type NodeKind, type TreeCell } from '../lib/tree'
import type { CourseId, Unit } from '../lib/types'
import { useCourseProgress } from '../store/progress'
import { NODE_LOOK, STATE_LABEL } from './nodeLooks'
import { CheckpointNode, Popover, StartBubble, UnitCard, type Selected } from './PathMap'

// The CCNA lesson tree on the home screen (LANGIT_CCNA_PLAN.md section 4.5): five
// lanes, the trunk in the middle, branches beside it. Lines are drawn in an SVG
// whose x axis is the lane position in percent, so the tree stretches with the screen.

/** Height of one row of the grid, in px. */
const ROW = 104
/** Room above the first row for the "Mulai" bubble. */
const TOP = 44
/** Vertical center of a node within its row. */
const CENTER = 34
const SIZE: Record<NodeKind, number> = { trunk: 64, prereq: 54, handson: 54, support: 54 }

/** Horizontal center of a lane, in percent of the tree's width. */
const laneX = (lane: number) => (lane + 2.5) * 20
const rowY = (row: number) => TOP + row * ROW + CENTER

const KIND_NOTE: Record<Exclude<NodeKind, 'trunk'>, string> = {
  prereq: 'Cabang prasyarat: wajib sebelum lanjut ke lesson berikutnya di batang.',
  handson: 'Cabang hands-on, boleh dilewati: latihan di simulator CLI, lalu lab Packet Tracer.',
  support: 'Cabang pendukung, boleh dilewati: materi atau latihan tambahan.',
}

const KIND_ICON = { prereq: KeyRound, handson: SquareTerminal, support: Lightbulb }

function NodeIcon({ kind, state }: { kind: NodeKind; state: NodeState }) {
  const filled = state === 'active' || state === 'open'
  if (kind === 'trunk') {
    const Icon = state === 'done' ? Check : state === 'locked' || state === 'soon' ? Lock : Star
    return <Icon size={30} strokeWidth={3} className={filled ? 'fill-white' : ''} />
  }
  const Icon = KIND_ICON[kind]
  return <Icon size={24} strokeWidth={2.5} />
}

/** The legend above the tree: what the three branch kinds mean. */
export function TreeLegend() {
  return (
    <section aria-label="Arti cabang" className="mx-4 mt-4 rounded-2xl border-2 border-kabut bg-white p-3">
      <ul className="grid gap-1.5 text-13">
        <li className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-biru text-white" aria-hidden="true">
            <KeyRound size={14} strokeWidth={2.5} />
          </span>
          <span>
            <b className="font-display">Prasyarat</b>: wajib, bisa dilewati dengan tes lompat
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-biru text-white" aria-hidden="true">
            <SquareTerminal size={14} strokeWidth={2.5} />
          </span>
          <span>
            <b className="font-display">Hands-on</b>: opsional, simulator CLI dan lab Packet Tracer
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-biru text-white" aria-hidden="true">
            <Lightbulb size={14} strokeWidth={2.5} />
          </span>
          <span>
            <b className="font-display">Pendukung</b>: opsional, materi dan latihan tambahan
          </span>
        </li>
      </ul>
    </section>
  )
}

function LessonDetails({ unit, cell, state, states, pathOpen }: { unit: Unit; cell: TreeCell; state: NodeState; states: PathStates; pathOpen: boolean }) {
  const { lesson, kind } = cell
  const done = useCourseProgress(courseOf(lesson.id)).lessonsDone[lesson.id]
  const trunk = unit.lessons.filter((l) => !l.branch)
  const start = () => navigate({ name: 'lesson', lessonId: lesson.id })
  const lab = labFor(lesson.id)
  const skip = state !== 'done' && state !== 'soon' && pathOpen && prereqBranch(unit, lesson.id)

  return (
    <>
      <p className="font-display text-20 font-bold">{lesson.title}</p>
      <p className="mt-0.5 text-13 text-tinta-lembut">
        Unit {unitNumber(unit)} · {kind === 'trunk' ? `Lesson ${trunk.indexOf(lesson) + 1} dari ${trunk.length}` : `Cabang ${KIND_LABEL[kind].toLowerCase()}`}
      </p>
      {kind !== 'trunk' && <p className="mt-2 text-15">{KIND_NOTE[kind]}</p>}
      {state === 'soon' && <p className="mt-3 text-15 text-tinta-lembut">Soal untuk lesson ini sedang disiapkan.</p>}
      {state === 'locked' && <p className="mt-3 text-15 text-tinta-lembut">{lockReason(unit, lesson.id, states, pathOpen)}</p>}
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
      {skip && (
        <Button variant="putih" block className="mt-3" onClick={() => navigate({ name: 'skip', lessonId: lesson.id })}>
          Sudah paham? Tes lompat
        </Button>
      )}
      {lab && state !== 'soon' && (
        <Button variant="putih" block className="mt-3 flex items-center justify-center gap-2" onClick={() => navigate({ name: 'lab', lessonId: lesson.id })}>
          <FlaskConical size={18} aria-hidden="true" />
          Buka lab Packet Tracer
        </Button>
      )}
    </>
  )
}

function UnitTree({
  unit,
  states,
  pathOpen,
  selected,
  onSelect,
}: {
  unit: Unit
  states: PathStates
  pathOpen: boolean
  selected: string | null
  onSelect: (id: string, open: boolean) => void
}) {
  const tree = useMemo(() => layoutUnit(unit), [unit])
  const { lessonsDone } = useCourseProgress(courseOf(unit.id))
  const height = TOP + tree.rows * ROW
  const open = tree.cells.find((c) => c.lesson.id === selected)

  return (
    <div className="relative" style={{ height }} data-unit-tree={unit.id}>
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        {tree.edges.map((e) => (
          <polyline
            key={`${e.from}-${e.to}`}
            points={e.points.map(([lane, row]) => `${laneX(lane)},${rowY(row)}`).join(' ')}
            fill="none"
            stroke={lessonsDone[e.to] ? 'var(--color-matahari-dalam)' : 'var(--color-kabut-dalam)'}
            strokeWidth={e.optional ? 3 : 6}
            strokeDasharray={e.optional ? '7 7' : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <ol>
        {tree.cells.map((cell) => {
          const state = states.lessons[cell.lesson.id]
          const look = NODE_LOOK[state]
          const size = SIZE[cell.kind]
          const label = cell.kind === 'trunk' ? '' : `, cabang ${KIND_LABEL[cell.kind].toLowerCase()}`
          return (
            <li
              key={cell.lesson.id}
              className="absolute flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${laneX(cell.lane)}%`, top: rowY(cell.row) - size / 2 }}
            >
              <div className={`relative ${state === 'active' ? 'motion-safe:animate-bob' : ''}`}>
                {state === 'active' && <StartBubble label="Mulai" />}
                <button
                  type="button"
                  data-node={cell.lesson.id}
                  data-node-state={state}
                  data-branch-kind={kindOf(cell.lesson)}
                  aria-expanded={selected === cell.lesson.id}
                  aria-label={`${cell.lesson.title}${label}, unit ${unitNumber(unit)}, ${STATE_LABEL[state]}`}
                  onClick={() => onSelect(cell.lesson.id, selected !== cell.lesson.id)}
                  className={`btn-3d flex cursor-pointer items-center justify-center rounded-full ${look.className}`}
                  style={{ width: size, height: size, '--edge': look.edge, '--depth': '5px' } as CSSProperties}
                >
                  <NodeIcon kind={cell.kind} state={state} />
                </button>
              </div>
              {cell.kind !== 'trunk' && (
                <span aria-hidden="true" className="mt-1.5 whitespace-nowrap font-display text-13 font-semibold text-tinta-lembut">
                  {KIND_LABEL[cell.kind]}
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {open && (
        <Popover
          className="inset-x-4"
          style={{ top: rowY(open.row) + SIZE[open.kind] / 2 + (open.kind === 'trunk' ? 14 : 36) }}
          // The popover is 32px narrower than the tree, so the lane's percent needs a small correction.
          arrowLeft={`calc(${laneX(open.lane)}% + ${(laneX(open.lane) * 32) / 100 - 16}px)`}
          onClose={() => onSelect(open.lesson.id, false)}
        >
          <LessonDetails unit={unit} cell={open} state={states.lessons[open.lesson.id]} states={states} pathOpen={pathOpen} />
        </Popover>
      )}
    </div>
  )
}

/** The CCNA home map: per path, every unit's tree, then the path's checkpoint. */
export function TreeMap({ course }: { course: CourseId }) {
  const { paths, units, checkpoints } = COURSES[course]
  const { lessonsDone, checkpoints: checkpointResults } = useCourseProgress(course)
  const states = useMemo(() => pathStates(course, { lessonsDone, checkpoints: checkpointResults }), [course, lessonsDone, checkpointResults])
  const [selected, setSelected] = useState<Selected>(null)

  useEffect(() => {
    const target = document.querySelector('[data-node-state="active"]') ?? [...document.querySelectorAll('[data-node-state="done"]')].at(-1)
    target?.scrollIntoView({ block: 'center' })
  }, [])

  const select = (kind: 'lesson' | 'checkpoint') => (id: string, open: boolean) => setSelected(open ? { kind, id } : null)

  return (
    <div className="pb-32">
      <TreeLegend />
      {paths.map((path) => {
        const checkpoint = checkpoints.find((c) => c.path === path.id)!
        const pathUnits = units.filter((u) => u.path === path.id)
        const lessonsLeft = pathUnits.flatMap((u) => u.lessons).filter((l) => !l.branch || l.branch.kind === 'prereq').filter((l) => !lessonsDone[l.id]).length
        return (
          <section key={path.id} aria-labelledby={`path-${path.id}`}>
            <div className="mx-4 mt-8 flex items-center gap-3">
              <span className="h-0.5 flex-1 rounded-full bg-kabut" />
              <h2 id={`path-${path.id}`} className="flex items-center gap-1.5 text-center font-display text-15 font-semibold text-tinta-lembut">
                {!states.pathOpen[path.id] && <Lock size={14} aria-label="terkunci" />}
                Jalur {path.id} · {path.title}
              </h2>
              <span className="h-0.5 flex-1 rounded-full bg-kabut" />
            </div>
            {pathUnits.length === 0 && <p className="mx-4 mt-4 text-center text-15 text-tinta-lembut">Materi jalur ini sedang disiapkan.</p>}
            {pathUnits.map((unit) => (
              <div key={unit.id}>
                <UnitCard unit={unit} />
                <UnitTree
                  unit={unit}
                  states={states}
                  pathOpen={states.pathOpen[path.id]}
                  selected={selected?.kind === 'lesson' ? selected.id : null}
                  onSelect={select('lesson')}
                />
              </div>
            ))}
            <ol className="mt-6">
              <CheckpointNode
                checkpoint={checkpoint}
                state={states.checkpoints[checkpoint.id]}
                lessonsLeft={lessonsLeft}
                selected={selected?.kind === 'checkpoint' && selected.id === checkpoint.id}
                onSelect={(open) => select('checkpoint')(checkpoint.id, open)}
              />
            </ol>
          </section>
        )
      })}
    </div>
  )
}
