import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { VISUAL_NAMES } from '../content/visuals'
import { VISUALS } from './registry'

// Rules for diagrams (LANGIT_AZ900_PERBAIKAN_MATERI.md section 5).
describe('visual catalog', () => {
  it('has a component for every catalog entry', () => {
    expect(VISUAL_NAMES.filter((name) => !VISUALS[name])).toEqual([])
  })

  it.each(VISUAL_NAMES)('%s is a labeled 300-wide image with text of 12px or more', (name) => {
    const html = renderToStaticMarkup(createElement(VISUALS[name]!))
    expect(html).toMatch(/^<svg viewBox="0 0 300 \d+" role="img" aria-label="[^"]{40,}"/)
    const sizes = [...html.matchAll(/font-size="([\d.]+)"/g)].map((m) => Number(m[1]))
    expect(sizes.length).toBeGreaterThan(0)
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(12)
  })

  // SVG draws a marker only at the end of the last subpath, so a path like
  // "M0 0 V10 M20 0 V10" with an arrowhead shows one arrow and one bare line.
  it.each(VISUAL_NAMES)('%s draws each arrow as its own path', (name) => {
    const html = renderToStaticMarkup(createElement(VISUALS[name]!))
    const arrows = [...html.matchAll(/<path\b[^>]*>/g)].map((m) => m[0]).filter((tag) => /marker-end=/.test(tag))
    for (const tag of arrows) expect(/ d="([^"]*)"/.exec(tag)![1].match(/M/g)!.length, tag).toBe(1)
  })

  it.each(VISUAL_NAMES)('%s gives its markers and patterns ids that differ per instance', (name) => {
    const ids = (html: string) => [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1])
    const twice = renderToStaticMarkup(createElement('div', null, createElement(VISUALS[name]!), createElement(VISUALS[name]!)))
    const all = ids(twice)
    expect(new Set(all).size).toBe(all.length)
  })
})
