import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { ITEMS, answer, main, next } from './helpers'

// WCAG 2.1 AA scan of every main screen (plan section 7: "uji aksesibilitas").

test.use({ reducedMotion: 'reduce' })

async function scan(page: Page, name: string) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const summary = results.violations.map((v) => `${name}: ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target.join(' ')}`)
  expect(summary).toEqual([])
}

for (const [name, hash] of [
  ['home', '/'],
  ['latihan', '/#/latihan'],
  ['ujian', '/#/ujian'],
  ['statistik', '/#/statistik'],
  ['glosarium', '/#/glosarium'],
  ['pengaturan', '/#/pengaturan'],
] as const) {
  test(`${name} has no accessibility violations`, async ({ page }) => {
    await page.goto(hash)
    await page.waitForTimeout(300)
    await scan(page, name)
  })
}

test('lesson screens have no accessibility violations', async ({ page }) => {
  await page.goto('/#/lesson/u07-l2')
  await scan(page, 'intro card with diagram')
  await next(page)
  const item = ITEMS.get((await main(page).getAttribute('data-item-id'))!)!
  await scan(page, `exercise ${item.type}`)
  await answer(page, item, { wrong: true })
  await scan(page, 'feedback sheet')
})

test('the running exam has no accessibility violations', async ({ page }) => {
  await page.goto('/#/ujian')
  await page.getByRole('button', { name: 'Mulai' }).first().click()
  await expect(page.getByRole('timer')).toBeVisible()
  await scan(page, 'exam question')
  await page.getByRole('button', { name: 'Daftar nomor soal' }).click()
  await scan(page, 'exam grid')
  await page.getByRole('dialog').getByRole('button', { name: 'Kumpulkan' }).click()
  await page.getByRole('button', { name: 'Kumpulkan sekarang' }).click()
  await expect(page.getByRole('heading', { name: 'Skor kamu' })).toBeVisible()
  await scan(page, 'exam result')
  await page.getByRole('button', { name: 'Lihat pembahasan' }).click()
  await scan(page, 'exam review')
})
