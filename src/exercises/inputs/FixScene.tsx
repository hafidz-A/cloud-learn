import { GlossaryText } from '../../components/GlossaryText'
import { CircleAlert, TriangleAlert } from 'lucide-react'
import type { FixExercise } from '../../lib/types'

/** A pretend Azure portal notification or error message for "fix" exercises. */
export function FixScene({ scene }: { scene: FixExercise['scene'] }) {
  if (scene.kind === 'error') {
    return (
      <figure lang="en" className="overflow-hidden rounded-2xl border-2 border-koral bg-white">
        <figcaption className="flex items-center gap-2 bg-koral-muda px-4 py-2 font-display text-15 font-bold">
          <CircleAlert size={18} className="text-koral-dalam" aria-hidden="true" />
          {scene.title}
        </figcaption>
        <p className="px-4 py-3 font-mono text-13 leading-relaxed">
          <GlossaryText text={scene.message} />
        </p>
      </figure>
    )
  }
  return (
    <figure lang="en" className="overflow-hidden rounded-2xl border-2 border-kabut bg-white">
      <div className="flex items-center gap-2 bg-tinta px-4 py-2 text-13 font-semibold text-white">
        <span aria-hidden="true" className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-white/60" />
          <span className="h-2 w-2 rounded-full bg-white/60" />
          <span className="h-2 w-2 rounded-full bg-white/60" />
        </span>
        Microsoft Azure portal
      </div>
      <div className="flex gap-3 px-4 py-3">
        <TriangleAlert size={22} className="mt-0.5 shrink-0 text-matahari-dalam" aria-hidden="true" />
        <div>
          <figcaption className="font-bold">{scene.title}</figcaption>
          <p className="mt-1 text-15">
            <GlossaryText text={scene.message} />
          </p>
        </div>
      </div>
    </figure>
  )
}
