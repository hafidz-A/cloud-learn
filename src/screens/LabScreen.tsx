import { ChevronLeft, FlaskConical } from 'lucide-react'
import { findLesson, unitNumber } from '../content/course'
import { labFor } from '../content/labs'
import { LabCard } from '../components/LabCard'
import { Unavailable } from '../lesson/LessonScreen'
import { leaveFlow } from '../lib/router'

/** One hands-on lesson's Packet Tracer lab on its own page (LANGIT_CCNA_PLAN.md section 8), easy to keep open next to the tool. */
export function LabScreen({ lessonId }: { lessonId: string }) {
  const lab = labFor(lessonId)
  const ref = findLesson(lessonId)
  if (!lab || !ref) return <Unavailable title="Lab ini tidak ditemukan" body="Buka lab dari cabang hands-on di peta CCNA." />
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b-2 border-kabut bg-langit px-2 pb-2 pt-[calc(8px+env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => leaveFlow('home')}
            aria-label="Kembali"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-tinta-lembut"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-display text-13 font-semibold text-tinta-lembut">
              <FlaskConical size={14} aria-hidden="true" className="text-biru-dalam" />
              Lab · Unit {unitNumber(ref.unit)}
            </p>
            <h1 className="font-display text-20 font-bold">{lab.title}</h1>
          </div>
        </div>
      </header>
      <main className="px-4 pb-16 pt-4">
        <LabCard lab={lab} />
      </main>
    </div>
  )
}
