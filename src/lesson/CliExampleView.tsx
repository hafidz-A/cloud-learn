import { SquareTerminal } from 'lucide-react'
import { useMemo } from 'react'
import { GlossaryText } from '../components/GlossaryText'
import { runSession, type TermLine } from '../ios/engine'
import type { CliExample } from '../lib/types'

const MODEL_LABEL: Record<CliExample['device']['model'], string> = { isr4331: 'ISR4331', c2960: 'Catalyst 2960', c3650: 'Catalyst 3650' }

type Step = { input: Extract<TermLine, { kind: 'in' }>; output: TermLine[]; note: string }

/**
 * A worked example on the CLI simulator (LANGIT_CCNA_PLAN.md section 7): each
 * typed line with the device's answer, as the terminal of an `ios` question
 * shows them, and under it what the line does.
 */
export function CliExampleView({ cli }: { cli: CliExample }) {
  const steps = useMemo(() => {
    const { transcript } = runSession({ hostname: cli.device.hostname, model: cli.device.model, start: cli.start, given: cli.given, cabled: cli.cabled }, cli.steps.map((s) => s.command))
    const out: Step[] = []
    for (const line of transcript) {
      if (line.kind === 'in') out.push({ input: line, output: [], note: cli.steps[out.length]?.note ?? '' })
      else out.at(-1)?.output.push(line)
    }
    return out
  }, [cli])

  return (
    <section className="mt-4" aria-label="Contoh di console">
      <p className="flex items-center gap-1.5 font-display text-13 font-bold text-tinta-lembut">
        <SquareTerminal size={15} aria-hidden="true" />
        Contoh di console · {cli.device.hostname} ({MODEL_LABEL[cli.device.model]})
      </p>
      <ol className="mt-2 space-y-2">
        {steps.map((s, i) => (
          <li key={i}>
            <div className="overflow-hidden rounded-xl bg-tinta px-3 py-2 font-mono text-13 leading-relaxed text-white" lang="en">
              <div className="whitespace-pre-wrap wrap-anywhere">
                <span className="text-white/80">{s.input.prompt}</span>
                {s.input.hidden ? '' : s.input.text || '⏎'}
              </div>
              {s.output.map((o, j) => (
                <div key={j} className="whitespace-pre-wrap wrap-anywhere text-white/90">
                  {o.text || ' '}
                </div>
              ))}
            </div>
            <p className="mt-1 px-1 text-15">
              <GlossaryText text={s.note} />
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
