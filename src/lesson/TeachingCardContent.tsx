import { Check, ExternalLink, Lightbulb, TriangleAlert } from 'lucide-react'
import { GlossaryText } from '../components/GlossaryText'
import type { TeachingCard } from '../lib/types'
import { Visual } from '../visuals/Visual'

/** Where a "read more" link goes, in words: Microsoft Learn for the Azure courses, the source site for CCNA. */
function linkSite(url: string): string {
  const host = (() => {
    try {
      return new URL(url).hostname
    } catch {
      return ''
    }
  })()
  if (host.endsWith('learn.microsoft.com')) return 'Microsoft Learn'
  if (host.endsWith('cisco.com') || host.endsWith('netacad.com')) return 'situs Cisco'
  if (host.endsWith('rfc-editor.org') || host.endsWith('ietf.org')) return 'RFC (IETF)'
  if (host.endsWith('ieee.org')) return 'situs IEEE'
  if (host.endsWith('ansible.com') || host === 'github.com') return 'dokumentasi Ansible'
  return host || 'sumber resmi'
}

/**
 * The inside of a learn card (LANGIT_AZ900_PERBAIKAN_MATERI.md section 3):
 * visual on top, then the text. Older intro cards show their title, visual,
 * and body the same way. Used in lessons, the material sheet, and the unit guide.
 */
export function TeachingCardContent({ card, titleId, heading = 'h2' }: { card: TeachingCard; titleId: string; heading?: 'h2' | 'h3' }) {
  const learn = card.type === 'learn' ? card : undefined
  const Heading = heading
  return (
    <>
      {card.visual && (
        <div className="mb-4">
          <Visual name={card.visual} />
        </div>
      )}
      <Heading id={titleId} className="min-w-0 font-display text-[clamp(20px,6.4vw,26px)] leading-[1.2] font-bold hyphens-auto wrap-break-word">
        {card.title}
      </Heading>
      <p className="mt-2 text-17">
        <GlossaryText text={card.body} />
      </p>
      {learn && learn.keyPoints.length > 0 && (
        <ul className="mt-4 space-y-2" aria-label="Poin kunci">
          {learn.keyPoints.map((point) => (
            <li key={point} className="flex items-start gap-2 text-15">
              <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint">
                <Check size={13} strokeWidth={3.5} />
              </span>
              <span className="min-w-0">
                <GlossaryText text={point} />
              </span>
            </li>
          ))}
        </ul>
      )}
      {learn?.example && (
        <div className="mt-4 rounded-xl bg-langit p-3">
          <p className="flex items-center gap-1.5 font-display text-13 font-bold text-tinta-lembut">
            <Lightbulb size={15} aria-hidden="true" />
            Contoh
          </p>
          <p className="mt-1 text-15">
            <GlossaryText text={learn.example} />
          </p>
        </div>
      )}
      {learn?.trap && (
        <div className="mt-3 rounded-xl border-2 border-matahari bg-matahari-muda p-3">
          <p className="flex items-center gap-1.5 font-display text-13 font-bold">
            <TriangleAlert size={15} aria-hidden="true" />
            Jebakan ujian
          </p>
          <p className="mt-1 text-15">
            <GlossaryText text={learn.trap} />
          </p>
        </div>
      )}
      {learn?.link && (
        <a
          href={learn.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-display text-15 font-bold text-biru-dalam underline underline-offset-4"
        >
          Baca lebih lanjut di {linkSite(learn.link)}
          <ExternalLink size={15} aria-hidden="true" />
          <span className="sr-only">(membuka tab baru)</span>
        </a>
      )}
    </>
  )
}
