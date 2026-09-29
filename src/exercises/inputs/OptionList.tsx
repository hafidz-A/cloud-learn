import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { SHAKE } from '../../lesson/motion'
import { useLessonKeys } from '../../lesson/useLessonKeys'
import { BADGE_LOOKS, CARD_LOOKS, type Look } from '../looks'
import { GlossaryText } from '../../components/GlossaryText'

/**
 * Vertical answer cards used by choice, fix, and multi. Digits 1-9 pick an
 * option by its position on screen.
 */
export function OptionList({
  options,
  layout,
  selected,
  onToggle,
  lookFor,
  locked,
  checkbox = false,
}: {
  options: string[]
  layout: number[]
  selected: number[]
  onToggle: (option: number) => void
  lookFor: (option: number) => Look
  locked: boolean
  checkbox?: boolean
}) {
  useLessonKeys(!locked, (key) => {
    const n = Number(key)
    if (!Number.isInteger(n) || n < 1 || n > layout.length) return
    onToggle(layout[n - 1])
    return true
  })

  return (
    <ul className="space-y-3" lang="en">
      {layout.map((option, position) => {
        const lookName = lookFor(option)
        const look = CARD_LOOKS[lookName]
        const isSelected = selected.includes(option)
        return (
          <motion.li key={option} animate={lookName === 'wrong' && isSelected ? SHAKE : undefined}>
            <button
              type="button"
              data-option
              aria-pressed={isSelected}
              disabled={locked}
              onClick={() => onToggle(option)}
              className={`btn-3d flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-17 font-semibold hyphens-auto ${look.className} ${
                locked ? '' : 'cursor-pointer'
              }`}
              style={{ '--edge': look.edge } as CSSProperties}
            >
              <span
                aria-hidden="true"
                className={`flex h-7 w-7 shrink-0 items-center justify-center border-2 font-display text-13 font-bold ${
                  checkbox ? 'rounded-md' : 'rounded-lg'
                } ${BADGE_LOOKS[lookName]}`}
              >
                {checkbox && isSelected ? <Check size={16} strokeWidth={3.5} /> : position + 1}
              </span>
              <span>
                <GlossaryText text={options[option]} />
              </span>
            </button>
          </motion.li>
        )
      })}
    </ul>
  )
}
