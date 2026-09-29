import { useId } from 'react'

/**
 * A page-unique id for a marker or pattern inside a diagram. The same diagram
 * can show on several cards of one page (the unit guide), and fixed ids would
 * then collide, so every instance gets its own.
 */
export function useSvgId(name: string): string {
  return `${name}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
}
