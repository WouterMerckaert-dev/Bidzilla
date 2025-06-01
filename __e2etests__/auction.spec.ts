import {test, expect} from '@playwright/test'

test.describe('Auction CRUD Operations', () => {
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
  })

  test('Create, Read, Update, and Delete an Auction', async ({page}) => {
    // Create
    await page.goto('/auctions/new')
    await page.fill('input[name="title"]', 'Test Auction')
    await page.fill('textarea[name="description"]', 'This is a test auction')
    await page.fill('input[name="startPrice"]', '100')
    await page.fill('input[name="endDate"]', '2025-12-31T23:59')
    await page.selectOption('select[name="categoryId"]', {label: 'Boeken'})
    await page.click('button[type="submit"]')

    // Read
    await page.goto('/profile')
    const auctionTitle = await page.textContent('h3:has-text("Test Auction")')
    expect(auctionTitle).toContain('Test Auction')

    // Update
    await page.click('button[name="bewerken"]')
    await page.fill('input[name="title"]', 'Updated Test Auction')
    await page.click('button[name="bijwerken"]')
    await page.waitForSelector('h3:has-text("Updated Test Auction")')

    // Delete
    await page.click('button:has-text("Verwijderen")')
    page.once('dialog', dialog => {
      console.log('Dialog message:', dialog.message())
      void dialog.accept() // This simulates clicking "OK"
    })
  })
})
