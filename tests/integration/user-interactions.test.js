/**
 * Properties 4 Creations - User Interaction Integration Tests
 * Comprehensive tests for complete user interaction flows
 */

describe('User Interaction Integration Tests', () => {
  let themeToggle;
  let mobileMenuToggle;
  let mainNav;
  let body;
  let searchInputs;
  let accordions;
  let comparisonSliders;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Set up theme toggle
    themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.innerHTML = '<span class="theme-icon">🌙</span><span class="theme-text">Dark Mode</span>';
    document.body.appendChild(themeToggle);
    
    // Set up mobile menu
    mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'menu-toggle';
    mobileMenuToggle.textContent = 'Menu';
    
    mainNav = document.createElement('nav');
    mainNav.className = 'main-navigation';
    mainNav.innerHTML = `
      <ul>
        <li><a href="/" class="nav-link">Home</a></li>
        <li><a href="/about" class="nav-link">About</a></li>
        <li><a href="/properties" class="nav-link">Properties</a></li>
        <li><a href="/contact" class="nav-link">Contact</a></li>
      </ul>
    `;
    
    document.body.appendChild(mobileMenuToggle);
    document.body.appendChild(mainNav);
    body = document.body;
    
    // Set up FAQ accordions
    const faqContainer = document.createElement('div');
    faqContainer.className = 'accordion';
    faqContainer.innerHTML = `
      <div class="accordion-item" data-category="housing">
        <button class="accordion-header">
          <span class="question-text">How do I apply for housing?</span>
        </button>
        <div class="accordion-content">
          <p>To apply for housing, please fill out our application form with your personal information, housing preferences, and any special requirements.</p>
        </div>
      </div>
      <div class="accordion-item" data-category="application">
        <button class="accordion-header">
          <span class="question-text">What documents are required?</span>
        </button>
        <div class="accordion-content">
          <p>We require proof of income, identification, and references from previous landlords.</p>
        </div>
      </div>
    `;
    
    // Set up FAQ search
    const searchContainer = document.createElement('div');
    searchContainer.innerHTML = `
      <input type="search" id="faq-search" placeholder="Search FAQs...">
      <button id="clear-search" style="display: none;">Clear</button>
      <div id="faq-no-results" style="display: none;">No FAQs found matching your search.</div>
    `;
    
    document.body.appendChild(faqContainer);
    document.body.appendChild(searchContainer);
    
    // Set up comparison sliders
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'comparison-slider';
    sliderContainer.dataset.before = 'before.jpg';
    sliderContainer.dataset.after = 'after.jpg';
    sliderContainer.style.width = '500px';
    sliderContainer.style.height = '300px';
    
    document.body.appendChild(sliderContainer);
    
    // Set up property filters
    const filterContainer = document.createElement('div');
    filterContainer.innerHTML = `
      <input type="text" id="property-search" placeholder="Search properties...">
      <select id="filter-bedrooms">
        <option value="">All Bedrooms</option>
        <option value="1">1 Bedroom</option>
        <option value="2">2 Bedrooms</option>
      </select>
      <select id="filter-location">
        <option value="">All Locations</option>
        <option value="Tyler">Tyler</option>
        <option value="Longview">Longview</option>
      </select>
      <div id="no-results" style="display: none;">No properties found matching your criteria.</div>
    `;
    
    document.body.appendChild(filterContainer);
    
    // Create property cards
    const properties = [
      { title: 'Jefferson Riverfront', details: '3 br, 2 ba - Tyler' },
      { title: 'Kemp Townhome', details: '2 br, 1 ba - Longview' }
    ];
    
    properties.forEach(prop => {
      const card = document.createElement('div');
      card.className = 'property-card';
      card.innerHTML = `
        <h3 class="property-title">${prop.title}</h3>
        <p class="property-details">${prop.details}</p>
      `;
      document.body.appendChild(card);
    });
    
    // Initialize modules
    searchInputs = {
      faq: document.getElementById('faq-search'),
      property: document.getElementById('property-search')
    };
    
    accordions = document.querySelectorAll('.accordion-header');
    comparisonSliders = document.querySelectorAll('.comparison-slider');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Complete User Journey - New Visitor', () => {
    test('should handle new visitor experience from landing to interaction', async () => {
      // 1. Visitor lands on site (theme detection)
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      initializeThemeToggle();
      
      // Should default to light theme
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(themeToggle.getAttribute('aria-pressed')).toBe('false');
      
      // 2. Visitor explores FAQ section
      const { initFAQ } = require('../../js/accordion-faq.js');
      initFAQ();
      
      // Search for housing information
      searchInputs.faq.value = 'housing';
      searchInputs.faq.dispatchEvent(new Event('input'));
      
      const visibleItems = document.querySelectorAll('.accordion-item[style*="display: block"]');
      expect(visibleItems.length).toBe(1);
      
      // Open first FAQ
      const firstHeader = document.querySelector('.accordion-header');
      firstHeader.click();
      
      const firstContent = firstHeader.nextElementSibling;
      expect(firstContent.classList.contains('active')).toBe(true);
      expect(firstHeader.getAttribute('aria-expanded')).toBe('true');
      
      // 3. Visitor views before/after comparisons
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      createComparisonSlider(comparisonSliders[0], 0);
      
      const handle = comparisonSliders[0].querySelector('.slider-handle');
      const overlay = comparisonSliders[0].querySelector('.slider-overlay');
      
      // Drag slider to compare
      const mousedownEvent = new MouseEvent('mousedown', { 
        clientX: 250,
        bubbles: true 
      });
      handle.dispatchEvent(mousedownEvent);
      
      const mousemoveEvent = new MouseEvent('mousemove', { 
        clientX: 375,
        bubbles: true 
      });
      document.dispatchEvent(mousemoveEvent);
      
      expect(overlay.style.width).toBe('75%');
      
      // 4. Visitor searches for properties
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      initPropertyFilters();
      
      searchInputs.property.value = 'Jefferson';
      searchInputs.property.dispatchEvent(new Event('input'));
      
      const visibleProperties = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleProperties.length).toBe(1);
      expect(visibleProperties[0].querySelector('.property-title').textContent).toBe('Jefferson Riverfront');
      
      // 5. Visitor switches to dark theme
      themeToggle.click();
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(themeToggle.getAttribute('aria-pressed')).toBe('true');
      
      // 6. Visitor accesses mobile menu (simulate mobile viewport)
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 767,
      });
      
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      initializeMobileMenu();
      
      mobileMenuToggle.click();
      
      expect(mobileMenuToggle.getAttribute('aria-expanded')).toBe('true');
      expect(mainNav.getAttribute('aria-hidden')).toBe('false');
      expect(body.style.overflow).toBe('hidden');
      
      // Close menu
      mobileMenuToggle.click();
      
      expect(mobileMenuToggle.getAttribute('aria-expanded')).toBe('false');
      expect(mainNav.getAttribute('aria-hidden')).toBe('true');
      expect(body.style.overflow).toBe('');
    });
  });

  describe('Accessibility-First User Journey', () => {
    test('should provide seamless keyboard navigation throughout site', async () => {
      const { initFAQ } = require('../../js/accordion-faq.js');
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      
      initFAQ();
      createComparisonSlider(comparisonSliders[0], 0);
      
      // 1. Navigate FAQ with keyboard
      const firstHeader = document.querySelector('.accordion-header');
      firstHeader.focus();
      
      // Press Enter to open
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      firstHeader.dispatchEvent(enterEvent);
      
      expect(firstHeader.getAttribute('aria-expanded')).toBe('true');
      
      // 2. Navigate comparison slider with keyboard
      const handle = comparisonSliders[0].querySelector('.slider-handle');
      handle.focus();
      
      // Press right arrow to move slider
      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      handle.dispatchEvent(rightArrowEvent);
      
      expect(handle.style.left).toBe('55%');
      expect(handle.getAttribute('aria-valuenow')).toBe('55');
      
      // Press Home to go to start
      const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
      handle.dispatchEvent(homeEvent);
      
      expect(handle.style.left).toBe('0%');
      
      // 3. Navigate mobile menu with keyboard
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      initializeMobileMenu();
      
      mobileMenuToggle.focus();
      
      // Press Space to open menu
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      mobileMenuToggle.dispatchEvent(spaceEvent);
      
      expect(mobileMenuToggle.getAttribute('aria-expanded')).toBe('true');
      
      // Press Escape to close menu
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
      
      expect(mobileMenuToggle.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Mobile-First User Experience', () => {
    test('should provide optimal mobile experience across all features', async () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      const { initFAQ } = require('../../js/accordion-faq.js');
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      
      initializeMobileMenu();
      initFAQ();
      createComparisonSlider(comparisonSliders[0], 0);
      
      // 1. Mobile menu interaction
      mobileMenuToggle.click();
      
      expect(mobileMenuToggle.getAttribute('aria-expanded')).toBe('true');
      expect(mainNav.getAttribute('aria-hidden')).toBe('false');
      
      // 2. Touch interaction with comparison slider
      const handle = comparisonSliders[0].querySelector('.slider-handle');
      const overlay = comparisonSliders[0].querySelector('.slider-overlay');
      
      // Simulate touch interaction
      const touchstartEvent = new TouchEvent('touchstart', { 
        touches: [{ clientX: 187 }],
        bubbles: true 
      });
      handle.dispatchEvent(touchstartEvent);
      
      const touchmoveEvent = new TouchEvent('touchmove', { 
        touches: [{ clientX: 281 }],
        bubbles: true 
      });
      document.dispatchEvent(touchmoveEvent);
      
      expect(overlay.style.width).toBe('75%');
      
      // 3. Touch interaction with FAQ accordions
      const firstHeader = document.querySelector('.accordion-header');
      firstHeader.click();
      
      expect(firstHeader.getAttribute('aria-expanded')).toBe('true');
      
      // 4. Mobile-friendly property filtering
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      initPropertyFilters();
      
      searchInputs.property.value = 'Jefferson';
      searchInputs.property.dispatchEvent(new Event('input'));
      
      const visibleProperties = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleProperties.length).toBe(1);
      
      // 5. Mobile theme toggle
      themeToggle.click();
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      
      // 6. Close mobile menu by clicking outside
      const outsideClick = new MouseEvent('click', { bubbles: true });
      document.body.dispatchEvent(outsideClick);
      
      expect(mobileMenuToggle.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Error Recovery and Edge Cases', () => {
    test('should handle errors gracefully and allow user recovery', async () => {
      const { initFAQ } = require('../../js/accordion-faq.js');
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      
      initFAQ();
      createComparisonSlider(comparisonSliders[0], 0);
      
      // 1. FAQ search with no results
      searchInputs.faq.value = 'nonexistent';
      searchInputs.faq.dispatchEvent(new Event('input'));
      
      const noResults = document.getElementById('faq-no-results');
      expect(noResults.style.display).toBe('block');
      
      // User clears search and tries again
      searchInputs.faq.value = '';
      searchInputs.faq.dispatchEvent(new Event('input'));
      
      expect(noResults.style.display).toBe('none');
      const allItems = document.querySelectorAll('.accordion-item');
      allItems.forEach(item => {
        expect(item.style.display).toBe('block');
      });
      
      // 2. Comparison slider with missing images
      const malformedSlider = document.createElement('div');
      malformedSlider.className = 'comparison-slider';
      // Missing data attributes
      document.body.appendChild(malformedSlider);
      
      // Should not crash
      expect(() => createComparisonSlider(malformedSlider, 1)).not.toThrow();
      
      // 3. Property filtering with invalid data
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      initPropertyFilters();
      
      // Remove property details to simulate malformed data
      const firstProperty = document.querySelector('.property-card');
      const details = firstProperty.querySelector('.property-details');
      details.remove();
      
      // Should handle gracefully
      searchInputs.property.value = 'Jefferson';
      searchInputs.property.dispatchEvent(new Event('input'));
      
      // Should not crash, even with missing data
      expect(() => {
        searchInputs.property.dispatchEvent(new Event('input'));
      }).not.toThrow();
      
      // 4. Theme toggle with localStorage issues
      localStorage.clear();
      
      // Mock localStorage error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('localStorage error');
      });
      
      themeToggle.click();
      
      // Should still work even if localStorage fails
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      
      // Restore localStorage
      localStorage.setItem = originalSetItem;
    });
  });

  describe('Performance and Responsiveness', () => {
    test('should maintain performance during intensive user interactions', async () => {
      const { initFAQ } = require('../../js/accordion-faq.js');
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      
      initFAQ();
      createComparisonSlider(comparisonSliders[0], 0);
      
      // 1. Rapid FAQ search and filter changes
      const startTime = performance.now();
      
      for (let i = 0; i < 10; i++) {
        searchInputs.faq.value = `search${i}`;
        searchInputs.faq.dispatchEvent(new Event('input'));
      }
      
      const searchTime = performance.now() - startTime;
      expect(searchTime).toBeLessThan(100); // Should be very fast
      
      // 2. Rapid accordion toggles
      const header = document.querySelector('.accordion-header');
      const toggleStartTime = performance.now();
      
      for (let i = 0; i < 20; i++) {
        header.click();
      }
      
      const toggleTime = performance.now() - toggleStartTime;
      expect(toggleTime).toBeLessThan(50); // Should be very fast
      
      // 3. Rapid slider movements
      const handle = comparisonSliders[0].querySelector('.slider-handle');
      const overlay = comparisonSliders[0].querySelector('.slider-overlay');
      const sliderStartTime = performance.now();
      
      for (let i = 0; i < 50; i++) {
        const mousedownEvent = new MouseEvent('mousedown', { 
          clientX: 250,
          bubbles: true 
        });
        handle.dispatchEvent(mousedownEvent);
        
        const mousemoveEvent = new MouseEvent('mousemove', { 
          clientX: 250 + (i * 2),
          bubbles: true 
        });
        document.dispatchEvent(mousemoveEvent);
      }
      
      const sliderTime = performance.now() - sliderStartTime;
      expect(sliderTime).toBeLessThan(200); // Should be responsive
      
      // 4. Property filtering with many items
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      initPropertyFilters();
      
      // Create many property cards
      const manyPropertiesStartTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
          <h3 class="property-title">Property ${i}</h3>
          <p class="property-details">3 br, 2 ba - Location ${i % 5}</p>
        `;
        document.body.appendChild(card);
      }
      
      searchInputs.property.value = 'Property';
      searchInputs.property.dispatchEvent(new Event('input'));
      
      const manyPropertiesTime = performance.now() - manyPropertiesStartTime;
      expect(manyPropertiesTime).toBeLessThan(100); // Should handle many items efficiently
    });
  });

  describe('Cross-Feature Integration', () => {
    test('should handle multiple features working together seamlessly', async () => {
      const { initFAQ } = require('../../js/accordion-faq.js');
      const { createComparisonSlider } = require('../../js/comparison-slider.js');
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      
      initFAQ();
      createComparisonSlider(comparisonSliders[0], 0);
      initPropertyFilters();
      initializeMobileMenu();
      
      // 1. User switches theme while interacting with other features
      themeToggle.click(); // Switch to dark
      
      // All features should continue working in dark theme
      searchInputs.faq.value = 'housing';
      searchInputs.faq.dispatchEvent(new Event('input'));
      
      const visibleFAQs = document.querySelectorAll('.accordion-item[style*="display: block"]');
      expect(visibleFAQs.length).toBe(1);
      
      // 2. User opens mobile menu while FAQ is open
      mobileMenuToggle.click();
      
      expect(mobileMenuToggle.getAttribute('aria-expanded')).toBe('true');
      expect(mainNav.getAttribute('aria-hidden')).toBe('false');
      
      // FAQ should remain open
      const openHeader = document.querySelector('.accordion-header[aria-expanded="true"]');
      expect(openHeader).toBeTruthy();
      
      // 3. User interacts with comparison slider while menu is open
      const handle = comparisonSliders[0].querySelector('.slider-handle');
      const overlay = comparisonSliders[0].querySelector('.slider-overlay');
      
      const mousedownEvent = new MouseEvent('mousedown', { 
        clientX: 250,
        bubbles: true 
      });
      handle.dispatchEvent(mousedownEvent);
      
      const mousemoveEvent = new MouseEvent('mousemove', { 
        clientX: 375,
        bubbles: true 
      });
      document.dispatchEvent(mousemoveEvent);
      
      expect(overlay.style.width).toBe('75%');
      
      // Menu should remain open
      expect(mobileMenuToggle.getAttribute('aria-expanded')).toBe('true');
      
      // 4. User closes menu and continues with other interactions
      mobileMenuToggle.click();
      
      expect(mobileMenuToggle.getAttribute('aria-expanded')).toBe('false');
      
      // Other features should still work
      searchInputs.property.value = 'Jefferson';
      searchInputs.property.dispatchEvent(new Event('input'));
      
      const visibleProperties = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleProperties.length).toBe(1);
      
      // 5. User switches back to light theme
      themeToggle.click();
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      
      // All features should continue working in light theme
      expect(handle.style.left).toBe('75%'); // Slider position maintained
      expect(openHeader.getAttribute('aria-expanded')).toBe('true'); // FAQ state maintained
    });
  });
});