import { CircleAlert, ExternalLink, FlaskConical, Timer, Wrench } from 'lucide-react'
import { LAB_TOOLS } from '../content/labs'
import type { Lab } from '../lib/types'
import { NetDiagramView } from '../visuals/NetDiagram'
import { GlossaryText } from './GlossaryText'

/** A hostname-style label for the device a step or check runs on. */
function DeviceTag({ device }: { device?: string }) {
  if (!device) return null
  return <span className="mr-1.5 rounded-md bg-tinta px-1.5 py-0.5 font-mono text-13 font-semibold text-white">{device}</span>
}

/** Commands to type, one per line, in a terminal-looking block. */
function Commands({ lines }: { lines: string[] }) {
  return (
    <pre lang="en" className="mt-2 overflow-hidden rounded-xl bg-tinta px-3 py-2 font-mono text-13 leading-relaxed text-white">
      {lines.map((line, i) => (
        <code key={i} className="block whitespace-pre-wrap wrap-anywhere">
          {line}
        </code>
      ))}
    </pre>
  )
}

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/**
 * One lab, usually in Packet Tracer (LANGIT_CCNA_PLAN.md section 8): tool and status, goal,
 * topology, addressing, steps, how to prove it works, notes, and sources.
 */
export function LabCard({ lab }: { lab: Lab }) {
  const tested = lab.testedIn?.length ? lab.testedIn : null
  return (
    <article className="space-y-5" data-lab={lab.lesson}>
      <div className="flex flex-wrap items-center gap-2 text-15">
        <span className="inline-flex items-center gap-1 rounded-lg bg-biru-muda px-2 py-0.5 font-display text-13 font-bold">
          <Wrench size={14} aria-hidden="true" />
          {LAB_TOOLS[lab.tool]}
        </span>
        <span className="inline-flex items-center gap-1 text-tinta-lembut">
          <Timer size={16} aria-hidden="true" />
          sekitar {lab.minutes} menit
        </span>
      </div>
      <p
        className={`flex items-start gap-2 rounded-xl p-3 text-13 ${tested ? 'bg-mint-muda' : 'border-2 border-matahari bg-matahari-muda'}`}
        data-lab-tested={tested ? 'yes' : 'no'}
      >
        {tested ? <FlaskConical size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> : <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />}
        <span>
          {tested
            ? `Sudah dicoba langsung di ${tested.join(', ')}.`
            : `Belum dicoba langsung di ${LAB_TOOLS[lab.tool]}. Langkah dan perintahnya dicek ke dokumentasi resmi. Kalau hasilmu berbeda, catat perbedaannya supaya lab ini diperbaiki.`}
        </span>
      </p>

      <section aria-labelledby={`lab-goal-${lab.lesson}`}>
        <h2 id={`lab-goal-${lab.lesson}`} className="font-display text-17 font-bold">
          Tujuan
        </h2>
        <p className="mt-1 text-15">
          <GlossaryText text={lab.goal} />
        </p>
      </section>

      <figure className="rounded-2xl border-2 border-kabut bg-white p-3">
        <NetDiagramView diagram={lab.topology} />
      </figure>

      {lab.addressing && lab.addressing.length > 0 && (
        <section aria-labelledby={`lab-addr-${lab.lesson}`}>
          <h2 id={`lab-addr-${lab.lesson}`} className="font-display text-17 font-bold">
            Tabel alamat
          </h2>
          <table className="mt-2 w-full border-collapse overflow-hidden rounded-xl bg-white text-13" lang="en">
            <thead>
              <tr className="bg-kabut text-left font-display">
                <th className="px-2 py-1.5">Perangkat</th>
                <th className="px-2 py-1.5">Interface</th>
                <th className="px-2 py-1.5">Alamat</th>
              </tr>
            </thead>
            <tbody>
              {lab.addressing.map((row, i) => (
                <tr key={i} className="border-t border-kabut">
                  <td className="px-2 py-1.5 font-semibold">{row.device}</td>
                  <td className="px-2 py-1.5 font-mono wrap-anywhere">{row.port}</td>
                  <td className="px-2 py-1.5 font-mono wrap-anywhere">{row.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section aria-labelledby={`lab-steps-${lab.lesson}`}>
        <h2 id={`lab-steps-${lab.lesson}`} className="font-display text-17 font-bold">
          Langkah
        </h2>
        <ol className="mt-2 list-decimal space-y-3 pl-5 text-15">
          {lab.steps.map((step, i) => (
            <li key={i}>
              <DeviceTag device={step.device} />
              <GlossaryText text={step.text} />
              {step.commands && <Commands lines={step.commands} />}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby={`lab-check-${lab.lesson}`}>
        <h2 id={`lab-check-${lab.lesson}`} className="font-display text-17 font-bold">
          Cara membuktikan
        </h2>
        <ul className="mt-2 space-y-3 text-15">
          {lab.checks.map((check, i) => (
            <li key={i} className="rounded-xl border-2 border-kabut bg-white p-3">
              <DeviceTag device={check.device} />
              <GlossaryText text={check.text} />
              {check.command && <Commands lines={[check.command]} />}
              <p className="mt-2 text-13">
                <b className="font-display">Yang harus terlihat:</b> <GlossaryText text={check.expect} />
              </p>
            </li>
          ))}
        </ul>
      </section>

      {lab.notes && lab.notes.length > 0 && (
        <section aria-labelledby={`lab-notes-${lab.lesson}`}>
          <h2 id={`lab-notes-${lab.lesson}`} className="font-display text-17 font-bold">
            Catatan
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-15">
            {lab.notes.map((note, i) => (
              <li key={i}>
                <GlossaryText text={note} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby={`lab-src-${lab.lesson}`}>
        <h2 id={`lab-src-${lab.lesson}`} className="font-display text-17 font-bold">
          Sumber
        </h2>
        <ul className="mt-1 space-y-1 text-15">
          {lab.sources.map((url) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-tinta underline underline-offset-4 wrap-anywhere">
                {hostOf(url)}
                <ExternalLink size={14} aria-hidden="true" />
                <span className="sr-only">(membuka tab baru)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
