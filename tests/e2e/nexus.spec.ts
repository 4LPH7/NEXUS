import { expect, test } from '@playwright/test'

test('loads without browser errors and keeps the experience navigable', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('DIMENSION.')
  await expect(page.locator('canvas').first()).toBeVisible()
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('button', { name: 'Experiments' }).click()
  await expect(page.getByRole('heading', { name: 'Objects in motion' })).toBeInViewport()
  await expect.poll(() => errors).toEqual([])
})

test('mobile menu opens and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  const menu = page.getByRole('dialog', { name: 'Menu' })
  await expect(menu).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()
})

test('gallery specimens open, respond, reset, and return focus', async ({ page }) => {
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Open Orbit details' })
  await trigger.scrollIntoViewIfNeeded()
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Orbit' })
  await expect(dialog).toBeVisible()
  const canvas = dialog.locator('canvas')
  await expect(canvas).toBeVisible()
  const bounds = await canvas.boundingBox()
  if (!bounds) throw new Error('Orbit canvas has no bounds')
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
  await expect(dialog.getByText('The specimen responded to your input.')).toBeAttached()
  await dialog.getByRole('button', { name: 'Reset' }).click()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('lab controls respond to mouse and keyboard input', async ({ page }) => {
  await page.goto('/')
  const magnetic = page.getByRole('group', { name: /Magnetic field/ })
  await magnetic.scrollIntoViewIfNeeded()
  await magnetic.focus()
  await page.keyboard.press('ArrowRight')
  await expect(magnetic.getByText('Field moved.')).toBeAttached()
  await page.getByRole('button', { name: 'Attract' }).click()
  await expect(page.getByRole('button', { name: 'Attract' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Reset', exact: true }).nth(0).click()

  const drag = page.getByRole('group', { name: /Grab and rotate/ })
  await drag.focus()
  await page.keyboard.press('ArrowRight')
  await expect(drag.getByText('Object rotated.')).toBeAttached()
  await page.getByRole('button', { name: 'Reset', exact: true }).nth(1).click()

  const morph = page.getByRole('group', { name: /Morph lab/ })
  await morph.focus()
  const shape = page.getByRole('slider', { name: 'Shape' })
  const before = await shape.inputValue()
  await page.keyboard.press('ArrowRight')
  await expect(shape).not.toHaveValue(before)
  await page.getByRole('button', { name: 'Reset', exact: true }).last().click()
  await expect(shape).toHaveValue('0')
})

test('theme and reduced motion state update the DOM and scene', async ({ page }) => {
  await page.goto('/')
  await page.locator('#customization').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Ice' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-preset', 'ice')
  await expect.poll(() => page.locator('html').evaluate((element) => getComputedStyle(element).getPropertyValue('--accent').trim())).toBe('#68e1ff')
  await page.getByRole('button', { name: 'Reduce motion' }).click()
  await expect(page.locator('[data-reduced-motion="true"]')).toBeAttached()
  await page.getByRole('button', { name: 'Enable full motion' }).click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('[data-reduced-motion="true"]')).toBeAttached()
})

test('WebGL failure leaves navigation working', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null
      return original.call(this, type as never, ...(args as []))
    }
  })
  await page.goto('/')
  await expect(page.getByTestId('scene-fallback')).toBeAttached()
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('button', { name: 'Experiments' }).click()
  await expect(page.getByRole('heading', { name: 'Objects in motion' })).toBeInViewport()
})

test('replay restores the starting scene and viewport', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100)
  await page.getByRole('button', { name: /Replay the experience/ }).click()
  await expect(page.locator('#main-content')).toHaveAttribute('data-replay-count', '1')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(100)
})

test('no horizontal overflow at the specified viewport sizes', async ({ page }) => {
  await page.goto('/')
  for (const [width, height] of [[1920, 1080], [1440, 900], [1024, 768], [768, 1024], [390, 844], [360, 800]]) {
    await page.setViewportSize({ width, height })
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${width}x${height}`).toBe(true)
  }
})

test('captures desktop and mobile review screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  for (const id of ['hero', 'descend', 'objects', 'playground', 'customization', 'manifesto', 'final']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await page.waitForTimeout(180)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(900)
  await page.screenshot({ path: 'test-results/nexus-desktop.png', fullPage: true })
  await page.locator('#playground').scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'test-results/nexus-desktop-playground.png' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(300)
  await page.screenshot({ path: 'test-results/nexus-mobile.png', fullPage: true })
  await page.locator('#playground').scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'test-results/nexus-mobile-playground.png' })
})
