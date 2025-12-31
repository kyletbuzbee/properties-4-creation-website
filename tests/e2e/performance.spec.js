import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('homepage should load quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('Lighthouse performance score should be good', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Measure performance metrics
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        window.addEventListener('load', () => {
          const navigation = performance.getEntriesByType('navigation')[0];
          const paint = performance.getEntriesByType('paint');
          
          resolve({
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
          });
        });
      });
    });
    
    // Performance thresholds
    expect(performanceMetrics.loadTime).toBeLessThan(3000);
    expect(performanceMetrics.domContentLoaded).toBeLessThan(2000);
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1500);
  });

  test('images should be optimized', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      
      // Check for WebP or optimized formats
      expect(src).toMatch(/\.(webp|jpg|jpeg|png)$/i);
      
      // Check for responsive images
      const srcset = await img.getAttribute('srcset');
      if (srcset) {
        expect(srcset.length).toBeGreaterThan(0);
      }
    }
  });

  test('no console errors', async ({ page }) => {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(errors).toHaveLength(0);
  });

  test('critical resources should load efficiently', async ({ page }) => {
    await page.goto('/');
    
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map(resource => ({
        name: resource.name,
        duration: resource.duration,
        transferSize: resource.transferSize,
        resourceType: resource.initiatorType
      }));
    });
    
    // Check for large resources
    const largeResources = resources.filter(resource => resource.transferSize > 1024 * 1024);
    expect(largeResources.length).toBeLessThan(3);
    
    // Check for slow resources
    const slowResources = resources.filter(resource => resource.duration > 1000);
    expect(slowResources.length).toBeLessThan(5);
  });

  test('mobile performance should be acceptable', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Mobile pages should load within 4 seconds
    expect(loadTime).toBeLessThan(4000);
  });
});