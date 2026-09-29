import {
  DndContext,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  type CollisionDetection,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useState, type CSSProperties, type ReactNode } from 'react'
import { CARD_LOOKS, type Look } from '../looks'
import { useDragSensors } from './sensors'

// Shared board for "sort" (cards into buckets) and "place" (resources into a
// diagram). Cards can be dragged, or tapped and then dropped with a tap on the
// target, which also works from the keyboard.

const TRAY = 'tray'

const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args)
  return hits.length ? hits : rectIntersection(args)
}

type Container = { id: number; title: string; hint?: string }

function Chip({
  id,
  label,
  look,
  selected,
  disabled,
  onTap,
  note,
}: {
  id: number
  label: string
  look: Look
  selected: boolean
  disabled: boolean
  onTap: () => void
  note?: string
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `item-${id}`, disabled })
  const l = CARD_LOOKS[selected ? 'selected' : look]
  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      onClick={(e) => {
        e.stopPropagation()
        if (!disabled) onTap()
      }}
      className={`btn-3d min-h-11 rounded-xl border-2 px-3 py-1.5 text-left text-15 font-bold [touch-action:manipulation] ${l.className} ${
        isDragging ? 'opacity-40' : ''
      } ${disabled ? '' : 'cursor-grab'}`}
      style={{ '--edge': l.edge } as CSSProperties}
    >
      {label}
      {note && <span className="block text-13 font-semibold text-tinta-lembut">{note}</span>}
    </button>
  )
}

function Zone({
  id,
  selecting,
  disabled,
  onTap,
  className,
  children,
  label,
  actionLabel,
}: {
  id: string
  selecting: boolean
  disabled: boolean
  onTap: () => void
  className: string
  children: ReactNode
  label: string
  actionLabel: string
}) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled })
  const target = selecting && !disabled
  return (
    // A tap anywhere in the zone drops the selected card; the button inside does the same for keyboards.
    <div
      ref={setNodeRef}
      onClick={() => target && onTap()}
      className={`${className} ${target || isOver ? 'border-biru bg-biru-muda' : ''} ${isOver ? 'ring-4 ring-biru/30' : ''} ${
        target ? 'cursor-pointer' : ''
      }`}
    >
      {children}
      {target && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onTap()
          }}
          aria-label={`${actionLabel}: ${label}`}
          className="mt-2 w-full cursor-pointer rounded-lg border-2 border-dashed border-biru px-2 py-1 font-display text-13 font-semibold text-tinta"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export function ItemBoard({
  items,
  itemOrder,
  containers,
  placement,
  onPlace,
  locked,
  lookFor,
  noteFor,
  variant,
  trayLabel,
}: {
  items: string[]
  itemOrder: number[]
  containers: Container[]
  placement: (number | null)[]
  onPlace: (item: number, container: number | null) => void
  locked: boolean
  lookFor: (item: number) => Look
  noteFor?: (item: number) => string | undefined
  variant: 'buckets' | 'zones'
  trayLabel: string
}) {
  const sensors = useDragSensors()
  const [selected, setSelected] = useState<number | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)

  const place = (item: number, container: number | null) => {
    onPlace(item, container)
    setSelected(null)
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setDragging(null)
    if (!over) return
    const item = Number(String(active.id).slice(5))
    place(item, over.id === TRAY ? null : Number(String(over.id).slice(10)))
  }

  const chip = (item: number) => (
    <Chip
      key={item}
      id={item}
      label={items[item]}
      look={lookFor(item)}
      selected={selected === item}
      disabled={locked}
      note={noteFor?.(item)}
      onTap={() => setSelected(selected === item ? null : item)}
    />
  )

  const inTray = itemOrder.filter((i) => placement[i] === null)
  const selecting = selected !== null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collision}
      onDragStart={({ active }) => setDragging(Number(String(active.id).slice(5)))}
      onDragCancel={() => setDragging(null)}
      onDragEnd={onDragEnd}
    >
      <div lang="en">
        {!(locked && inTray.length === 0) && (
          <Zone
            id={TRAY}
            label={trayLabel}
            actionLabel="Kembalikan ke sini"
            selecting={selecting && placement[selected!] !== null}
            disabled={locked}
            onTap={() => selected !== null && place(selected, null)}
            className="flex min-h-16 flex-wrap content-start gap-2 rounded-2xl border-2 border-dashed border-kabut p-3"
          >
            {inTray.length === 0 ? (
              <p className="self-center text-13 text-tinta-lembut">Semua kartu sudah ditaruh.</p>
            ) : (
              inTray.map(chip)
            )}
          </Zone>
        )}

        <div className={`mt-4 ${variant === 'zones' ? 'grid gap-3' : 'space-y-3'}`} style={variant === 'zones' ? { gridTemplateColumns: `repeat(${Math.min(containers.length, 3)}, minmax(0, 1fr))` } : undefined}>
          {containers.map((c) => (
            <Zone
              key={c.id}
              id={`container-${c.id}`}
              label={c.title}
              actionLabel="Taruh di sini"
              selecting={selecting && placement[selected!] !== c.id}
              disabled={locked}
              onTap={() => selected !== null && place(selected, c.id)}
              className={`rounded-2xl border-2 p-3 ${
                variant === 'zones' ? 'min-h-32 border-biru bg-white' : 'min-h-20 border-kabut bg-white'
              }`}
            >
              <p className="font-display text-15 font-bold">{c.title}</p>
              {c.hint && <p className="text-13 text-tinta-lembut">{c.hint}</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                {itemOrder.filter((i) => placement[i] === c.id).map(chip)}
              </div>
            </Zone>
          ))}
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {dragging !== null && (
          <div className="btn-3d rounded-xl border-2 border-biru bg-biru-muda px-3 py-1.5 text-15 font-bold shadow-lg" style={{ '--edge': 'var(--color-biru)' } as CSSProperties}>
            {items[dragging]}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
