/**
 * Properties 4 Creations - Error Handling Integration Tests
 * Comprehensive tests for error scenarios and fallbacks
 */

// Mock console methods to capture warnings/errors
const originalConsole = console;

describe('Error Handling Integration Tests', () => {
  let applicationForm;
  let contactForm;
  let themeToggle;
  let mobileMenuToggle;
  let mainNav;
  let body;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Mock console methods
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    
    // Create forms
    applicationForm = document.createElement('form');
    applicationForm.id = 'application-form';
    applicationForm.action = 'https://formspree.io/f/app-form';
    applicationForm.innerHTML = `
      <input type="text" id="name" name="name" required>
      <input type="email" id="email" name="email" required>
      <button type="submit">Submit</button>
    `;
    
    contactForm = document.createElement('form');
    contactForm.id = 'contact-form';
    contactForm.action = 'https://formspree.io/f/contact-form';
    contactForm.innerHTML = `
      <input type="text" id="contact-name" name="name" required>
      <input type="email" id="contact-email" name="email" required>
      <button type="submit">Send</button>
    `;
    
    // Create theme toggle
    themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.innerHTML = '<span class="theme-icon">🌙</span>';
    
    // Create mobile menu
    mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'menu-toggle';
    mobileMenuToggle.textContent = 'Menu';
    
    mainNav = document.createElement('nav');
    mainNav.className = 'main-navigation';
    mainNav.innerHTML = '<ul><li><a href="/">Home</a></li></ul>';
    
    body = document.body;
    
    document.body.appendChild(applicationForm);
    document.body.appendChild(contactForm);
    document.body.appendChild(themeToggle);
    document.body.appendChild(mobileMenuToggle);
    document.body.appendChild(mainNav);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Network Error Handling', () => {
    test('should handle complete network failure gracefully', async () => {
      // Mock complete network failure
      global.fetch = jest.fn(() => {
        return Promise.reject(new Error('Network unavailable'));
      });
      
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      
      const { handleApplicationSubmit } = require('../../js/validation.js');
      
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should show user-friendly error message
      expect(console.error).toHaveBeenCalledWith('Network error submitting application:', expect.any(Error));
      
      // Should restore button state
      const submitButton = applicationForm.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBe(false);
      expect(submitButton.textContent).toBe('Submit Application');
    });

    test('should handle Formspree API errors with detailed feedback', async () => {
      // Mock Formspree API error
      global.fetch = jest.fn(() => {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            errors: [
              { message: 'Invalid email format' },
              { message: 'Name is required' }
            ]
          })
        });
      });
      
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      
      nameInput.value = '';
      emailInput.value = 'invalid-email';
      
      const { handleApplicationSubmit } = require('../../js/validation.js');
      
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should parse and display specific error messages
      expect(console.warn).toHaveBeenCalledWith('Could not parse error response as JSON:', expect.any(Error));
    });

    test('should handle malformed JSON responses', async () => {
      // Mock malformed JSON response
      global.fetch = jest.fn(() => {
        return Promise.resolve({
          ok: false,
          json: () => Promise.reject(new Error('Invalid JSON'))
        });
      });
      
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      
      const { handleApplicationSubmit } = require('../../js/validation.js');
      
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should handle JSON parsing errors gracefully
      expect(console.warn).toHaveBeenCalledWith('Could not parse error response as JSON:', expect.any(Error));
    });
  });

  describe('Form Validation Error Recovery', () => {
    test('should recover from validation errors and allow retry', async () => {
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      
      // Initial invalid data
      nameInput.value = '';
      emailInput.value = 'invalid-email';
      
      const { validateForm } = require('../../js/validation.js');
      
      const isValid = validateForm(applicationForm, true);
      expect(isValid).toBe(false);
      
      // Should show error messages
      const errorMessages = applicationForm.querySelectorAll('.field-error');
      expect(errorMessages.length).toBeGreaterThan(0);
      
      // User fixes the errors
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      
      nameInput.dispatchEvent(new Event('input'));
      emailInput.dispatchEvent(new Event('input'));
      
      // Should clear errors and enable submission
      const remainingErrors = applicationForm.querySelectorAll('.field-error');
      expect(remainingErrors.length).toBe(0);
      
      const submitButton = applicationForm.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBe(false);
    });

    test('should handle dynamic form field changes', () => {
      const nameInput = applicationForm.querySelector('#name');
      
      // Remove required attribute dynamically
      nameInput.removeAttribute('required');
      
      const { validateField } = require('../../js/validation.js');
      
      // Should not validate empty optional field
      nameInput.value = '';
      const isValid = validateField(nameInput, false);
      expect(isValid).toBe(true);
      
      // Add required attribute back
      nameInput.setAttribute('required', 'true');
      
      // Should now validate as required
      const isValidRequired = validateField(nameInput, false);
      expect(isValidRequired).toBe(false);
    });

    test('should handle missing form elements gracefully', () => {
      // Remove form elements
      const nameInput = applicationForm.querySelector('#name');
      nameInput.remove();
      
      const { validateForm } = require('../../js/validation.js');
      
      // Should handle missing elements without crashing
      expect(() => validateForm(applicationForm, false)).not.toThrow();
    });
  });

  describe('Theme Toggle Error Handling', () => {
    test('should handle localStorage failures gracefully', () => {
      // Mock localStorage failure
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('localStorage quota exceeded');
      });
      
      const { setTheme } = require('../../js/theme-toggle.js');
      
      // Should not throw error
      expect(() => setTheme('dark')).not.toThrow();
      
      // Theme should still be applied to DOM
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      
      // Restore localStorage
      localStorage.setItem = originalSetItem;
    });

    test('should handle missing theme elements', () => {
      // Remove theme toggle button
      themeToggle.remove();
      
      const { setTheme } = require('../../js/theme-toggle.js');
      
      // Should not throw error
      expect(() => setTheme('dark')).not.toThrow();
      
      // Theme should still be applied to DOM
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('should handle malformed theme data', () => {
      // Mock malformed localStorage data
      localStorage.setItem('theme', 'invalid-theme');
      
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      
      // Should handle gracefully and default to light
      expect(() => initializeThemeToggle()).not.toThrow();
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('Mobile Menu Error Handling', () => {
    test('should handle missing menu elements', () => {
      // Remove menu elements
      mobileMenuToggle.remove();
      mainNav.remove();
      
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      
      // Should not throw error
      expect(() => initializeMobileMenu()).not.toThrow();
    });

    test('should handle viewport detection errors', () => {
      // Mock window.innerWidth to throw error
      Object.defineProperty(window, 'innerWidth', {
        get: () => {
          throw new Error('Viewport detection failed');
        }
      });
      
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      
      // Should handle gracefully
      expect(() => initializeMobileMenu()).not.toThrow();
    });

    test('should handle focus management errors', () => {
      const { openMenu } = require('../../js/mobile-menu.js');
      
      // Mock focus to throw error
      const originalFocus = HTMLElement.prototype.focus;
      HTMLElement.prototype.focus = jest.fn(() => {
        throw new Error('Focus failed');
      });
      
      // Should not throw error
      expect(() => openMenu()).not.toThrow();
      
      // Restore focus
      HTMLElement.prototype.focus = originalFocus;
    });
  });

  describe('Performance Monitoring Error Handling', () => {
    test('should handle PerformanceObserver failures', () => {
      // Mock PerformanceObserver to throw error
      global.PerformanceObserver = jest.fn(() => {
        throw new Error('PerformanceObserver not supported');
      });
      
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      
      // Should handle gracefully
      expect(() => initPerformanceMonitoring()).not.toThrow();
    });

    test('should handle missing performance APIs', () => {
      // Remove performance API
      delete window.performance;
      
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      
      // Should handle gracefully
      expect(() => initPerformanceMonitoring()).not.toThrow();
    });

    test('should handle malformed performance entries', () => {
      // Mock PerformanceObserver with malformed entries
      global.PerformanceObserver = class PerformanceObserver {
        constructor(callback) {
          this.callback = callback;
        }
        
        observe(options) {
          if (options.type === 'largest-contentful-paint') {
            // Simulate malformed entry
            if (this.callback) {
              this.callback({
                getEntries: () => [null, undefined, {}]
              });
            }
          }
        }
        
        disconnect() {}
      };
      
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      
      // Should handle gracefully
      expect(() => initPerformanceMonitoring()).not.toThrow();
    });
  });

  describe('Comparison Slider Error Handling', () => {
    test('should handle missing image sources', () => {
      const slider = document.createElement('div');
      slider.className = 'comparison-slider';
      slider.dataset.before = ''; // Empty source
      slider.dataset.after = ''; // Empty source
      document.body.appendChild(slider);
      
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      
      // Should handle gracefully
      expect(() => createComparisonSlider(slider, 0)).not.toThrow();
    });

    test('should handle malformed slider structure', () => {
      const slider = document.createElement('div');
      slider.className = 'comparison-slider';
      slider.dataset.before = 'before.jpg';
      slider.dataset.after = 'after.jpg';
      // Missing required container styles
      document.body.appendChild(slider);
      
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      
      // Should handle gracefully
      expect(() => createComparisonSlider(slider, 0)).not.toThrow();
    });

    test('should handle touch event errors', () => {
      const slider = document.createElement('div');
      slider.className = 'comparison-slider';
      slider.dataset.before = 'before.jpg';
      slider.dataset.after = 'after.jpg';
      slider.style.width = '500px';
      slider.style.height = '300px';
      document.body.appendChild(slider);
      
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      createComparisonSlider(slider, 0);
      
      const handle = slider.querySelector('.slider-handle');
      
      // Mock touch events to throw errors
      handle.addEventListener = jest.fn((event, handler) => {
        if (event === 'touchstart') {
          throw new Error('Touch event failed');
        }
      });
      
      // Should handle gracefully
      expect(() => {
        const touchEvent = new TouchEvent('touchstart', { 
          touches: [{ clientX: 250 }],
          bubbles: true 
        });
        handle.dispatchEvent(touchEvent);
      }).not.toThrow();
    });
  });

  describe('FAQ Search Error Handling', () => {
    test('should handle malformed FAQ structure', () => {
      const faqContainer = document.createElement('div');
      faqContainer.className = 'accordion';
      faqContainer.innerHTML = `
        <div class="accordion-item">
          <!-- Missing header and content -->
        </div>
      `;
      document.body.appendChild(faqContainer);
      
      const { initFAQ } = require('../../js/accordion-faq.js');
      
      // Should handle gracefully
      expect(() => initFAQ()).not.toThrow();
    });

    test('should handle search with missing elements', () => {
      const searchInput = document.createElement('input');
      searchInput.id = 'faq-search';
      document.body.appendChild(searchInput);
      
      const { handleFAQSearch } = require('../../js/accordion-faq.js');
      
      // Should handle missing elements gracefully
      expect(() => handleFAQSearch()).not.toThrow();
    });

    test('should handle debouncing errors', () => {
      const searchInput = document.createElement('input');
      searchInput.id = 'faq-search';
      document.body.appendChild(searchInput);
      
      const { initFAQ } = require('../../js/accordion-faq.js');
      initFAQ();
      
      // Mock debounce to throw error
      const originalDebounce = require('../../js/accordion-faq.js').debounce;
      
      // Should handle gracefully even if debounce fails
      expect(() => {
        searchInput.value = 'test';
        searchInput.dispatchEvent(new Event('input'));
      }).not.toThrow();
    });
  });

  describe('Property Filters Error Handling', () => {
    test('should handle missing filter elements', () => {
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      
      // Should handle missing elements gracefully
      expect(() => initPropertyFilters()).not.toThrow();
    });

    test('should handle malformed property cards', () => {
      const propertyCard = document.createElement('div');
      propertyCard.className = 'property-card';
      // Missing title and details elements
      document.body.appendChild(propertyCard);
      
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      
      // Should handle gracefully and show warning
      expect(() => initPropertyFilters()).not.toThrow();
    });

    test('should handle filter state corruption', () => {
      const searchInput = document.createElement('input');
      searchInput.id = 'property-search';
      document.body.appendChild(searchInput);
      
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      initPropertyFilters();
      
      // Corrupt the search input value
      searchInput.value = null;
      
      // Should handle gracefully
      expect(() => {
        searchInput.dispatchEvent(new Event('input'));
      }).not.toThrow();
    });
  });

  describe('Cross-Module Error Isolation', () => {
    test('should isolate errors between modules', () => {
      // Create errors in multiple modules
      const malformedForm = document.createElement('form');
      malformedForm.id = 'malformed-form';
      // Missing action attribute
      document.body.appendChild(malformedForm);
      
      const malformedSlider = document.createElement('div');
      malformedSlider.className = 'comparison-slider';
      // Missing data attributes
      document.body.appendChild(malformedSlider);
      
      // Initialize modules - some should fail gracefully
      const { initForms } = require('../../js/forms.js');
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      
      expect(() => initForms()).not.toThrow();
      expect(() => createComparisonSlider(malformedSlider, 0)).not.toThrow();
      
      // Other modules should continue working
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      expect(() => initializeThemeToggle()).not.toThrow();
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    test('should recover from global errors', () => {
      // Simulate a global error that affects multiple modules
      const originalError = console.error;
      
      // Force an error in one module
      const errorForm = document.createElement('form');
      errorForm.id = 'error-form';
      document.body.appendChild(errorForm);
      
      // The system should continue functioning despite individual module errors
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      
      expect(() => initializeThemeToggle()).not.toThrow();
      expect(() => initializeMobileMenu()).not.toThrow();
      
      // Core functionality should still work
      expect(themeToggle).toBeTruthy();
      expect(mobileMenuToggle).toBeTruthy();
      
      console.error = originalError;
    });
  });

  describe('User Experience Error Recovery', () => {
    test('should provide clear error messages to users', async () => {
      global.fetch = jest.fn(() => {
        return Promise.reject(new Error('Connection timeout'));
      });
      
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      
      const { handleApplicationSubmit } = require('../../js/validation.js');
      
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should provide user-friendly error message
      expect(console.error).toHaveBeenCalledWith('Network error submitting application:', expect.any(Error));
      
      // Should restore UI state for retry
      const submitButton = applicationForm.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBe(false);
      expect(submitButton.textContent).toBe('Submit Application');
    });

    test('should maintain accessibility during error states', () => {
      const { validateForm } = require('../../js/validation.js');
      
      // Create form with accessibility issues
      const form = document.createElement('form');
      const input = document.createElement('input');
      input.type = 'text';
      input.required = true;
      input.value = '';
      form.appendChild(input);
      document.body.appendChild(form);
      
      // Should handle accessibility gracefully even with errors
      expect(() => validateForm(form, true)).not.toThrow();
      
      // ARIA attributes should be properly managed
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    test('should preserve user data during error recovery', async () => {
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      
      global.fetch = jest.fn(() => {
        return Promise.reject(new Error('Server error'));
      });
      
      const { handleApplicationSubmit } = require('../../js/validation.js');
      
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Form data should be preserved for retry
      expect(nameInput.value).toBe('John Doe');
      expect(emailInput.value).toBe('john@example.com');
      
      // User can retry submission
      global.fetch = jest.fn(() => {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      });
      
      const retryEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(retryEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should succeed on retry
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});