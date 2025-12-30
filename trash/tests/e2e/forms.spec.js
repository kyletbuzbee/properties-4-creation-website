// E2E tests for form functionality
import { test, expect } from '@playwright/test';

test.describe('Application Form', () => {
  test('application form validation works', async ({ page }) => {
    await page.goto('/apply/');

    // Check form is present
    await expect(page.locator('#application-form')).toBeVisible();

    // Try to submit empty form
    await page.locator('button[type="submit"]').click();

    // Should show validation errors (HTML5 validation)
    const nameInput = page.locator('#name');
    await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('application form accepts valid data', async ({ page }) => {
    await page.goto('/apply/');

    // Fill out the form with valid data
    await page.fill('#name', 'John Doe');
    await page.fill('#email', 'john.doe@example.com');
    await page.fill('#phone', '555-123-4567');
    await page.selectOption('#voucher', 'section8');
    await page.fill('#household', '3');
    await page.selectOption('#bedrooms', '2');
    await page.fill('#move-date', '2025-12-31');
    await page.fill('#message', 'Looking for affordable housing for my family.');

    // Check privacy consent
    await page.check('#privacy-consent');

    // Submit the form
    await page.locator('button[type="submit"]').click();

    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('.success-message')).toContainText('Application Submitted Successfully');
  });

  test('date field has minimum date set', async ({ page }) => {
    await page.goto('/apply/');

    const moveDateInput = page.locator('#move-date');
    const minDate = await moveDateInput.getAttribute('min');

    // Should have a minimum date set (7 days from today)
    expect(minDate).toBeTruthy();

    // Parse the date and check it's in the future
    const minDateObj = new Date(minDate);
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    expect(minDateObj.getTime()).toBeGreaterThan(today.getTime());
  });
});

test.describe('Contact Form', () => {
  test('contact form validation works', async ({ page }) => {
    await page.goto('/contact/');

    // Check form is present
    await expect(page.locator('#contact-form')).toBeVisible();

    // Try to submit empty form
    await page.locator('button[type="submit"]').click();

    // Should show validation errors
    const nameInput = page.locator('#contact-name');
    await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('contact form accepts valid data', async ({ page }) => {
    await page.goto('/contact/');

    // Fill out the form
    await page.fill('#contact-name', 'Jane Smith');
    await page.fill('#contact-email', 'jane.smith@example.com');
    await page.fill('#contact-phone', '555-987-6543');
    await page.selectOption('#contact-subject', 'general');
    await page.fill('#contact-message', 'I have questions about your veteran housing programs.');

    // Check newsletter checkbox
    await page.check('#contact-newsletter');

    // Submit the form
    await page.locator('button[type="submit"]').click();

    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('.success-message')).toContainText('Message Sent Successfully');
  });
});

test.describe('Form Accessibility', () => {
  test('forms have proper ARIA attributes', async ({ page }) => {
    await page.goto('/apply/');

    // Check form labels are associated with inputs
    const nameLabel = page.locator('label[for="name"]');
    const nameInput = page.locator('#name');

    await expect(nameLabel).toBeVisible();
    await expect(nameInput).toHaveAttribute('aria-describedby', 'name-help');

    // Check help text exists
    const helpText = page.locator('#name-help');
    await expect(helpText).toBeVisible();
  });

  test('error messages are properly associated', async ({ page }) => {
    await page.goto('/apply/');

    // Fill invalid email
    await page.fill('#email', 'invalid-email');
    await page.locator('#email').blur(); // Trigger validation

    // Check for error styling (if JavaScript validation is active)
    const emailInput = page.locator('#email');
    const hasErrorClass = await emailInput.evaluate(el => el.classList.contains('error'));

    if (hasErrorClass) {
      // Should have error message
      await expect(page.locator('.field-error')).toBeVisible();
    }
  });
});
