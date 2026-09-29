import { expect, test } from '@playwright/test'
import { ITEMS, PRAISE, answer, lesson, main, next, play, startFromMap } from './helpers'

test.use({ reducedMotion: 'reduce' })

const first = lesson('u01-l1')
const exercises = first.items.filter((i) => i.type !== 'intro')

test('a new player starts at Unit 1 lesson 1, and wrong answers come back until they are right', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-node="u01-l1"]')).toHaveAttribute('data-node-state', 'active')
  await expect(page.locator('[data-node="u01-l2"]')).toHaveAttribute('data-node-state', 'locked')
  await startFromMap(page, 'u01-l1')

  const [a, b] = [exercises[1].id, exercises[2].id]
  const seen = await play(page, { wrongFirst: new Set([a, b]) })
  const retries = seen.filter((s) => s.endsWith('(retry)'))
  expect(retries).toEqual([`${a} (retry)`, `${b} (retry)`])
  expect(seen.indexOf(`${a} (retry)`)).toBeGreaterThan(seen.indexOf(exercises.at(-1)!.id))

  const accuracy = Math.round(((exercises.length - 2) / exercises.length) * 100)
  await expect(page.getByText(`${accuracy}%`)).toBeVisible()
  await expect(page.getByLabel('10 XP')).toBeVisible()
  await page.getByRole('button', { name: 'Lanjut' }).click()

  await expect(page.locator('[data-node="u01-l1"]')).toHaveAttribute('data-node-state', 'done')
  await expect(page.locator('[data-node="u01-l2"]')).toHaveAttribute('data-node-state', 'active')
  await expect(page.getByLabel('XP hari ini 10 dari target 50')).toBeVisible()
  await expect(page.getByLabel('Streak 1 hari')).toBeVisible()
})

test('a flawless run earns the +5 XP bonus and survives a reload', async ({ page }) => {
  await startFromMap(page, 'u01-l1')
  await play(page)
  await expect(page.getByLabel('15 XP')).toBeVisible()
  await expect(page.getByText('100%')).toBeVisible()
  await page.getByRole('button', { name: 'Lanjut' }).click()
  await page.reload()
  await expect(page.getByLabel('XP hari ini 15 dari target 50')).toBeVisible()
})

test('intro cards show the concept, its diagram, and a neutral Awan', async ({ page }) => {
  await page.goto('/#/lesson/u04-l1')
  const intro = lesson('u04-l1').items[0] as unknown as { title: string }
  await expect(page.getByText('Konsep baru')).toBeVisible()
  await expect(page.getByRole('heading', { name: intro.title })).toBeVisible()
  await expect(page.getByRole('img', { name: /tiga availability zone/ })).toBeVisible()
  await expect(page.getByRole('img', { name: 'Awan, maskot Langit' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Periksa' })).toHaveCount(0)
  await next(page)
  expect(Number(await page.getByRole('progressbar').getAttribute('aria-valuenow'))).toBeGreaterThan(0)
})

test('true/false cards can be swiped', async ({ page }) => {
  await startFromMap(page, 'u01-l1')
  await next(page) // intro card
  const tf = ITEMS.get((await main(page).getAttribute('data-item-id'))!)!
  expect(tf.type).toBe('truefalse')
  const card = page.getByRole('heading', { name: tf.prompt as string })
  const box = (await card.boundingBox())!
  const dir = tf.answer ? 1 : -1
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 60 * dir, box.y + box.height / 2, { steps: 5 })
  await page.mouse.move(box.x + box.width / 2 + 200 * dir, box.y + box.height / 2, { steps: 5 })
  await page.mouse.up()
  await expect(page.getByText(`Jawabanmu: ${tf.answer ? 'Benar' : 'Salah'}`)).toBeVisible()
  await expect(page.getByRole('region', { name: PRAISE })).toBeVisible()
})

test('works from the keyboard: Enter on intro cards, number and Enter on choices', async ({ page }) => {
  await startFromMap(page, 'u01-l1')
  for (let guard = 0; guard < 10; guard++) {
    const item = ITEMS.get((await main(page).getAttribute('data-item-id'))!)!
    if (item.type === 'intro') {
      const step = (await main(page).getAttribute('data-step'))!
      await page.keyboard.press('Enter')
      await expect(main(page)).not.toHaveAttribute('data-step', step)
      continue
    }
    if (item.type === 'choice') {
      const options = item.options as string[]
      const position = await page
        .locator('[data-option]')
        .evaluateAll((els, text) => els.findIndex((el) => el.textContent?.endsWith(text)), options[item.answer as number])
      await page.keyboard.press(String(position + 1))
      await page.keyboard.press('Enter')
      await expect(page.getByRole('region', { name: PRAISE })).toBeVisible()
      return
    }
    await answer(page, item)
    await next(page)
  }
  throw new Error('no choice exercise found')
})

test('leaving mid-lesson asks first and saves nothing', async ({ page }) => {
  await startFromMap(page, 'u01-l1')
  await next(page) // intro card
  await answer(page, exercises[0])
  await next(page)
  await page.getByRole('button', { name: /^Keluar dari/ }).click()
  await expect(page.getByRole('dialog', { name: 'Yakin mau berhenti?' })).toBeVisible()
  await page.getByRole('button', { name: 'Keluar', exact: true }).click()
  await expect(page.locator('[data-node="u01-l1"]')).toHaveAttribute('data-node-state', 'active')
  await expect(page.getByLabel('XP hari ini 0 dari target 50')).toBeVisible()
})
