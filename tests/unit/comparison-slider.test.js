/**
 * Properties 4 Creations - Comparison Slider Unit Tests
 * Comprehensive tests for before/after image comparison functionality
 */

describe('Comparison Slider Module', () => {
  let comparisonContainer;
  let beforeImage;
  let afterImage;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Create mock comparison slider container
    comparisonContainer = document.createElement('div');
    comparisonContainer.className = 'comparison-slider';
    comparisonContainer.style.width = '500px';
    comparisonContainer.style.height = '300px';
    comparisonContainer.style.position = 'relative';
    
    // Create images for data attribute pattern
    beforeImage = document.createElement('img');
    beforeImage.src = 'before.jpg';
    beforeImage.alt = 'Before renovation';
    beforeImage.className = 'before-image';
    
    afterImage = document.createElement('img');
    afterImage.src = 'after.jpg';
    afterImage.alt = 'After renovation';
    afterImage.className = 'after-image';
    
    comparisonContainer.appendChild(beforeImage);
    comparisonContainer.appendChild(afterImage);
    document.body.appendChild(comparisonContainer);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Slider Initialization', () => {
    test('should initialize comparison sliders on page load', () => {
      const { initializeComparisonSliders } = require('../../js/comparison-slider.js');
      
      // Mock the initialization function
      const mockInitialize = jest.fn();
      window.comparisonSlider = { initialize: mockInitialize };
      
      // Simulate DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      expect(mockInitialize).toHaveBeenCalled();
    });

    test('should create slider structure for data attributes', () => {
      // Set data attributes
      comparisonContainer.dataset.before = 'before-image.jpg';
      comparisonContainer.dataset.after = 'after-image.jpg';
      
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      
      createComparisonSlider(comparisonContainer, 0);
      
      // Check that slider elements were created
      const overlay = comparisonContainer.querySelector('.slider-overlay');
      const handle = comparisonContainer.querySelector('.slider-handle');
      const beforeLabel = comparisonContainer.querySelector('.before-label');
      const afterLabel = comparisonContainer.querySelector('.after-label');
      
      expect(overlay).toBeTruthy();
      expect(handle).toBeTruthy();
      expect(beforeLabel).toBeTruthy();
      expect(afterLabel).toBeTruthy();
      
      expect(beforeLabel.textContent).toBe('Before');
      expect(afterLabel.textContent).toBe('After');
    });

    test('should handle missing data attributes gracefully', () => {
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      
      // Should not throw error
      expect(() => createComparisonSlider(comparisonContainer, 0)).not.toThrow();
    });

    test('should handle missing container elements', () => {
      comparisonContainer.remove();
      
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      
      // Should not throw error
      expect(() => createComparisonSlider(comparisonContainer, 0)).not.toThrow();
    });
  });

  describe('Slider Position and Styling', () => {
    beforeEach(() => {
      // Set up slider with data attributes
      comparisonContainer.dataset.before = 'before.jpg';
      comparisonContainer.dataset.after = 'after.jpg';
      
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      createComparisonSlider(comparisonContainer, 0);
    });

    test('should position slider at 50% initially', () => {
      const overlay = comparisonContainer.querySelector('.slider-overlay');
      const handle = comparisonContainer.querySelector('.slider-handle');
      
      expect(overlay.style.width).toBe('50%');
      expect(handle.style.left).toBe('50%');
    });

    test('should update slider position correctly', () => {
      const { updateSlider } = require('../../js/comparison-slider.js');
      const overlay = comparisonContainer.querySelector('.slider-overlay');
      const handle = comparisonContainer.querySelector('.slider-handle');
      
      updateSlider(75, comparisonContainer, overlay, handle);
      
      expect(overlay.style.width).toBe('75%');
      expect(handle.style.left).toBe('75%');
      expect(handle.getAttribute('aria-valuenow')).toBe('75');
    });

    test('should clamp slider position between 0 and 100', () => {
      const { updateSlider } = require('../../js/comparison-slider.js');
      const overlay = comparisonContainer.querySelector('.slider-overlay');
      const handle = comparisonContainer.querySelector('.slider-handle');
      
      // Test minimum
      updateSlider(-10, comparisonContainer, overlay, handle);
      expect(overlay.style.width).toBe('0%');
      expect(handle.style.left).toBe('0%');
      
      // Test maximum
      updateSlider(110, comparisonContainer, overlay, handle);
      expect(overlay.style.width).toBe('100%');
      expect(handle.style.left).toBe('100%');
    });

    test('should update background position for smooth transitions', () => {
      const { updateSlider } = require('../../js/comparison-slider.js');
      const overlay = comparisonContainer.querySelector('.slider-overlay');
      
      updateSlider(25, comparisonContainer, overlay, null);
      expect(overlay.style.backgroundPosition).toBe('75% center');
      
      updateSlider(75, comparisonContainer, overlay, null);
      expect(overlay.style.backgroundPosition).toBe('25% center');
    });
  });

  describe('Mouse Interaction', () => {
    let overlay;
    let handle;

    beforeEach(() => {
      comparisonContainer.dataset.before = 'before.jpg';
      comparisonContainer.dataset.after = 'after.jpg';
      
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      createComparisonSlider(comparisonContainer, 0);
      
      overlay = comparisonContainer.querySelector('.slider-overlay');
      handle = comparisonContainer.querySelector('.slider-handle');
    });

    test('should drag slider with mouse', () => {
      // Simulate mousedown
      const mousedownEvent = new MouseEvent('mousedown', { 
        clientX: 250,
        bubbles: true 
      });
      handle.dispatchEvent(mousedownEvent);
      
      // Simulate mousemove
      const mousemoveEvent = new MouseEvent('mousemove', { 
        clientX: 375,
        bubbles: true 
      });
      document.dispatchEvent(mousemoveEvent);
      
      expect(overlay.style.width).toBe('75%');
      expect(handle.style.left).toBe('75%');
    });

    test('should stop dragging on mouseup', () => {
      // Start dragging
      const mousedownEvent = new MouseEvent('mousedown', { 
        clientX: 250,
        bubbles: true 
      });
      handle.dispatchEvent(mousedownEvent);
      
      // Move mouse
      const mousemoveEvent = new MouseEvent('mousemove', { 
        clientX: 375,
        bubbles: true 
      });
      document.dispatchEvent(mousemoveEvent);
      
      // Stop dragging
      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
      document.dispatchEvent(mouseupEvent);
      
      // Should maintain position after stopping
      const finalMousemoveEvent = new MouseEvent('mousemove', { 
        clientX: 125,
        bubbles: true 
      });
      document.dispatchEvent(finalMousemoveEvent);
      
      expect(overlay.style.width).toBe('75%'); // Should not change
    });

    test('should change cursor during dragging', () => {
      const mousedownEvent = new MouseEvent('mousedown', { 
        clientX: 250,
        bubbles: true 
      });
      handle.dispatchEvent(mousedownEvent);
      
      expect(handle.style.cursor).toBe('grabbing');
      
      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
      document.dispatchEvent(mouseupEvent);
      
      expect(handle.style.cursor).toBe('ew-resize');
    });
  });

  describe('Touch Interaction', () => {
    let overlay;
    let handle;

    beforeEach(() => {
      comparisonContainer.dataset.before = 'before.jpg';
      comparisonContainer.dataset.after = 'after.jpg';
      
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      createComparisonSlider(comparisonContainer, 0);
      
      overlay = comparisonContainer.querySelector('.slider-overlay');
      handle = comparisonContainer.querySelector('.slider-handle');
    });

    test('should drag slider with touch', () => {
      // Simulate touchstart
      const touchstartEvent = new TouchEvent('touchstart', { 
        touches: [{ clientX: 250 }],
        bubbles: true 
      });
      handle.dispatchEvent(touchstartEvent);
      
      // Simulate touchmove
      const touchmoveEvent = new TouchEvent('touchmove', { 
        touches: [{ clientX: 375 }],
        bubbles: true 
      });
      document.dispatchEvent(touchmoveEvent);
      
      expect(overlay.style.width).toBe('75%');
      expect(handle.style.left).toBe('75%');
    });

    test('should stop dragging on touchend', () => {
      // Start touching
      const touchstartEvent = new TouchEvent('touchstart', { 
        touches: [{ clientX: 250 }],
        bubbles: true 
      });
      handle.dispatchEvent(touchstartEvent);
      
      // Move finger
      const touchmoveEvent = new TouchEvent('touchmove', { 
        touches: [{ clientX: 375 }],
        bubbles: true 
      });
      document.dispatchEvent(touchmoveEvent);
      
      // Stop touching
      const touchendEvent = new TouchEvent('touchend', { bubbles: true });
      document.dispatchEvent(touchendEvent);
      
      // Should maintain position after stopping
      const finalTouchmoveEvent = new TouchEvent('touchmove', { 
        touches: [{ clientX: 125 }],
        bubbles: true 
      });
      document.dispatchEvent(finalTouchmoveEvent);
      
      expect(overlay.style.width).toBe('75%'); // Should not change
    });
  });

  describe('Keyboard Navigation', () => {
    let overlay;
    let handle;

    beforeEach(() => {
      comparisonContainer.dataset.before = 'before.jpg';
      comparisonContainer.dataset.after = 'after.jpg';
      
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      createComparisonSlider(comparisonContainer, 0);
      
      overlay = comparisonContainer.querySelector('.slider-overlay');
      handle = comparisonContainer.querySelector('.slider-handle');
    });

    test('should move slider with arrow keys', () => {
      // Initial position at 50%
      expect(handle.style.left).toBe('50%');
      
      // Press right arrow
      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      handle.dispatchEvent(rightArrowEvent);
      
      expect(handle.style.left).toBe('55%');
      
      // Press left arrow
      const leftArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      handle.dispatchEvent(leftArrowEvent);
      
      expect(handle.style.left).toBe('50%');
    });

    test('should jump to edges with Home and End keys', () => {
      // Move to middle
      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      handle.dispatchEvent(rightArrowEvent);
      expect(handle.style.left).toBe('55%');
      
      // Press Home
      const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
      handle.dispatchEvent(homeEvent);
      
      expect(handle.style.left).toBe('0%');
      
      // Press End
      const endEvent = new KeyboardEvent('keydown', { key: 'End' });
      handle.dispatchEvent(endEvent);
      
      expect(handle.style.left).toBe('100%');
    });

    test('should prevent default behavior for arrow keys', () => {
      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const preventDefaultSpy = jest.spyOn(rightArrowEvent, 'preventDefault');
      
      handle.dispatchEvent(rightArrowEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('ARIA Accessibility', () => {
    beforeEach(() => {
      comparisonContainer.dataset.before = 'before.jpg';
      comparisonContainer.dataset.after = 'after.jpg';
      
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      createComparisonSlider(comparisonContainer, 0);
    });

    test('should set proper ARIA attributes', () => {
      const handle = comparisonContainer.querySelector('.slider-handle');
      
      expect(handle.getAttribute('role')).toBe('slider');
      expect(handle.getAttribute('aria-label')).toBe('Adjust before/after comparison');
      expect(handle.getAttribute('aria-valuemin')).toBe('0');
      expect(handle.getAttribute('aria-valuemax')).toBe('100');
      expect(handle.getAttribute('aria-valuenow')).toBe('50');
      expect(handle.getAttribute('tabindex')).toBe('0');
    });

    test('should update aria-valuenow when slider moves', () => {
      const { updateSlider } = require('../../js/comparison-slider.js');
      const overlay = comparisonContainer.querySelector('.slider-overlay');
      const handle = comparisonContainer.querySelector('.slider-handle');
      
      updateSlider(25, comparisonContainer, overlay, handle);
      expect(handle.getAttribute('aria-valuenow')).toBe('25');
      
      updateSlider(75, comparisonContainer, overlay, handle);
      expect(handle.getAttribute('aria-valuenow')).toBe('75');
    });
  });

  describe('Static Fallback', () => {
    test('should create static comparison for browsers without JS', () => {
      const { createStaticComparison } = require('../../js/comparison-slider.js');
      
      createStaticComparison(comparisonContainer);
      
      expect(comparisonContainer.style.display).toBe('flex');
      expect(beforeImage.style.flex).toBe('1');
      expect(afterImage.style.flex).toBe('1');
      expect(beforeImage.style.height).toBe('300px');
      expect(afterImage.style.height).toBe('300px');
      
      const labels = document.querySelectorAll('.comparison-slider > div');
      expect(labels.length).toBe(2);
      expect(labels[0].textContent).toBe('Before');
      expect(labels[1].textContent).toBe('After');
    });

    test('should handle missing images in static fallback', () => {
      beforeImage.remove();
      
      const { createStaticComparison } = require('../../js/comparison-slider.js');
      
      // Should not throw error
      expect(() => createStaticComparison(comparisonContainer)).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing container gracefully', () => {
      comparisonContainer.remove();
      
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      
      // Should not throw error
      expect(() => createComparisonSlider(comparisonContainer, 0)).not.toThrow();
    });

    test('should handle malformed container structure', () => {
      // Remove images
      beforeImage.remove();
      afterImage.remove();
      
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      
      // Should not throw error
      expect(() => createComparisonSlider(comparisonContainer, 0)).not.toThrow();
    });

    test('should handle missing overlay or handle elements', () => {
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      createComparisonSlider(comparisonContainer, 0);
      
      // Remove overlay
      const overlay = comparisonContainer.querySelector('.slider-overlay');
      if (overlay) overlay.remove();
      
      // Should not throw error when updating
      const handle = comparisonContainer.querySelector('.slider-handle');
      const { updateSlider } = require('../../js/comparison-slider.js');
      
      expect(() => updateSlider(50, comparisonContainer, overlay, handle)).not.toThrow();
    });
  });

  describe('Multiple Sliders', () => {
    test('should handle multiple sliders on the same page', () => {
      // Create second slider
      const secondContainer = document.createElement('div');
      secondContainer.className = 'comparison-slider';
      secondContainer.dataset.before = 'before2.jpg';
      secondContainer.dataset.after = 'after2.jpg';
      document.body.appendChild(secondContainer);
      
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      
      createComparisonSlider(comparisonContainer, 0);
      createComparisonSlider(secondContainer, 1);
      
      // Both should have their own handles
      const firstHandle = comparisonContainer.querySelector('.slider-handle');
      const secondHandle = secondContainer.querySelector('.slider-handle');
      
      expect(firstHandle).toBeTruthy();
      expect(secondHandle).toBeTruthy();
      
      // Moving one shouldn't affect the other
      const { updateSlider } = require('../../js/comparison-slider.js');
      const firstOverlay = comparisonContainer.querySelector('.slider-overlay');
      const secondOverlay = secondContainer.querySelector('.slider-overlay');
      
      updateSlider(75, comparisonContainer, firstOverlay, firstHandle);
      
      expect(firstOverlay.style.width).toBe('75%');
      expect(secondOverlay.style.width).toBe('50%'); // Default position
    });
  });

  describe('Public API', () => {
    test('should provide public API methods', () => {
      const { window } = require('../../js/comparison-slider.js');
      
      expect(typeof window.comparisonSlider.initialize).toBe('function');
      expect(typeof window.comparisonSlider.create).toBe('function');
    });

    test('should allow programmatic slider creation', () => {
      const { window } = require('../../js/comparison-slider.js');
      
      expect(() => window.comparisonSlider.create(comparisonContainer, 0)).not.toThrow();
    });
  });
});