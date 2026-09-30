import type { TopologyLink, TopologyNode } from '../lib/types'

/** How each link kind is drawn: line dash and the word on the line. */
export const LINK_LOOK: Record<TopologyLink['kind'], { dash?: string; text: string }> = {
  peering: { text: 'peering' },
  vpn: { dash: '7 5', text: 'VPN' },
  route: { dash: '2 5', text: 'route' },
}

/** Plain-language summary of the links, for the aria-label and the list under the drawing. */
export function linkSentences(nodes: TopologyNode[], links: TopologyLink[]): string[] {
  const name = (id: string) => nodes.find((n) => n.id === id)?.label ?? id
  return links.map((l) => `${name(l.from)} ↔ ${name(l.to)}: ${LINK_LOOK[l.kind].text}`)
}
