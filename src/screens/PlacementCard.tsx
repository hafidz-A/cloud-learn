import { CircleCheck, ClipboardList } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/Button'
import { COURSES, unitNumber } from '../content/course'
import { placementPassed } from '../lesson/placement'
import { PLACEMENT_PER_UNIT } from '../lesson/plans'
import { navigate } from '../lib/router'
import { useCourseProgress, useProgress } from '../store/progress'

const UNITS = COURSES.az104.units

/**
 * The optional AZ-104 placement test on the home screen (LANGIT_AZ104_PLAN.md
 * section 3): offered before the first lesson, then the units scored at least
 * 80% can be marked done. Nothing shows once the choice is made.
 */
export function PlacementCard() {
  const { placement, lessonsDone } = useCourseProgress('az104')
  const skipPlacement = useProgress((s) => s.skipPlacement)
  const applyPlacement = useProgress((s) => s.applyPlacement)
  const passed = placement ? placementPassed(placement.units) : []
  const [chosen, setChosen] = useState<string[]>(passed)
  const started = UNITS.some((u) => u.lessons.some((l) => lessonsDone[l.id]))

  if (placement?.skipped || placement?.appliedAt) return null
  if (!placement && started) return null

  if (!placement) {
    return (
      <section aria-labelledby="placement-title" className="mx-4 mt-4 rounded-2xl border-2 border-kabut bg-white p-4">
        <h2 id="placement-title" className="flex items-center gap-2 font-display text-17 font-bold">
          <ClipboardList size={20} aria-hidden="true" />
          Placement test (opsional)
        </h2>
        <p className="mt-1 text-15">
          {UNITS.length * PLACEMENT_PER_UNIT} soal, {PLACEMENT_PER_UNIT} dari setiap unit. Unit yang skornya minimal 80% boleh kamu tandai
          selesai, supaya tidak mengulang materi yang sudah dikuasai.
        </p>
        <p className="mt-1 text-13 text-tinta-lembut">Tanpa hearts dan XP. Jawabannya tidak masuk statistik maupun antrean Latihan.</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button variant="putih" onClick={skipPlacement}>
            Lewati
          </Button>
          <Button onClick={() => navigate({ name: 'placement' })}>Mulai</Button>
        </div>
      </section>
    )
  }

  const toggle = (id: string) => setChosen((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))
  return (
    <section aria-labelledby="placement-title" className="mx-4 mt-4 rounded-2xl border-2 border-kabut bg-white p-4">
      <h2 id="placement-title" className="font-display text-17 font-bold">
        Hasil placement test
      </h2>
      <p className="mt-1 text-15">
        {passed.length
          ? 'Centang unit yang mau ditandai selesai. Lesson di unit itu terbuka dan dihitung selesai, tanpa XP.'
          : 'Belum ada unit dengan skor minimal 80%. Mulai dari Unit 1.'}
      </p>
      <ul className="mt-3 divide-y-2 divide-kabut">
        {UNITS.map((unit) => {
          const score = placement.units[unit.id]
          const ok = passed.includes(unit.id)
          const label = `Unit ${unitNumber(unit)} · ${unit.title}`
          return (
            <li key={unit.id} className="flex min-h-12 items-center gap-3 py-1.5">
              {ok ? (
                <input
                  id={`placement-${unit.id}`}
                  type="checkbox"
                  checked={chosen.includes(unit.id)}
                  onChange={() => toggle(unit.id)}
                  className="h-6 w-6 shrink-0 cursor-pointer accent-biru"
                />
              ) : (
                <span className="h-6 w-6 shrink-0" aria-hidden="true" />
              )}
              <label htmlFor={ok ? `placement-${unit.id}` : undefined} className="min-w-0 flex-1 text-15">
                {label}
              </label>
              <span className={`flex shrink-0 items-center gap-1 font-display text-15 font-bold tabular-nums ${ok ? 'text-mint-dalam' : 'text-tinta-lembut'}`}>
                {ok && <CircleCheck size={16} aria-hidden="true" />}
                {score ? `${score.right}/${score.total}` : '-'}
              </span>
            </li>
          )
        })}
      </ul>
      <Button block className="mt-4" onClick={() => applyPlacement(passed.filter((id) => chosen.includes(id)))}>
        {chosen.filter((id) => passed.includes(id)).length ? `Tandai ${chosen.filter((id) => passed.includes(id)).length} unit selesai` : 'Mulai dari Unit 1'}
      </Button>
    </section>
  )
}
