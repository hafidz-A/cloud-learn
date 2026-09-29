import { BookCheck, Flame, Target, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { BarChart } from '../charts/BarChart'
import { Meter } from '../charts/Meter'
import { LESSONS_IN_ORDER, UNITS, UNIT_BY_CONCEPT, conceptName, unitNumber } from '../content/course'
import { addDays, dayKey } from '../lib/date'
import { liveStreak } from '../lib/streak'
import { useProgress } from '../store/progress'

const DAY_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

function Tile({ icon, label, value, detail }: { icon: ReactNode; label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-2xl border-2 border-kabut bg-white p-3">
      <p className="flex items-center gap-1.5 text-13 font-semibold text-tinta-lembut">
        {icon}
        {label}
      </p>
      <p className="mt-1 font-display text-28 font-bold">{value}</p>
      {detail && <p className="text-13 text-tinta-lembut">{detail}</p>}
    </div>
  )
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border-2 border-kabut bg-white p-4 shadow-[0_4px_0_var(--color-kabut)]">
      <h2 className="font-display text-17 font-bold">{title}</h2>
      {subtitle && <p className="text-13 text-tinta-lembut">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </section>
  )
}

export function StatsScreen() {
  const p = useProgress()
  const today = dayKey()
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6))
  const bars = days.map((d) => {
    const [yy, mm, dd] = d.split('-').map(Number)
    const date = new Date(yy, mm - 1, dd)
    return {
      key: d,
      label: d === today ? 'Hari ini' : DAY_SHORT[date.getDay()],
      full: `${DAY_SHORT[date.getDay()]}, ${dd} ${MONTH_SHORT[mm - 1]}`,
      value: p.xpByDay[d] ?? 0,
    }
  })

  const totals = Object.values(p.conceptStats).reduce((a, c) => ({ right: a.right + c.right, all: a.all + c.right + c.wrong }), { right: 0, all: 0 })
  const lessonsDone = LESSONS_IN_ORDER.filter((l) => p.lessonsDone[l.lesson.id]).length

  const concepts = Object.entries(p.conceptStats)
    .map(([concept, s]) => ({ concept, ...s, total: s.right + s.wrong, rate: s.right / Math.max(1, s.right + s.wrong) }))
    .filter((c) => c.total > 0)
    .sort((a, b) => a.rate - b.rate || b.total - a.total)

  return (
    <main className="space-y-5 px-4 pb-32 pt-6">
      <h1 className="font-display text-28 font-bold">Statistik</h1>

      <div className="grid grid-cols-2 gap-3">
        <Tile icon={<Zap size={16} className="fill-matahari text-matahari-dalam" aria-hidden="true" />} label="Total XP" value={p.xp.toLocaleString('id-ID')} />
        <Tile
          icon={<Flame size={16} className="fill-matahari text-matahari-dalam" aria-hidden="true" />}
          label="Streak"
          value={`${liveStreak(p.streak, today)} hari`}
          detail={`Terpanjang ${p.streak.best} hari`}
        />
        <Tile
          icon={<BookCheck size={16} className="text-biru-dalam" aria-hidden="true" />}
          label="Lesson selesai"
          value={`${lessonsDone}`}
          detail={`dari ${LESSONS_IN_ORDER.length} lesson`}
        />
        <Tile
          icon={<Target size={16} className="text-mint-dalam" aria-hidden="true" />}
          label="Akurasi"
          value={totals.all ? `${Math.round((totals.right / totals.all) * 100)}%` : '–'}
          detail={`${totals.all} jawaban pertama`}
        />
      </div>

      <Card title="XP 7 hari terakhir" subtitle="Ketuk batang untuk melihat nilainya. Garis putus-putus adalah target harian.">
        <BarChart data={bars} unit="XP" highlight={today} reference={{ value: p.dailyGoal, label: `Target ${p.dailyGoal}` }} caption="XP per hari, 7 hari terakhir" />
      </Card>

      <Card title="Penguasaan per unit" subtitle="Lesson selesai, level unit, dan akurasi terbaik rata-rata.">
        <ul className="space-y-4">
          {UNITS.map((u) => {
            const done = u.lessons.filter((l) => p.lessonsDone[l.id])
            const best = done.length ? done.reduce((a, l) => a + p.lessonsDone[l.id].bestAccuracy, 0) / done.length : 0
            return (
              <li key={u.id}>
                <Meter
                  label={`Unit ${unitNumber(u)} · ${u.title}`}
                  detail={`${done.length}/${u.lessons.length} lesson · level ${p.unitLevel[u.id] ?? 0}/3${done.length ? ` · akurasi ${Math.round(best * 100)}%` : ''}`}
                  value={done.length / u.lessons.length}
                  valueText={`${Math.round((done.length / u.lessons.length) * 100)}%`}
                />
              </li>
            )
          })}
        </ul>
      </Card>

      <Card title="Penguasaan per konsep" subtitle="Persentase benar di percobaan pertama. Yang paling lemah di atas.">
        {concepts.length === 0 ? (
          <p className="text-15 text-tinta-lembut">Belum ada data. Selesaikan satu lesson dulu.</p>
        ) : (
          <ul className="space-y-4">
            {concepts.map((c) => {
              const unit = UNIT_BY_CONCEPT.get(c.concept)
              return (
                <li key={c.concept}>
                  <Meter
                    label={conceptName(c.concept)}
                    detail={`${c.right} dari ${c.total} benar${unit ? ` · Unit ${unitNumber(unit)}` : ''}`}
                    value={c.rate}
                    valueText={`${Math.round(c.rate * 100)}%`}
                  />
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </main>
  )
}
