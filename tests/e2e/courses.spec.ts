import { expect, test, type Page } from '@playwright/test'
import { readFileSync, readdirSync } from 'node:fs'
import { play, startFromMap } from './helpers'

// Two courses in one app (LANGIT_AZ104_PLAN.md section 3 and Prompt A): the
// picker switches the path map, practice, stats, and exam page; AZ-104 needs no
// AZ-900 progress; and nothing of AZ-900 changes when AZ-104 is opened.

test.use({ reducedMotion: 'reduce' })

const AZ104_DIR = 'src/content/az104/units'
const AZ104_LESSONS = readdirSync(AZ104_DIR)
  .filter((f) => f.endsWith('.json'))
  .flatMap((f) => (JSON.parse(readFileSync(`${AZ104_DIR}/${f}`, 'utf8')) as { lessons: { id: string }[] }).lessons)

const picker = (page: Page) => page.getByRole('group', { name: 'Pilih course' })

/** The AZ-900 part of the saved progress, plus what the whole app shares. */
async function az900Snapshot(page: Page) {
  return page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('langit-progress')!).state
    const { xp, streak, lessonsDone, checkpoints, unitLevel, review, conceptStats, examHistory } = s
    return { xp, streak, lessonsDone, checkpoints, unitLevel, review, conceptStats, examHistory }
  })
}

async function chooseAz104(page: Page) {
  await page.addInitScript(() => localStorage.setItem('langit-course', JSON.stringify({ state: { active: 'az104' }, version: 1 })))
}

test('the course picker switches the path map, and AZ-900 progress stays as it was', async ({ page }) => {
  await startFromMap(page, 'u01-l1')
  await play(page, { wrongFirst: new Set(['u01-l1-e2']) })
  await page.getByRole('button', { name: 'Lanjut' }).click()
  await expect(page.locator('[data-node="u01-l1"]')).toHaveAttribute('data-node-state', 'done')
  const before = await az900Snapshot(page)
  expect(Object.keys(before.review).length).toBeGreaterThan(0)

  await picker(page).getByRole('button', { name: /AZ-104/ }).click()
  await expect(picker(page).getByRole('button', { name: /AZ-104/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Langit: jalur belajar AZ-104')

  // All 15 units open without AZ-900; lessons without exercises wait as "segera hadir".
  await expect(page.getByRole('button', { name: /^Panduan unit \d+:/ })).toHaveCount(15)
  await expect(page.locator('[data-node^="az104-u"]')).toHaveCount(AZ104_LESSONS.length)
  await expect(page.locator('[data-node^="u0"], [data-node^="u1"]')).toHaveCount(0)
  for (const state of await page.locator('[data-node^="az104-u"]').evaluateAll((els) => els.map((e) => e.getAttribute('data-node-state'))))
    expect(state).toBe('soon')

  // A checkpoint with no exercises in its path cannot be started.
  await expect(page.locator('[data-node="az104-cp1"]')).toHaveAttribute('data-node-state', 'soon')
  await page.locator('[data-node="az104-cp1"]').click()
  await expect(page.getByRole('dialog')).toContainText('Soal untuk jalur ini sedang disiapkan.')
  await expect(page.getByRole('dialog').getByRole('button', { name: /Mulai/ })).toHaveCount(0)

  // The choice is kept on this device.
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Langit: jalur belajar AZ-104')
  expect(await az900Snapshot(page)).toEqual(before)

  await picker(page).getByRole('button', { name: /AZ-900/ }).click()
  await expect(page.locator('[data-node="u01-l1"]')).toHaveAttribute('data-node-state', 'done')
  expect(await az900Snapshot(page)).toEqual(before)
})

test('practice, stats, exam, and the unit guide follow the chosen course', async ({ page }) => {
  await chooseAz104(page)

  await page.goto('/#/latihan')
  await expect(page.getByText('Course AZ-104')).toBeVisible()

  await page.goto('/#/statistik')
  await expect(page.getByText('konsep untuk course AZ-104')).toBeVisible()

  await page.goto('/#/ujian')
  await expect(page.getByRole('heading', { name: 'Soal ujian AZ-104 sedang disiapkan' })).toBeVisible()

  await page.goto('/#/guide/az104-u01-identity')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Microsoft Entra/)

  // Links into AZ-104 runs that have nothing to ask yet explain that instead of starting.
  await page.goto('/#/checkpoint/az104-cp1')
  await expect(page.getByRole('heading', { name: 'Checkpoint belum siap' })).toBeVisible()
  await page.goto('/#/lesson/az104-u01-l1')
  await expect(page.getByRole('button', { name: 'Kembali ke home' })).toBeVisible()
})

test('a lesson opened from a link makes its course the active one', async ({ page }) => {
  await chooseAz104(page)
  await page.goto('/#/lesson/u01-l1')
  await expect(page.locator('main[data-item-id]')).toBeVisible()
  // Out of hearts, "Latihan untuk isi hearts" now practices AZ-900, the course being played.
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('langit-course')!).state.active)).toBe('az900')
})
