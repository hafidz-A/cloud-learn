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

  it.each(VISUAL_NAMES)('%s gives its markers and patterns ids that differ per instance', (name) => {
    const ids = (html: string) => [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1])
    const twice = renderToStaticMarkup(createElement('div', null, createElement(VISUALS[name]!), createElement(VISUALS[name]!)))
    const all = ids(twice)
    expect(new Set(all).size).toBe(all.length)
  })
})
