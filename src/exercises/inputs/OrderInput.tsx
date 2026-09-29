import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { OrderExercise } from '../../lib/types'
import { CARD_LOOKS, type InputProps, type Look } from '../looks'
import { useDragSensors } from './sensors'

function Row({
  item,
  text,
  position,
  count,
  look,
  locked,
  onMove,
  note,
}: {
  item: number
  text: string
  position: number
  count: number
  look: Look
  locked: boolean
  onMove: (delta: number) => void
  note?: string
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item, disabled: locked })
  const l = CARD_LOOKS[look]
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, '--edge': l.edge } as CSSProperties}
      className={`btn-3d flex items-center gap-2 rounded-2xl border-2 py-2 pl-2 pr-1 ${l.className} ${isDragging ? 'relative z-10 shadow-lg' : ''}`}
    >
      <span
        {...attributes}
        {...listeners}
        aria-label={`Seret ${text}`}
        className={`flex h-10 w-8 shrink-0 items-center justify-center text-tinta-lembut [touch-action:none] ${locked ? '' : 'cursor-grab'}`}
      >
        <GripVertical size={20} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 text-15 font-bold hyphens-auto wrap-anywhere">
        {text}
        {note && <span className="block text-13 font-semibold text-tinta-lembut">{note}</span>}
      </span>
      {!locked && (
        <span className="flex shrink-0">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={position === 0}
            aria-label={`Naikkan ${text}`}
            className="flex h-11 w-9 cursor-pointer items-center justify-center rounded-lg text-tinta-lembut disabled:cursor-default disabled:opacity-30"
          >
            <ChevronUp size={22} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={position === count - 1}
            aria-label={`Turunkan ${text}`}
            className="flex h-11 w-9 cursor-pointer items-center justify-center rounded-lg text-tinta-lembut disabled:cursor-default disabled:opacity-30"
          >
            <ChevronDown size={22} aria-hidden="true" />
          </button>
        </span>
      )}
    </li>
  )
}

/** Arrange the cards top to bottom: drag the grip, or use the arrow buttons. */
export function OrderInput({ exercise, response, onChange, reveal, locked }: InputProps<OrderExercise, number[]>) {
  const sensors = useDragSensors()
  const isLocked = reveal || !!locked
  const move = (from: number, to: number) => onChange(arrayMove(response, from, to))

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    move(response.indexOf(Number(active.id)), response.indexOf(Number(over.id)))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext items={response} strategy={verticalListSortingStrategy}>
        <ol className="space-y-2" lang="en" aria-label="Urutan jawaban">
          {response.map((item, position) => (
            <Row
              key={item}
              item={item}
              text={exercise.items[item]}
              position={position}
              count={response.length}
              locked={isLocked}
              look={!reveal ? 'idle' : item === position ? 'right' : 'wrong'}
              note={reveal && item !== position ? `Seharusnya nomor ${item + 1}` : undefined}
              onMove={(delta) => move(position, position + delta)}
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  )
}
