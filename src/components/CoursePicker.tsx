import { COURSE_IDS, COURSES } from '../content/course'
import { useCourse } from '../store/course'

/**
 * AZ-900 or AZ-104 (LANGIT_AZ104_PLAN.md section 3). Neither course needs the
 * other, so both can be opened at any time; the path map, practice, stats, and
 * exam page follow the choice.
 */
export function CoursePicker() {
  const active = useCourse((s) => s.active)
  const setActive = useCourse((s) => s.setActive)
  return (
    <div role="group" aria-label="Pilih course" className="mx-4 mt-4 grid grid-cols-2 gap-2">
      {COURSE_IDS.map((id) => {
        const course = COURSES[id]
        const on = id === active
        return (
          <button
            key={id}
            type="button"
            aria-pressed={on}
            onClick={() => setActive(id)}
            className={`flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 px-2 py-1.5 ${
              on ? 'border-biru-dalam bg-biru-muda text-tinta' : 'border-kabut bg-white text-tinta-lembut'
            }`}
          >
            <span className="font-display text-17 font-bold">{course.name}</span>
            <span className="text-13">{course.title}</span>
          </button>
        )
      })}
    </div>
  )
}
