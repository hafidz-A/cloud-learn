import { BookOpen, ChevronLeft, FlaskConical } from 'lucide-react'
import { MissionCard, TipBox } from '../components/PracticeBlocks'
import { cardsByLesson, findUnit, unitNumber } from '../content/course'
import { labFor } from '../content/labs'
import { missionFor, tipFor } from '../content/practice'
import { KIND_LABEL } from '../lib/tree'
import { TeachingCardContent } from '../lesson/TeachingCardContent'
import { Unavailable } from '../lesson/LessonScreen'
import { leaveFlow, navigate } from '../lib/router'

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
                {lesson.branch && <span className="ml-2 rounded-lg bg-biru-muda px-2 py-0.5 text-13 text-tinta">Cabang {KIND_LABEL[lesson.branch.kind].toLowerCase()}</span>}
              </h2>
              <div className="mt-3 space-y-4">
                {cards.map((card) => (
                  <article key={card.id} aria-labelledby={`guide-${card.id}`} className="rounded-2xl border-2 border-kabut bg-white p-4 shadow-[0_4px_0_var(--color-kabut)]">
                    <TeachingCardContent card={card} titleId={`guide-${card.id}`} heading="h3" />
                  </article>
                ))}
                {tipFor(lesson.id) && <TipBox tip={tipFor(lesson.id)!} />}
                {labFor(lesson.id) && (
                  <button
                    type="button"
                    onClick={() => navigate({ name: 'lab', lessonId: lesson.id })}
                    className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-2xl border-2 border-dashed border-biru bg-white p-4 text-left font-display text-15 font-bold"
                  >
                    <FlaskConical size={18} className="shrink-0 text-biru-dalam" aria-hidden="true" />
                    Lab Packet Tracer: {labFor(lesson.id)!.title}
                  </button>
                )}
              </div>
            </section>
          ),
        )}
        {mission && <MissionCard mission={mission} titleId={`mission-${unit.id}`} />}
      </main>
    </div>
  )
}
