import { expect, test, type Page } from '@playwright/test'
import { AZ104_UNITS, play } from './helpers'

// The optional AZ-104 placement test (LANGIT_AZ104_PLAN.md section 3).

test.use({ reducedMotion: 'reduce' })

async function chooseAz104(page: Page) {
  await page.addInitScript(() => localStorage.setItem('langit-course', JSON.stringify({ state: { active: 'az104' }, version: 1 })))
}

test('units scored at least 80% can be marked done, without XP, stats, or review items', async ({ page }) => {
  await chooseAz104(page)
  await page.goto('/')
  const offer = page.getByRole('region', { name: 'Placement test (opsional)' })
  await expect(offer).toContainText('30 soal, 2 dari setiap unit')
  await offer.getByRole('button', { name: 'Mulai' }).click()

  // Every answer right: all 15 units qualify.
  const seen = await play(page, { finish: 'Placement test selesai' })
  expect(seen).toHaveLength(30)
  await expect(page.getByText('15 unit dengan skor minimal 80%.', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Pilih unit' }).click()

  // Keep Unit 1 and Unit 2 only.
  const results = page.getByRole('region', { name: 'Hasil placement test' })
  for (const unit of AZ104_UNITS.slice(2)) {
    await results.getByRole('checkbox', { name: new RegExp(`^Unit ${Number(unit.id.slice(7, 9))} · `) }).uncheck()
  }
  await results.getByRole('button', { name: 'Tandai 2 unit selesai' }).click()
  await expect(results).toHaveCount(0)
  await expect(offer).toHaveCount(0)

  // Units 1 and 2 are done, and the first lesson of Unit 3 is next.
  await expect(page.locator('[data-node="az104-u01-l1"]')).toHaveAttribute('data-node-state', 'done')
  await expect(page.locator(`[data-node="${AZ104_UNITS[1].lessons.at(-1)!.id}"]`)).toHaveAttribute('data-node-state', 'done')
  await expect(page.locator('[data-node="az104-u03-l1"]')).toHaveAttribute('data-node-state', 'active')

  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('langit-progress')!).state)
  expect(state.xp).toBe(0)
  expect(state.courses.az104.conceptStats).toEqual({})
  expect(state.courses.az104.review).toEqual({})
  expect(state.courses.az104.placement.applied).toEqual(['az104-u01-identity', 'az104-u02-rbac'])
  expect(state.lessonsDone).toEqual({})
})

test('skipping the placement test hides it for good', async ({ page }) => {
  await chooseAz104(page)
  await page.goto('/')
  await page.getByRole('region', { name: 'Placement test (opsional)' }).getByRole('button', { name: 'Lewati' }).click()
  await expect(page.getByRole('region', { name: 'Placement test (opsional)' })).toHaveCount(0)
  await page.reload()
  await expect(page.getByRole('region', { name: 'Placement test (opsional)' })).toHaveCount(0)
  await expect(page.locator('[data-node="az104-u01-l1"]')).toHaveAttribute('data-node-state', 'active')
})
