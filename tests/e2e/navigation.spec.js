// E2E tests for navigation and basic functionality
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle('Home - Properties 4 Creations');

    // Check main heading
    await expect(page.locator('h1')).toContainText('Affordable Housing for Veterans & Families');

    // Check navigation links
    await expect(page.locator('nav a[href="/"]')).toBeVisible();
    await expect(page.locator('nav a[href="/properties/"]')).toBeVisible();
    await expect(page.locator('nav a[href="/about/"]')).toBeVisible();
    await expect(page.locator('nav a[href="/contact/"]')).toBeVisible();
  });

  test('navigation to properties page', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a[href="/properties/"]').click();

    await expect(page).toHaveURL(/.*properties/);
    await expect(page.locator('h1')).toContainText('Available Properties');
  });

  test('navigation to about page', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a[href="/about/"]').click();

    await expect(page).toHaveURL(/.*about/);
    await expect(page.locator('h1')).toContainText('About Properties 4 Creations');
  });

  test('navigation to contact page', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a[href="/contact/"]').click();

    await expect(page).toHaveURL(/.*contact/);
    await expect(page.locator('h1')).toContainText('Contact Us');
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test('mobile menu opens and closes', async ({ page }) => {
    await page.goto('/');

    // Menu should be hidden initially
    await expect(page.locator('.main-navigation')).not.toBeVisible();

    // Click menu toggle
    await page.locator('.menu-toggle').click();

    // Menu should be visible
    await expect(page.locator('.main-navigation')).toBeVisible();

    // Click outside or ESC to close
    await page.keyboard.press('Escape');
    await expect(page.locator('.main-navigation')).not.toBeVisible();
  });
});

test.describe('Theme Toggle', () => {
  test('theme toggle changes appearance', async ({ page }) => {
    await page.goto('/');

    // Check initial theme (should be light by default)
    const html = page.locator('html');
    await expect(html).not.toHaveAttribute('data-theme', 'dark');

    // Click theme toggle
    await page.locator('#theme-toggle').click();

    // Should switch to dark theme
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Click again to switch back
    await page.locator('#theme-toggle').click();
    await expect(html).not.toHaveAttribute('data-theme', 'dark');
  });
});
