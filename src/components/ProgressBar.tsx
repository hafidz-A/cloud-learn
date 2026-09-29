import { motion } from 'framer-motion'

/** Lesson progress: Kabut track with a Biru langit fill that grows. */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className="h-4 flex-1 overflow-hidden rounded-full bg-kabut"
    >
      <motion.div
        className="relative h-full overflow-hidden rounded-full bg-biru"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      >
        <span className="absolute inset-x-2 top-1 h-1 rounded-full bg-white/35" />
      </motion.div>
    </div>
  )
}
