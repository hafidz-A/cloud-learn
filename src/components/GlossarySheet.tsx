import { motion } from 'framer-motion'
import { useEffect, useEffectEvent, useState } from 'react'
import { findTerm, type GlossaryEntry } from '../content/glossary'
import { useCourse } from '../store/course'
import { Button } from './Button'

const HOLD_MS = 450
const MOVE_TOLERANCE = 10

/**
 * Long press on an abbreviation (an <abbr data-term> from GlossaryText) opens
 * its glossary card, anywhere in the app. The click that ends the press is
 * swallowed so it does not also pick an answer.
 */
export function GlossaryPressLayer() {
  const [entry, setEntry] = useState<GlossaryEntry | null>(null)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let start: { x: number; y: number } | null = null
    let swallowClick = false

    const cancel = () => {
      clearTimeout(timer)
      start = null
    }
    const onDown = (e: PointerEvent) => {
      const abbr = (e.target as Element | null)?.closest?.('abbr[data-term]')
      if (!abbr) return
      start = { x: e.clientX, y: e.clientY }
      const term = abbr.getAttribute('data-term')!
      timer = setTimeout(() => {
        const found = findTerm(term, useCourse.getState().active)
        if (found) {
          swallowClick = true
          setEntry(found)
          setTimeout(() => (swallowClick = false), 700)
        }
      }, HOLD_MS)
    }
    const onMove = (e: PointerEvent) => {
      if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > MOVE_TOLERANCE) cancel()
    }
    const onClick = (e: MouseEvent) => {
      if (!swallowClick) return
      swallowClick = false
      e.preventDefault()
      e.stopPropagation()
    }
    const onContextMenu = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.('abbr[data-term]')) e.preventDefault()
    }

    document.addEventListener('pointerdown', onDown, true)
    document.addEventListener('pointermove', onMove, true)
    document.addEventListener('pointerup', cancel, true)
    document.addEventListener('pointercancel', cancel, true)
    document.addEventListener('click', onClick, true)
    document.addEventListener('contextmenu', onContextMenu, true)
    return () => {
      cancel()
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('pointermove', onMove, true)
      document.removeEventListener('pointerup', cancel, true)
      document.removeEventListener('pointercancel', cancel, true)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('contextmenu', onContextMenu, true)
    }
  }, [])

  return entry ? <GlossarySheet entry={entry} onClose={() => setEntry(null)} /> : null
}

export function GlossarySheet({ entry, onClose }: { entry: GlossaryEntry; onClose: () => void }) {
  const onKey = useEffectEvent((e: KeyboardEvent) => e.key === 'Escape' && onClose())
  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKey(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-tinta/40" onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="glossary-term"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] rounded-t-3xl bg-white px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-5"
      >
        <p className="font-display text-13 font-semibold text-tinta-lembut">Glosarium</p>
        <h2 id="glossary-term" className="font-display text-28 font-bold">
          {entry.term}
        </h2>
        <p lang="en" className="text-17 font-bold">
          {entry.expansion}
        </p>
        <p className="mt-3 text-15">{entry.description}</p>
        <Button block className="mt-5" autoFocus onClick={onClose}>
          Tutup
        </Button>
      </motion.div>
    </div>
  )
}
