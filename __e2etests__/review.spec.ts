import {test, expect} from '@playwright/test'

test.describe('Review CRUD Operations', () => {
  test.beforeEach(async ({page}) => {
    console.log('Navigating to login page')
    await page.goto('/login')

    console.log('Filling login form')
    await page.fill('input[name="email"]', 'testuser@example.com')
    await page.fill('input[name="password"]', 'Azerty123')
    await page.click('button[type="submit"]')

    console.log('Waiting for navigation to profile')
    try {
      await page.waitForURL('/profile', {timeout: 60000})
      expect(() => {
        throw new Error('Something bad')
      }).toThrow()
    } catch (error) {
      console.error('Navigation to /profile failed:', page.url())
      throw error
    }

    console.log('Successfully navigated to profile')
  })

  test('Create, Read, Update, and Delete a Review', async ({page}) => {
    // Create
    await page.goto('/users/cm5gti2gz0001j4mowc9zxa0u')
    await page.selectOption('select[name="rating"]', '4')
    await page.fill('textarea[name="content"]', 'This is a test review')
    await page.click('button[type="submit"]')
    await page.waitForSelector('div:has-text("This is a test review")')

    // Read
    const reviewContent = await page.textContent('div:has-text("This is a test review")')
    expect(reviewContent).toContain('This is a test review')

    // Update
    await page.click('button:has-text("Review bijwerken")')
    await page.selectOption('select[name="rating"]', '5')
    await page.fill('textarea[name="content"]', 'This is an updated test review')
    await page.click('button:has-text("Review bijwerken")')
    await page.waitForSelector('div:has-text("This is an updated test review")')

    // Delete
    await page.click('button:has-text("Review verwijderen")')
    await page.waitForSelector('div:has-text("This is an updated test review")', {state: 'detached'})
  })
})
