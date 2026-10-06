import { BookOpen, ChevronLeft, Circle, CircleCheck, CircleDot, ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'
import { Meter } from '../charts/Meter'
import { COURSES, TEACHING_CARDS, UNIT_BY_CONCEPT, cardConcepts, courseOf, unitNumber } from '../content/course'
import { OUTLINES, itemStatus, outlineDate, outlineItems, type ItemStatus, type OutlineItem } from '../content/objectives'
import { hrefFor, leaveFlow } from '../lib/router'
import type { CourseId, Unit } from '../lib/types'
import { useActiveCourse } from '../store/course'
import { useCourseProgress } from '../store/progress'

const STATUS: Record<ItemStatus, { label: string; icon: ReactNode }> = {
  mastered: { label: 'Dikuasai', icon: <CircleCheck size={20} className="text-mint-dalam" aria-hidden="true" /> },
  practice: { label: 'Perlu latihan', icon: <CircleDot size={20} className="text-matahari-dalam" aria-hidden="true" /> },
  new: { label: 'Belum dijawab', icon: <Circle size={20} className="text-tinta-lembut" aria-hidden="true" /> },
}

/** The first unit that teaches or tests one of the item's concepts. */
function unitFor(course: CourseId, item: OutlineItem): Unit | undefined {
  for (const c of item.concepts) {
    const unit = UNIT_BY_CONCEPT[course].get(c)
    if (unit) return unit
  }
  return TEACHING_CARDS.find(({ card, unit }) => courseOf(unit.id) === course && cardConcepts(card).some((c) => item.concepts.includes(c)))?.unit
}

/**
 * The official skills outline of the active course, item by item, with where the
 * player stands on each (docs/RENCANA_LULUS_UJIAN.md). Mastering every item is
 * what "secara teori siap ujian" means in this app.
 */
export function OutlineScreen() {
  const course = useActiveCourse()
  const { conceptStats } = useCourseProgress(course)
  const outline = OUTLINES[course]
  const items = outlineItems(course)
  const mastered = items.filter((i) => itemStatus(i, conceptStats).status === 'mastered').length

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b-2 border-kabut bg-langit px-2 pb-2 pt-[calc(8px+env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => leaveFlow('ujian')}
            aria-label="Kembali"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-tinta-lembut"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="min-w-0">
            <p className="font-display text-13 font-semibold text-tinta-lembut">{COURSES[course].name}</p>
            <h1 className="font-display text-20 font-bold">Peta kisi-kisi ujian</h1>
          </div>
        </div>
      </header>

      <main className="space-y-5 px-4 pb-16 pt-4">
        <section className="rounded-2xl border-2 border-kabut bg-white p-4">
          <Meter
            label="Butir kisi-kisi dikuasai"
            detail={`Dikuasai: minimal 3 jawaban dan 80% benar.`}
            value={mastered / items.length}
            valueText={`${mastered}/${items.length}`}
          />
          <p className="mt-3 text-15">
            Kisi-kisi resmi {outline.exam} versi {outlineDate(outline.version)}, dicek {outlineDate(outline.checkedAt)}. Kalau semua butir
            dikuasai dan rata-rata simulasi penuh minimal 800, secara teori kamu siap ujian.
          </p>
          <a href={outline.source} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-display text-15 font-bold text-biru-dalam underline underline-offset-4">
            <ExternalLink size={16} aria-hidden="true" />
            Study guide resmi
          </a>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-13 text-tinta-lembut">
            {(Object.keys(STATUS) as ItemStatus[]).map((s) => (
              <li key={s} className="flex items-center gap-1.5">
                {STATUS[s].icon}
                {STATUS[s].label}
              </li>
            ))}
          </ul>
        </section>

        {outline.domains.map((domain) => (
          <section key={domain.path} aria-labelledby={`domain-${domain.path}`} className="space-y-3">
            <h2 id={`domain-${domain.path}`} className="font-display text-17 font-bold">
              <span lang="en">{domain.title}</span>
              <span className="block text-13 font-semibold text-tinta-lembut">
                {domain.weight[0]}–{domain.weight[1]}% ujian · jalur {domain.path} di app
              </span>
            </h2>
            {domain.groups.map((group) => (
              <div key={group.id} className="rounded-2xl border-2 border-kabut bg-white p-4">
                <h3 lang="en" className="font-display text-15 font-bold">
                  {group.title}
                </h3>
                <ul className="mt-2 divide-y-2 divide-kabut">
                  {group.items.map((item) => {
                    const s = itemStatus(item, conceptStats)
                    const unit = unitFor(course, item)
                    return (
                      <li key={item.id} className="flex items-start gap-3 py-2.5" data-outline-item={item.id} data-status={s.status}>
                        <span className="mt-0.5 shrink-0" title={STATUS[s.status].label}>
                          {STATUS[s.status].icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p lang="en" className="text-15">
                            {item.text}
                          </p>
                          <p className="text-13 text-tinta-lembut">
                            <span className="sr-only">{STATUS[s.status].label}. </span>
                            {s.total ? `${s.right} dari ${s.total} benar` : 'Belum dijawab'}
                            {unit && (
                              <>
                                {' · '}
                                <a href={hrefFor({ name: 'guide', unitId: unit.id })} className="inline-flex items-center gap-1 font-semibold text-biru-dalam underline underline-offset-2">
                                  <BookOpen size={13} aria-hidden="true" />
                                  Unit {unitNumber(unit)}
                                </a>
                              </>
                            )}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </main>
    </div>
  )
}
