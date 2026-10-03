import type { ExhibitExercise } from '../../lib/types'
import { NetDiagramView } from '../../visuals/NetDiagram'

/** "Refer to the exhibit": the topology and the device output a CCNA question is about. */
export function ExhibitScene({ exercise }: { exercise: ExhibitExercise }) {
  return (
    <div className="space-y-3" data-exhibit>
      {exercise.diagram && (
        <figure className="rounded-2xl border-2 border-kabut bg-white p-3">
          <NetDiagramView diagram={exercise.diagram} />
        </figure>
      )}
      {exercise.outputs?.map((o) => (
        <figure key={o.title} lang="en" className="overflow-hidden rounded-2xl border-2 border-tinta bg-tinta">
          <figcaption className="border-b border-white/15 px-3 py-1.5 font-mono text-13 font-semibold text-white">{o.title}</figcaption>
          <pre className="px-3 py-2 font-mono text-13 leading-relaxed text-white">
            {o.text.split('\n').map((line, i) => (
              <code key={i} className="block whitespace-pre-wrap wrap-anywhere">
                {line || ' '}
              </code>
            ))}
          </pre>
        </figure>
      ))}
    </div>
  )
}
