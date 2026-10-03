import { expect, test, type Page } from '@playwright/test'
import { CCNA_UNITS, ITEMS, answer, exercisesOf, lesson, play, startFromMap } from './helpers'

// CCNA course (LANGIT_CCNA_PLAN.md): the lesson tree with its branch kinds, a
// lesson played from the map, the CLI simulator, the skip test for a
// prerequisite branch, the lab page, and an exam result without a pass label.

test.use({ reducedMotion: 'reduce' })

async function chooseCcna(page: Page) {
  await page.addInitScript(() => localStorage.setItem('langit-course', JSON.stringify({ state: { active: 'ccna' }, version: 1 })))
}

const node = (page: Page, id: string) => page.locator(`[data-node="${id}"]`)

test('the CCNA map is a tree: trunk lessons with prerequisite, hands-on, and support branches', async ({ page }) => {
  await chooseCcna(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Langit: jalur belajar CCNA')
  await expect(page.getByRole('region', { name: 'Arti cabang' })).toBeVisible()
  await expect(page.locator('[data-unit-tree]')).toHaveCount(CCNA_UNITS.length)

  await expect(node(page, 'ccna-u01-l1')).toHaveAttribute('data-node-state', 'active')
  await expect(node(page, 'ccna-u01-l3')).toHaveAttribute('data-branch-kind', 'prereq')
  await expect(node(page, 'ccna-u02-l4')).toHaveAttribute('data-branch-kind', 'support')
  await expect(node(page, 'ccna-u02-l5')).toHaveAttribute('data-branch-kind', 'handson')

  // A prerequisite branch offers the skip test; a hands-on branch offers its lab.
  await node(page, 'ccna-u01-l3').click()
  await expect(page.getByRole('dialog').getByText('Cabang prasyarat: wajib')).toBeVisible()
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Sudah paham? Tes lompat' })).toBeVisible()
  await page.keyboard.press('Escape')
  await node(page, 'ccna-u02-l5').click()
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Buka lab Packet Tracer' })).toBeVisible()
})

test('the first CCNA lesson plays from the map and opens the next one', async ({ page }) => {
  await chooseCcna(page)
  await startFromMap(page, 'ccna-u01-l1')
  await play(page, { wrongFirst: new Set([exercisesOf(lesson('ccna-u01-l1'))[0].id]) })
  await page.getByRole('button', { name: 'Lanjut' }).click()
  await expect(node(page, 'ccna-u01-l1')).toHaveAttribute('data-node-state', 'done')
  await expect(node(page, 'ccna-u01-l2')).toHaveAttribute('data-node-state', 'active')
})

test('a CLI simulator question is judged on the device state, and a wrong try shows what is missing', async ({ page }) => {
  await chooseCcna(page)
  const l = lesson('ccna-u02-l1')
  const ios = exercisesOf(l).find((e) => e.type === 'ios')!
  await page.goto(`/#/lesson/${l.id}`)
  // Answer up to the first CLI question, then get it wrong once.
  for (let guard = 0; guard < 20; guard++) {
    const id = (await page.locator('main[data-item-id]').getAttribute('data-item-id'))!
    if (id === ios.id) break
    const item = ITEMS.get(id)!
    if (item.type !== 'learn') await answer(page, item)
    await page.getByRole('button', { name: /^(Paham, l|L)anjut$/ }).click()
  }
  await expect(page.getByRole('log', { name: /^Terminal / })).toBeVisible()
  await answer(page, ios, { wrong: true })
  await expect(page.getByRole('region', { name: 'Kurang tepat' })).toBeVisible()
  await expect(page.getByText('Belum terpenuhi', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Lanjut' }).click()
  // The lesson still finishes once the question comes back and is answered right.
  await play(page)
})

test('a hands-on lesson with exhibit and CLI questions ends with its lab', async ({ page }) => {
  await chooseCcna(page)
  await page.goto('/#/lesson/ccna-u02-l5')
  await play(page)
  await page.getByRole('button', { name: 'Buka lab Packet Tracer' }).click()
  await expect(page.locator('[data-lab="ccna-u02-l5"]')).toBeVisible()
  await expect(page.locator('[data-lab-tested]')).toHaveAttribute('data-lab-tested', 'no')
  await expect(page.getByText('Belum dicoba langsung di Cisco Packet Tracer.')).toBeVisible()
})

test('the Ansible lab names CML as its tool', async ({ page }) => {
  await page.goto('/#/lab/ccna-u27-l5')
  await expect(page.getByText('Belum dicoba langsung di Cisco Modeling Labs Free.')).toBeVisible()
})

test('passing the skip test marks a prerequisite branch done without touching the stats', async ({ page }) => {
  await chooseCcna(page)
  await page.goto('/#/skip/ccna-u01-l3')
  await play(page, { finish: 'Prasyarat dilewati' })
  await page.getByRole('button', { name: /^(Lanjut|Kembali)/ }).first().click()
  await page.goto('/')
  await expect(node(page, 'ccna-u01-l3')).toHaveAttribute('data-node-state', 'done')
  const stats = await page.evaluate(() => JSON.parse(localStorage.getItem('langit-progress')!).state)
  expect(JSON.stringify(stats)).not.toContain('ccna-u01-l3-e')
})

test('a CCNA exam result has a score but no pass or fail label', async ({ page }) => {
  await chooseCcna(page)
  await page.goto('/#/ujian')
  await expect(page.getByText(/rata-rata minimal 850/)).toBeVisible()
  await page.getByRole('radio', { name: /Jalur 5/ }).click()
  await page.getByRole('button', { name: 'Mulai' }).nth(1).click()
  await expect(page.getByRole('timer')).toHaveAccessibleName(/Sisa waktu (30:00|29:5\d)/)
  await page.getByRole('button', { name: 'Daftar nomor soal' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Kumpulkan' }).click()
  await page.getByRole('button', { name: 'Kumpulkan sekarang' }).click()
  await expect(page.getByRole('heading', { name: 'Skor kamu' })).toBeVisible()
  await expect(page.getByText('Cisco tidak memublikasikan nilai lulus CCNA')).toBeVisible()
  await expect(page.getByText(/^(Lulus|Belum lulus)$/)).toHaveCount(0)
})
