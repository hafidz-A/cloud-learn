import { isVisualName } from '../content/visuals'
import { VISUALS } from './registry'

/** Draws the catalog diagram a learn or intro card names in its "visual" field. */
export function Visual({ name }: { name: string }) {
  const Diagram = isVisualName(name) ? VISUALS[name] : undefined
  return Diagram ? (
    <div data-visual={name}>
      <Diagram />
    </div>
  ) : null
}
