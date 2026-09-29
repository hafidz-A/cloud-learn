import type { SortExercise } from '../../lib/types'
import type { InputProps, Look } from '../looks'
import { ItemBoard } from './ItemBoard'

/** Put every card into the right bucket (IaaS/PaaS/SaaS, CapEx/OpEx, ...). */
export function SortInput({ exercise, response, onChange, layout, reveal, locked }: InputProps<SortExercise, (number | null)[]>) {
  const lookFor = (i: number): Look => (!reveal ? 'idle' : response[i] === exercise.items[i].bucket ? 'right' : 'wrong')
  return (
    <ItemBoard
      variant="buckets"
      trayLabel="kartu yang belum ditaruh"
      items={exercise.items.map((i) => i.text)}
      itemOrder={layout}
      containers={exercise.buckets.map((title, id) => ({ id, title }))}
      placement={response}
      onPlace={(item, bucket) => onChange(response.map((b, i) => (i === item ? bucket : b)))}
      locked={reveal || !!locked}
      lookFor={lookFor}
      noteFor={(i) => (reveal && response[i] !== exercise.items[i].bucket ? `→ ${exercise.buckets[exercise.items[i].bucket]}` : undefined)}
    />
  )
}
