import { BookOpen, ChevronLeft, ListChecks } from 'lucide-react'
import { MissionCard, TipBox } from '../components/PracticeBlocks'
import { cardConcepts, cardsByLesson, courseOf, findUnit, isExercise, unitNumber } from '../content/course'
import { itemsForConcept } from '../content/objectives'
import { missionFor, tipFor } from '../content/practice'
import { TeachingCardContent } from '../lesson/TeachingCardContent'
import { Unavailable } from '../lesson/LessonScreen'
import { leaveFlow } from '../lib/router'
import type { CourseId } from '../lib/types'

/** The official outline items a lesson covers, so the guide doubles as a map of the exam. */
function OutlineChips({ concepts, course }: { concepts: string[]; course: CourseId }) {
  const items = [...new Map(concepts.flatMap((c) => itemsForConcept(course, c)).map((i) => [i.id, i])).values()]
  if (!items.length) return null
  return (
    <ul className="mt-2 space-y-1" aria-label="Kisi-kisi ujian">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-1.5 text-13 text-tinta-lembut">
          <ListChecks size={14} className="mt-0.5 shrink-0 text-biru-dalam" aria-hidden="true" />
          <span lang="en">{item.text}</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Unit guide (LANGIT_AZ900_PERBAIKAN_MATERI.md section 7): every learn card of
 * a unit in lesson order, built from the lessons themselves, so it never needs
 * writing separately.
 */
export function GuideScreen({ unitId }: { unitId: string }) {
  const unit = findUnit(unitId)
  if (!unit) return <Unavailable title="Unit ini tidak ditemukan" body="Buka panduan dari kartu unit di home." />
  const sections = cardsByLesson(unit)
  const cardCount = sections.reduce((n, s) => n + s.cards.length, 0)
  const mission = missionFor(unit.id)

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b-2 border-kabut bg-langit px-2 pb-2 pt-[calc(8px+env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => leaveFlow('home')}
            aria-label="Kembali ke home"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-tinta-lembut"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-display text-13 font-semibold text-tinta-lembut">
              <BookOpen size={14} aria-hidden="true" className="text-biru-dalam" />
              Panduan unit {unitNumber(unit)}
            </p>
            <h1 className="font-display text-20 font-bold">{unit.title}</h1>
          </div>
        </div>
      </header>

      <main className="space-y-8 px-4 pb-16 pt-4">
        <p className="text-15 text-tinta-lembut">
          {cardCount > 0
            ? `Ringkasan materi dari semua lesson di unit ini (${cardCount} kartu), urut sesuai lesson. Materinya sama dengan kartu di dalam lesson.`
            : 'Materi unit ini sedang disiapkan.'}
          {mission && ' Setiap lesson punya tips "Coba di Azure", dan misi unit ada di akhir panduan.'}
        </p>
        {sections.map(({ lesson, cards }, i) =>
          cards.length === 0 ? null : (
            <section key={lesson.id} aria-labelledby={`guide-${lesson.id}`}>
              <h2 id={`guide-${lesson.id}`} className="font-display text-17 font-bold text-tinta-lembut">
                Lesson {i + 1} · {lesson.title}
              </h2>
              <OutlineChips concepts={[...cards.flatMap(cardConcepts), ...lesson.items.filter(isExercise).map((e) => e.concept)]} course={courseOf(unit.id)} />
              <div className="mt-3 space-y-4">
                {cards.map((card) => (
                  <article key={card.id} aria-labelledby={`guide-${card.id}`} className="rounded-2xl border-2 border-kabut bg-white p-4 shadow-[0_4px_0_var(--color-kabut)]">
                    <TeachingCardContent card={card} titleId={`guide-${card.id}`} heading="h3" />
                  </article>
                ))}
                {tipFor(lesson.id) && <TipBox tip={tipFor(lesson.id)!} />}
              </div>
            </section>
          ),
        )}
        {mission && <MissionCard mission={mission} titleId={`mission-${unit.id}`} />}
      </main>
    </div>
  )
}
