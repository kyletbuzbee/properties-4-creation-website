import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    expect(focusedElement).toBeTruthy();
    
    // Check that focus is visible
    const focusStyles = await page.evaluate((el) => {
      const styles = window.getComputedStyle(el, ':focus');
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow
      };
    }, focusedElement);
    
    expect(focusStyles.outline).not.toBe('none');
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const altText = await img.getAttribute('alt');
      expect(altText).toBeTruthy();
      expect(altText.length).toBeGreaterThan(0);
    }
  });

  test('forms should have labels', async ({ page }) => {
    // Test contact form if it exists
    await page.goto('/contact');
    
    const inputs = await page.locator('input, textarea, select').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const label = await page.locator(`label[for="${id}"]`).count();
      const ariaLabel = await input.getAttribute('aria-label');
      
      expect(label > 0 || ariaLabel).toBeTruthy();
    }
  });

  test('color contrast should meet standards', async ({ page }) => {
    await page.goto('/');
    
    // Run axe with color contrast checks
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .include('body')
      .analyze();

    const colorContrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(colorContrastViolations).toHaveLength(0);
  });

  test('headings should be properly structured', async ({ page }) => {
    await page.goto('/');
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingLevels = [];
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const level = parseInt(tagName.charAt(1));
      headingLevels.push(level);
    }
    
    // Check that headings follow a logical structure
    for (let i = 1; i < headingLevels.length; i++) {
      expect(headingLevels[i]).toBeLessThanOrEqual(headingLevels[i - 1] + 1);
    }
  });
});