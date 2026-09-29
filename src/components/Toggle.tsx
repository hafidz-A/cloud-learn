/** Accessible on/off switch. */
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (on: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 transition-colors motion-reduce:transition-none ${
        checked ? 'border-biru-dalam bg-biru' : 'border-kabut-dalam bg-kabut'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-[left] motion-reduce:transition-none ${checked ? 'left-6' : 'left-0.5'}`}
      />
    </button>
  )
}
