import { useEffect, useEffectEvent } from 'react'

function closest(target: EventTarget | null, selector: string): boolean {
  return target instanceof Element && target.closest(selector) !== null
}

/**
 * Lesson keyboard shortcuts (digits, arrows, Enter). Enter and Space aimed at a
 * focused control keep their native click, so nothing is handled twice. The
 * exception is Enter on an answer that is already selected (`data-option` with
 * aria-pressed="true"): that checks the answer, so "click an option, press
 * Enter" works.
 */
export function useLessonKeys(enabled: boolean, onKey: (key: string) => boolean | void) {
  const handle = useEffectEvent((e: KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return
    const activation = e.key === 'Enter' || e.key === ' '
    const onControl = closest(e.target, 'button, a, input, textarea, select, [role="button"]')
    const onSelectedOption = e.key === 'Enter' && closest(e.target, '[data-option][aria-pressed="true"]')
    if (activation && onControl && !onSelectedOption) return
    if (onKey(e.key)) e.preventDefault()
  })
  useEffect(() => {
    if (!enabled) return
    const listener = (e: KeyboardEvent) => handle(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [enabled])
}
