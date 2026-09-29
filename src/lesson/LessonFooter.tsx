import type { ReactNode } from 'react'
import { Button } from '../components/Button'
import { useLessonKeys } from './useLessonKeys'

/** Sticky bottom bar of the lesson player. The feedback sheet slides over it. */
export function LessonFooter({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-[480px] border-t-2 border-kabut bg-langit px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-4">
      {children}
    </div>
  )
}

/** The big "Periksa" button. Enter also checks when focus is not on a control. */
export function CheckFooter({ disabled, answered, onCheck }: { disabled: boolean; answered: boolean; onCheck: () => void }) {
  useLessonKeys(!answered && !disabled, (key) => {
    if (key !== 'Enter') return
    onCheck()
    return true
  })
  return (
    <LessonFooter>
      <Button block disabled={disabled || answered} onClick={onCheck}>
        Periksa
      </Button>
    </LessonFooter>
  )
}
