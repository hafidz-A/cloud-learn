import { useEffect, useRef } from 'react'

/**
 * Instruction (Indonesian) plus the English prompt. Takes focus when a new
 * exercise appears so screen readers start at the question.
 */
export function ExerciseHeader({ instruction, prompt, verify }: { instruction: string; prompt?: string; verify?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div ref={ref} tabIndex={-1} className="outline-none">
      <p className="font-display text-15 font-semibold text-tinta-lembut">
        {instruction}
        {verify && import.meta.env.DEV && (
          <span className="ml-2 rounded-md bg-matahari-muda px-1.5 py-0.5 text-13 text-tinta">verify</span>
        )}
      </p>
      {prompt && (
        <h2 lang="en" className={`mt-2 font-bold ${prompt.length < 90 ? 'text-20' : 'text-17'}`}>
          {prompt}
        </h2>
      )}
    </div>
  )
}
