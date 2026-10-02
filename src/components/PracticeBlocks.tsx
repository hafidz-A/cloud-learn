import { CircleAlert, FlaskConical, Timer } from 'lucide-react'
import type { PracticeTip, UnitMission } from '../content/practice'
import { GlossaryText } from './GlossaryText'

/** "Hati-hati": this practice can cost real money (LANGIT_AZ104_PLAN.md section 8). */
export function CarefulChip() {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-koral-muda px-2 py-0.5 font-display text-13 font-bold text-tinta">
      <CircleAlert size={14} className="text-koral-dalam" aria-hidden="true" />
      Hati-hati biaya
    </span>
  )
}

/** One lesson's "Coba di Azure" tip. */
export function TipBox({ tip, className = '' }: { tip: PracticeTip; className?: string }) {
  return (
    <aside aria-label="Coba di Azure" className={`rounded-2xl border-2 border-dashed border-biru bg-white p-4 text-left ${className}`}>
      <p className="flex flex-wrap items-center gap-2 font-display text-15 font-bold text-tinta">
        <FlaskConical size={18} className="text-biru-dalam" aria-hidden="true" />
        Coba di Azure
        {tip.careful && <CarefulChip />}
      </p>
      <p className="mt-1 text-15">
        <GlossaryText text={tip.text} />
      </p>
    </aside>
  )
}

/** A unit's mission: 20-40 minutes in a real subscription that combine every lesson of the unit. */
export function MissionCard({ mission, titleId }: { mission: UnitMission; titleId: string }) {
  return (
    <section aria-labelledby={titleId} className="rounded-2xl border-2 border-biru bg-white p-4 shadow-[0_4px_0_var(--color-biru)]" data-mission>
      <p className="font-display text-13 font-semibold text-tinta-lembut">Misi unit</p>
      <h2 id={titleId} className="font-display text-20 font-bold">
        {mission.title}
      </h2>
      <p className="mt-1 flex flex-wrap items-center gap-2 text-15 text-tinta-lembut">
        <span className="flex items-center gap-1">
          <Timer size={16} aria-hidden="true" />
          sekitar {mission.minutes} menit
        </span>
        {mission.careful && <CarefulChip />}
      </p>
      <p className="mt-3 text-15">
        <GlossaryText text={mission.goal} />
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-15">
        {mission.steps.map((step) => (
          <li key={step}>
            <GlossaryText text={step} />
          </li>
        ))}
      </ol>
      <h3 className="mt-4 font-display text-15 font-bold">Cara membuktikan</h3>
      <p className="text-15">
        <GlossaryText text={mission.check} />
      </p>
      <h3 className="mt-3 font-display text-15 font-bold">Setelah selesai</h3>
      <p className="text-15">
        <GlossaryText text={mission.cleanup} />
      </p>
      <p className="mt-3 rounded-xl bg-langit p-3 text-13 text-tinta-lembut">
        Buat semua resource misi di satu resource group supaya bisa dihapus sekaligus.
        {mission.careful && ' Kerjakan beberapa misi berlabel hati-hati di hari yang sama, lalu langsung hapus resource-nya.'}
      </p>
    </section>
  )
}
