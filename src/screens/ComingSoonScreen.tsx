import type { ReactNode } from 'react'
import { Mascot } from '../components/Mascot'

/** Placeholder for tabs that later stages of the plan fill in. */
export function ComingSoonScreen({ title, note, children }: { title: string; note: string; children?: ReactNode }) {
  return (
    <main className="px-4 pb-32 pt-6">
      <h1 className="font-display text-28 font-bold">{title}</h1>
      <div className="mt-6 flex flex-col items-center rounded-2xl border-2 border-kabut bg-white px-6 py-8 text-center shadow-[0_4px_0_var(--color-kabut)]">
        <Mascot mood="netral" size={112} />
        <p className="mt-4 font-display text-20 font-bold">Segera hadir</p>
        <p className="mt-1 text-15 text-tinta-lembut">{note}</p>
      </div>
      {children}
    </main>
  )
}
