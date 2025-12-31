/**
 * Properties 4 Creations - FAQ Module Unit Tests
 * Comprehensive tests for FAQ accordion functionality and search
 */

describe('FAQ Module', () => {
  let accordionContainer;
  let searchInput;
  let clearButton;
  let noResultsMessage;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Create mock accordion structure
    accordionContainer = document.createElement('div');
    accordionContainer.className = 'accordion';
    
    // Create accordion items
    for (let i = 1; i <= 3; i++) {
      const item = document.createElement('div');
      item.className = 'accordion-item';
      item.dataset.category = i === 1 ? 'housing' : i === 2 ? 'application' : 'general';
      
      const header = document.createElement('button');
      header.className = 'accordion-header';
      header.innerHTML = `<span class="question-text">Question ${i}</span>`;
      
      const content = document.createElement('div');
      content.className = 'accordion-content';
      content.innerHTML = `<p>Answer ${i} content</p>`;
      
      item.appendChild(header);
      item.appendChild(content);
      accordionContainer.appendChild(item);
    }
    
    // Create search elements
    searchInput = document.createElement('input');
    searchInput.id = 'faq-search';
    searchInput.type = 'search';
    searchInput.placeholder = 'Search FAQs...';
    
    clearButton = document.createElement('button');
    clearButton.id = 'clear-search';
    clearButton.type = 'button';
    clearButton.textContent = 'Clear';
    clearButton.style.display = 'none';
    
    noResultsMessage = document.createElement('div');
    noResultsMessage.id = 'faq-no-results';
    noResultsMessage.textContent = 'No FAQs found matching your search.';
    noResultsMessage.style.display = 'none';
    
    document.body.appendChild(accordionContainer);
    document.body.appendChild(searchInput);
    document.body.appendChild(clearButton);
    document.body.appendChild(noResultsMessage);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Accordion Initialization', () => {
    test('should initialize accordions with correct ARIA attributes', () => {
      const { initFAQ } = require('../../js/accordion-faq.js');
      
      initFAQ();
      
      const headers = document.querySelectorAll('.accordion-header');
      const contents = document.querySelectorAll('.accordion-content');
      
      expect(headers.length).toBe(3);
      expect(contents.length).toBe(3);
      
      headers.forEach(header => {
        expect(header.getAttribute('aria-expanded')).toBe('false');
      });
      
      contents.forEach(content => {
        expect(content.getAttribute('aria-hidden')).toBe('true');
        expect(content.classList.contains('active')).toBe(false);
      });
    });

    test('should toggle accordion state on header click', () => {
      const { initFAQ } = require('../../js/accordion-faq.js');
      
      initFAQ();
      
      const firstHeader = document.querySelector('.accordion-header');
      const firstContent = firstHeader.nextElementSibling;
      
      // Click to open
      firstHeader.click();
      
      expect(firstHeader.getAttribute('aria-expanded')).toBe('true');
      expect(firstContent.getAttribute('aria-hidden')).toBe('false');
      expect(firstContent.classList.contains('active')).toBe(true);
      
      // Click to close
      firstHeader.click();
      
      expect(firstHeader.getAttribute('aria-expanded')).toBe('false');
      expect(firstContent.getAttribute('aria-hidden')).toBe('true');
      expect(firstContent.classList.contains('active')).toBe(false);
    });

    test('should close other accordions when opening a new one', () => {
      const { initFAQ } = require('../../js/accordion-faq.js');
      
      initFAQ();
      
      const headers = document.querySelectorAll('.accordion-header');
      const contents = document.querySelectorAll('.accordion-content');
      
      // Open first accordion
      headers[0].click();
      expect(headers[0].getAttribute('aria-expanded')).toBe('true');
      expect(contents[0].classList.contains('active')).toBe(true);
      
      // Open second accordion
      headers[1].click();
      
      // First should be closed, second should be open
      expect(headers[0].getAttribute('aria-expanded')).toBe('false');
      expect(contents[0].classList.contains('active')).toBe(false);
      expect(headers[1].getAttribute('aria-expanded')).toBe('true');
      expect(contents[1].classList.contains('active')).toBe(true);
    });

    test('should handle missing accordion elements gracefully', () => {
      // Remove accordion container
      accordionContainer.remove();
      
      const { initFAQ } = require('../../js/accordion-faq.js');
      
      // Should not throw error
      expect(() => initFAQ()).not.toThrow();
    });
  });

  describe('FAQ Search Functionality', () => {
    beforeEach(() => {
      const { initFAQ } = require('../../js/accordion-faq.js');
      initFAQ();
    });

    test('should filter FAQ items based on search term', () => {
      // Set search term
      searchInput.value = 'question 1';
      searchInput.dispatchEvent(new Event('input'));
      
      const items = document.querySelectorAll('.accordion-item');
      
      // Only first item should be visible
      expect(items[0].style.display).toBe('block');
      expect(items[1].style.display).toBe('none');
      expect(items[2].style.display).toBe('none');
    });

    test('should show clear button when search has content', () => {
      searchInput.value = 'test';
      searchInput.dispatchEvent(new Event('input'));
      
      expect(clearButton.style.display).toBe('inline-block');
    });

    test('should hide clear button when search is empty', () => {
      searchInput.value = 'test';
      searchInput.dispatchEvent(new Event('input'));
      expect(clearButton.style.display).toBe('inline-block');
      
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      
      expect(clearButton.style.display).toBe('none');
    });

    test('should show no results message when no items match', () => {
      searchInput.value = 'nonexistent';
      searchInput.dispatchEvent(new Event('input'));
      
      expect(noResultsMessage.style.display).toBe('block');
    });

    test('should hide no results message when items match', () => {
      searchInput.value = 'nonexistent';
      searchInput.dispatchEvent(new Event('input'));
      expect(noResultsMessage.style.display).toBe('block');
      
      searchInput.value = 'question';
      searchInput.dispatchEvent(new Event('input'));
      
      expect(noResultsMessage.style.display).toBe('none');
    });

    test('should search in question text', () => {
      searchInput.value = 'question 2';
      searchInput.dispatchEvent(new Event('input'));
      
      const items = document.querySelectorAll('.accordion-item');
      expect(items[1].style.display).toBe('block');
      expect(items[0].style.display).toBe('none');
      expect(items[2].style.display).toBe('none');
    });

    test('should search in answer content', () => {
      // Update answer content
      const content = document.querySelector('.accordion-content');
      content.innerHTML = '<p>Special answer content for testing</p>';
      
      searchInput.value = 'special';
      searchInput.dispatchEvent(new Event('input'));
      
      const items = document.querySelectorAll('.accordion-item');
      expect(items[0].style.display).toBe('block');
    });

    test('should search in category data attribute', () => {
      searchInput.value = 'housing';
      searchInput.dispatchEvent(new Event('input'));
      
      const items = document.querySelectorAll('.accordion-item');
      expect(items[0].style.display).toBe('block');
      expect(items[1].style.display).toBe('none');
      expect(items[2].style.display).toBe('none');
    });

    test('should be case insensitive', () => {
      searchInput.value = 'QUESTION 1';
      searchInput.dispatchEvent(new Event('input'));
      
      const items = document.querySelectorAll('.accordion-item');
      expect(items[0].style.display).toBe('block');
    });

    test('should handle empty search term', () => {
      // First filter something
      searchInput.value = 'question 1';
      searchInput.dispatchEvent(new Event('input'));
      
      const items = document.querySelectorAll('.accordion-item');
      expect(items[0].style.display).toBe('block');
      expect(items[1].style.display).toBe('none');
      
      // Clear search
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      
      // All items should be visible
      items.forEach(item => {
        expect(item.style.display).toBe('block');
      });
    });
  });

  describe('Clear Search Functionality', () => {
    beforeEach(() => {
      const { initFAQ } = require('../../js/accordion-faq.js');
      initFAQ();
    });

    test('should clear search input and reset filters', () => {
      // Set up search
      searchInput.value = 'question 1';
      searchInput.dispatchEvent(new Event('input'));
      
      const items = document.querySelectorAll('.accordion-item');
      expect(items[0].style.display).toBe('block');
      expect(items[1].style.display).toBe('none');
      
      // Clear search
      clearButton.click();
      
      expect(searchInput.value).toBe('');
      expect(clearButton.style.display).toBe('none');
      expect(noResultsMessage.style.display).toBe('none');
      
      // All items should be visible
      items.forEach(item => {
        expect(item.style.display).toBe('block');
      });
    });

    test('should close all accordions when clearing search', () => {
      const headers = document.querySelectorAll('.accordion-header');
      const contents = document.querySelectorAll('.accordion-content');
      
      // Open an accordion
      headers[0].click();
      expect(contents[0].classList.contains('active')).toBe(true);
      
      // Clear search
      clearButton.click();
      
      // All accordions should be closed
      contents.forEach(content => {
        expect(content.classList.contains('active')).toBe(false);
      });
      
      headers.forEach(header => {
        expect(header.getAttribute('aria-expanded')).toBe('false');
      });
    });

    test('should handle clear button click when no search is active', () => {
      // Clear button should be hidden initially
      expect(clearButton.style.display).toBe('none');
      
      // Clicking it should not cause errors
      expect(() => clearButton.click()).not.toThrow();
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      const { initFAQ } = require('../../js/accordion-faq.js');
      initFAQ();
    });

    test('should clear search on Escape key', () => {
      searchInput.value = 'test';
      searchInput.dispatchEvent(new Event('input'));
      
      expect(clearButton.style.display).toBe('inline-block');
      
      // Simulate Escape key
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      searchInput.dispatchEvent(escapeEvent);
      
      expect(searchInput.value).toBe('');
      expect(clearButton.style.display).toBe('none');
    });
  });

  describe('Screen Reader Announcements', () => {
    beforeEach(() => {
      const { initFAQ } = require('../../js/accordion-faq.js');
      initFAQ();
    });

    test('should announce search results to screen readers', () => {
      searchInput.value = 'question';
      searchInput.dispatchEvent(new Event('input'));
      
      const announcement = document.querySelector('[aria-live="polite"]');
      expect(announcement).toBeTruthy();
      expect(announcement.textContent).toBe('3 FAQ items found for "question"');
    });

    test('should announce when no results are found', () => {
      searchInput.value = 'nonexistent';
      searchInput.dispatchEvent(new Event('input'));
      
      const announcement = document.querySelector('[aria-live="polite"]');
      expect(announcement).toBeTruthy();
      expect(announcement.textContent).toBe('0 FAQ items found for "nonexistent"');
    });

    test('should remove announcement after timeout', (done) => {
      searchInput.value = 'test';
      searchInput.dispatchEvent(new Event('input'));
      
      setTimeout(() => {
        const announcement = document.querySelector('[aria-live="polite"]');
        expect(announcement).toBeNull();
        done();
      }, 1100);
    });
  });

  describe('Debounced Search', () => {
    test('should debounce search input', (done) => {
      const { initFAQ } = require('../../js/accordion-faq.js');
      initFAQ();
      
      // Mock setTimeout to control timing
      jest.useFakeTimers();
      
      searchInput.value = 'test';
      searchInput.dispatchEvent(new Event('input'));
      
      // Search should not happen immediately
      let items = document.querySelectorAll('.accordion-item');
      expect(items[0].style.display).toBe(''); // Default state
      
      // Fast-forward 300ms
      jest.advanceTimersByTime(300);
      
      // Now search should have happened
      items = document.querySelectorAll('.accordion-item');
      expect(items[0].style.display).toBe('block');
      
      jest.clearAllTimers();
      done();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing search elements gracefully', () => {
      // Remove search elements
      searchInput.remove();
      clearButton.remove();
      noResultsMessage.remove();
      
      const { initFAQ } = require('../../js/accordion-faq.js');
      
      // Should not throw error
      expect(() => initFAQ()).not.toThrow();
    });

    test('should handle missing accordion content', () => {
      // Remove content from one item
      const item = document.querySelector('.accordion-item');
      const content = item.querySelector('.accordion-content');
      content.remove();
      
      const { initFAQ } = require('../../js/accordion-faq.js');
      
      // Should not throw error
      expect(() => initFAQ()).not.toThrow();
    });

    test('should handle malformed accordion structure', () => {
      // Create malformed accordion
      const malformedItem = document.createElement('div');
      malformedItem.className = 'accordion-item';
      // Missing header and content
      
      accordionContainer.appendChild(malformedItem);
      
      const { initFAQ } = require('../../js/accordion-faq.js');
      
      // Should not throw error
      expect(() => initFAQ()).not.toThrow();
    });
  });

  describe('Multiple Accordions', () => {
    test('should handle multiple accordion groups independently', () => {
      // Create second accordion group
      const secondAccordion = document.createElement('div');
      secondAccordion.className = 'accordion';
      
      const secondItem = document.createElement('div');
      secondItem.className = 'accordion-item';
      
      let secondAccordionHeader = document.createElement('button');
      secondHeader.className = 'accordion-header';
      secondHeader.innerHTML = '<span class="question-text">Second Group Question</span>';
      
      const secondContent = document.createElement('div');
      secondContent.className = 'accordion-content';
      secondContent.innerHTML = '<p>Second group answer</p>';
      
      secondItem.appendChild(secondHeader);
      secondItem.appendChild(secondContent);
      secondAccordion.appendChild(secondItem);
      document.body.appendChild(secondAccordion);
      
      const { initFAQ } = require('../../js/accordion-faq.js');
      initFAQ();
      
      // Open first accordion in first group
      const firstHeader = document.querySelector('.accordion-header');
      firstHeader.click();
      
      // Open accordion in second group
      secondAccordionHeader = secondAccordion.querySelector('.accordion-header');
      secondHeader.click();
      
      // Both should be open independently
      expect(firstHeader.getAttribute('aria-expanded')).toBe('true');
      expect(secondHeader.getAttribute('aria-expanded')).toBe('true');
    });
  });
});