import { expect, test } from '@playwright/test'
import { AZ104_UNITS, CCNA_UNITS, UNITS } from './helpers'

// Every diagram draws its text inside its own viewBox (docs/BUGS_LOG.md: SVG text
// that ran out of its box). The unit guide shows all of a unit's learn cards.

test.use({ reducedMotion: 'reduce' })

test('diagram text stays inside the drawing, in every course', async ({ page }) => {
  test.setTimeout(240_000)
  const problems: string[] = []
  for (const unit of [...UNITS, ...AZ104_UNITS, ...CCNA_UNITS]) {
    await page.goto(`/#/guide/${unit.id}`)
    await page.waitForTimeout(200)
    await page.evaluate(() => document.fonts.ready)
    problems.push(
      ...(await page.evaluate((unitId) => {
        const out: string[] = []
        for (const svg of document.querySelectorAll<SVGSVGElement>('svg[role="img"][viewBox]')) {
          const [, , w, h] = svg.getAttribute('viewBox')!.split(/\s+/).map(Number)
          for (const t of svg.querySelectorAll<SVGTextElement>('text')) {
            const b = t.getBBox()
            if (b.x < -1 || b.y < -1 || b.x + b.width > w + 1 || b.y + b.height > h + 1)
              out.push(`${unitId}: "${t.textContent}" at ${Math.round(b.x)},${Math.round(b.y)} size ${Math.round(b.width)}x${Math.round(b.height)} in ${w}x${h}`)
          }
        }
        return out
      }, unit.id)),
    )
  }
  expect(problems).toEqual([])
})
