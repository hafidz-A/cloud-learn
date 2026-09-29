import type { PlaceExercise } from '../../lib/types'
import { judgePlace } from '../logic'
import type { InputProps, Look } from '../looks'
import { ItemBoard } from './ItemBoard'

const RULE_HINT: Record<PlaceExercise['rule'], string> = {
  valid: 'Taruh setiap resource di tempat yang memenuhi syarat.',
  'one-per-zone': 'Satu resource per kotak.',
  spread: 'Sebar resource ke lebih dari satu kotak.',
}

/** Drag resources into a diagram (zones, regions, subnets) until the rule holds. */
export function PlaceInput({ exercise, response, onChange, reveal, locked }: InputProps<PlaceExercise, (number | null)[]>) {
  const { pieceOk } = judgePlace(exercise, response)
  const lookFor = (i: number): Look => (!reveal ? 'idle' : pieceOk[i] ? 'right' : 'wrong')
  return (
    <div>
      <p className="mb-3 text-13 font-semibold text-tinta-lembut">{RULE_HINT[exercise.rule]}</p>
      <ItemBoard
        variant="zones"
        trayLabel="resource yang belum ditaruh"
        items={exercise.pieces.map((p) => p.text)}
        itemOrder={exercise.pieces.map((_, i) => i)}
        containers={exercise.zones.map((title, id) => ({ id, title }))}
        placement={response}
        onPlace={(piece, zone) => onChange(response.map((z, i) => (i === piece ? zone : z)))}
        locked={reveal || !!locked}
        lookFor={lookFor}
      />
    </div>
  )
}
