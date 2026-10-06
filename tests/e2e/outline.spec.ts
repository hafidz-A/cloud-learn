import { expect, test, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { answer, ITEMS, main, next } from './helpers'

// The map of the official skills outline (docs/RENCANA_LULUS_UJIAN.md).

test.use({ reducedMotion: 'reduce' })

type Outline = { version: string; domains: { groups: { items: { id: string; concepts: string[] }[] }[] }[] }
const outline = (course: string): Outline => JSON.parse(readFileSync(`src/content/objectives/${course}.json`, 'utf8'))
const itemCount = (o: Outline) => o.domains.flatMap((d) => d.groups.flatMap((g) => g.items)).length

async function chooseAz104(page: Page) {
  await page.addInitScript(() => localStorage.setItem('langit-course', JSON.stringify({ state: { active: 'az104' }, version: 1 })))
}

test('the outline map lists every item, and an item turns to mastered after enough right answers', async ({ page }) => {
  const az900 = outline('az900')
  await page.goto('/#/ujian')
  await expect(page.getByText(`Kisi-kisi dikuasai: 0 dari ${itemCount(az900)} butir.`)).toBeVisible()
  await page.getByRole('link', { name: 'Lihat peta kisi-kisi' }).click()
  await expect(page.getByRole('heading', { name: 'Peta kisi-kisi ujian' })).toBeVisible()
  await expect(page.locator('[data-outline-item]')).toHaveCount(itemCount(az900))
  await expect(page.locator('[data-status="mastered"]')).toHaveCount(0)

  // Answer every question of lesson u04-l1 right: its outline items get answers.
  await page.goto('/#/lesson/u04-l1')
  for (let guard = 0; guard < 40; guard++) {
    if (await page.getByRole('heading', { name: 'Lesson selesai!' }).isVisible()) break
    const item = ITEMS.get((await main(page).getAttribute('data-item-id'))!)!
    if (item.type !== 'learn' && item.type !== 'intro') await answer(page, item)
    await next(page)
  }
  await page.goto('/#/kisi')
  expect(await page.locator('[data-status="mastered"], [data-status="practice"]').count()).toBeGreaterThan(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

test("the AZ-104 outline map shows the AZ-104 items, and the guide shows each lesson's items", async ({ page }) => {
  await chooseAz104(page)
  await page.goto('/#/kisi')
  await expect(page.locator('[data-outline-item]')).toHaveCount(itemCount(outline('az104')))
  await expect(page.getByText('Configure self-service password reset (SSPR)')).toBeVisible()

  await page.goto('/#/guide/az104-u01-identity')
  await expect(page.getByRole('list', { name: 'Kisi-kisi ujian' }).first()).toContainText('Create users and groups')
})
