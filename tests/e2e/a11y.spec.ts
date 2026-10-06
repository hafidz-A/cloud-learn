import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { answer, skipCards } from './helpers'

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
  ['panduan unit', '/#/guide/u01-cloud-computing'],
  ['peta kisi-kisi', '/#/kisi'],
] as const) {
  test(`${name} has no accessibility violations`, async ({ page }) => {
    await page.goto(hash)
    await page.waitForTimeout(300)
    await scan(page, name)
  })
}

test('the AZ-104 course screens have no accessibility violations', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('langit-course', JSON.stringify({ state: { active: 'az104' }, version: 1 })))
  for (const [name, hash] of [
    ['home AZ-104', '/'],
    ['latihan AZ-104', '/#/latihan'],
    ['ujian AZ-104', '/#/ujian'],
    ['statistik AZ-104', '/#/statistik'],
    ['panduan unit AZ-104', '/#/guide/az104-u01-identity'],
    ['peta kisi-kisi AZ-104', '/#/kisi'],
  ] as const) {
    await page.goto(hash)
    await page.waitForTimeout(300)
    await scan(page, name)
  }
  await page.goto('/')
  await page.locator('[data-node="az104-u01-l1"]').click()
  await scan(page, 'AZ-104 lesson popover')
})

test('lesson screens have no accessibility violations', async ({ page }) => {
  await page.goto('/#/lesson/u01-l2')
  await scan(page, 'learn card with diagram')
  const item = await skipCards(page)
  await scan(page, `exercise ${item.type}`)
  await page.getByRole('button', { name: 'Lihat materi' }).click()
  await scan(page, 'material sheet')
  await page.getByRole('button', { name: 'Kembali ke soal' }).click()
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

test('the AZ-104 case study section has no accessibility violations', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('langit-course', JSON.stringify({ state: { active: 'az104' }, version: 1 })))
  await page.goto('/#/ujian')
  await page.getByRole('button', { name: 'Mulai' }).first().click()
  await expect(page.getByRole('timer')).toBeVisible()
  const start = await page.evaluate(() => JSON.parse(localStorage.getItem('langit-progress')!).state.activeExam.caseStart as number)
  await page.getByRole('button', { name: 'Daftar nomor soal' }).click()
  await page.getByRole('button', { name: `Soal ${start}, belum dijawab` }).click()
  await page.getByRole('button', { name: 'Ke studi kasus' }).click()
  await scan(page, 'leave section sheet')
  await page.getByRole('button', { name: 'Lanjut ke studi kasus' }).click()
  await scan(page, 'case study scenario')
  await page.getByRole('radio', { name: 'Soal' }).click()
  await scan(page, 'case study question')
  await page.getByRole('button', { name: 'Daftar nomor soal' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Kumpulkan' }).click()
  await page.getByRole('button', { name: 'Kumpulkan sekarang' }).click()
  await scan(page, 'AZ-104 exam result')
  await page.getByRole('button', { name: 'Lihat pembahasan' }).click()
  await page.locator('[data-case-panel] summary').first().click()
  await scan(page, 'AZ-104 exam review with scenario')
})

test('the CCNA screens have no accessibility violations', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('langit-course', JSON.stringify({ state: { active: 'ccna' }, version: 1 })))
  for (const [name, hash] of [
    ['home CCNA (tree)', '/'],
    ['ujian CCNA', '/#/ujian'],
    ['lab CCNA', '/#/lab/ccna-u20-l6'],
    ['panduan unit CCNA (contoh console)', '/#/guide/ccna-u04-ipv4'],
  ] as const) {
    await page.goto(hash)
    await page.waitForTimeout(300)
    await scan(page, name)
  }
  await page.goto('/')
  await page.locator('[data-node="ccna-u02-l5"]').click()
  await scan(page, 'CCNA hands-on popover')

  // A CLI question before and after a wrong answer, and an exhibit question.
  await page.goto('/#/lesson/ccna-u02-l5')
  const first = await skipCards(page)
  await scan(page, `CCNA exercise ${first.type}`)
  await answer(page, first, { wrong: true })
  await scan(page, `CCNA feedback ${first.type}`)
})
