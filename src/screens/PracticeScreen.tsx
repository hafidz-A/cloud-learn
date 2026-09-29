import { CalendarClock, Heart } from 'lucide-react'
import { Button } from '../components/Button'
import { Mascot } from '../components/Mascot'
import { activeExercise, conceptName } from '../content/course'
import { dayKey, daysBetween } from '../lib/date'
import { dueIds, REVIEW_STREAK_TO_CLEAR } from '../lib/review'
import { navigate } from '../lib/router'
import { MAX_HEARTS, useProgress } from '../store/progress'

export function PracticeScreen() {
  const review = useProgress((s) => s.review)
  const hearts = useProgress((s) => s.hearts)
  const heartsOn = useProgress((s) => s.heartsEnabled)
  const anyLessonDone = useProgress((s) => Object.keys(s.lessonsDone).length > 0)
  const anyMistake = Object.keys(review).some((id) => activeExercise(id))
  const today = dayKey()
  const due = dueIds(review, today).filter((id) => activeExercise(id))
  const upcoming = Object.entries(review)
    .filter(([id, e]) => e.dueDay > today && activeExercise(id))
    .sort(([, a], [, b]) => a.dueDay.localeCompare(b.dueDay))
  const canStart = due.length > 0 || anyLessonDone || anyMistake

  return (
    <main className="space-y-5 px-4 pb-32 pt-6">
      <h1 className="font-display text-28 font-bold">Latihan</h1>

      <section className="rounded-2xl border-2 border-kabut bg-white p-4 shadow-[0_4px_0_var(--color-kabut)]">
        <div className="flex items-center gap-4">
          <Mascot mood="netral" size={80} className="shrink-0" />
          <div>
            <p className="font-display text-20 font-bold">{due.length ? `${due.length} soal siap diulang` : 'Tidak ada soal jatuh tempo'}</p>
            <p className="text-15 text-tinta-lembut">
              {due.length
                ? 'Soal yang pernah salah muncul lagi setelah 1, 3, lalu 7 hari.'
                : anyLessonDone
                  ? 'Latihan bebas dari lesson yang sudah selesai.'
                  : anyMistake
                    ? 'Latihan bebas dari soal yang pernah salah.'
                    : 'Selesaikan satu lesson dulu, lalu soalnya bisa dilatih di sini.'}
            </p>
          </div>
        </div>
        {heartsOn && (
          <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-koral-muda px-3 py-2 text-15">
            <Heart size={18} className="fill-koral text-koral-dalam" aria-hidden="true" />
            Hearts {hearts}/{MAX_HEARTS}. Setiap jawaban benar di latihan mengisi 1 heart.
          </p>
        )}
        <Button block className="mt-4" disabled={!canStart} onClick={() => navigate({ name: 'practice' })}>
          {due.length ? 'Mulai latihan' : 'Mulai latihan bebas'}
        </Button>
      </section>

      {due.length > 0 && (
        <section>
          <h2 className="font-display text-17 font-bold">Siap diulang hari ini</h2>
          <ul className="mt-2 space-y-2">
            {due.map((id) => {
              const ref = activeExercise(id)!
              return (
                <li key={id} className="rounded-2xl border-2 border-kabut bg-white p-3">
                  <p lang="en" className="line-clamp-2 text-15 font-semibold">
                    {ref.exercise.prompt}
                  </p>
                  <p className="mt-1 text-13 text-tinta-lembut">
                    {conceptName(ref.exercise.concept)} · benar {review[id].correctStreak}/{REVIEW_STREAK_TO_CLEAR} kali berturut-turut
                  </p>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="font-display text-17 font-bold">Berikutnya</h2>
          <ul className="mt-2 space-y-2">
            {upcoming.map(([id, e]) => {
              const ref = activeExercise(id)!
              const inDays = daysBetween(today, e.dueDay)
              return (
                <li key={id} className="flex items-start gap-3 rounded-2xl border-2 border-kabut bg-white p-3">
                  <CalendarClock size={18} className="mt-0.5 shrink-0 text-tinta-lembut" aria-hidden="true" />
                  <div className="min-w-0">
                    <p lang="en" className="line-clamp-2 text-15 font-semibold">
                      {ref.exercise.prompt}
                    </p>
                    <p className="mt-1 text-13 text-tinta-lembut">
                      {conceptName(ref.exercise.concept)} · {inDays === 1 ? 'besok' : `${inDays} hari lagi`}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </main>
  )
}
