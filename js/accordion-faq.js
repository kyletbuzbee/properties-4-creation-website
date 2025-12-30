/**
 * Properties 4 Creations - FAQ Module
 * Handles FAQ accordion functionality and search
 *
 * @fileoverview Provides FAQ accordion and search functionality
 * @author Properties 4 Creations
 */

/**
 * Initialize FAQ accordions
 */
export function initFAQ() {
  initializeAccordions();
  initializeFAQSearch();
}

/**
 * Initialize accordions (FAQ section)
 */
function initializeAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isActive = content.classList.contains('active');

      // Close all accordions in the same group
      const accordion = header.closest('.accordion');
      const allContents = accordion.querySelectorAll('.accordion-content');
      const allHeaders = accordion.querySelectorAll('.accordion-header');

      allContents.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-hidden', 'true');
      });
      allHeaders.forEach(h => h.setAttribute('aria-expanded', 'false'));

      // Open clicked accordion if it wasn't active
      if (!isActive) {
        content.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
      }
    });

    // Set initial ARIA attributes
    header.setAttribute('aria-expanded', 'false');
    const content = header.nextElementSibling;
    content.setAttribute('aria-hidden', 'true');
  });
}

/**
 * Initialize FAQ search functionality
 */
function initializeFAQSearch() {
  const searchInput = document.getElementById('faq-search');
  const clearButton = document.getElementById('clear-search');
  const noResults = document.getElementById('faq-no-results');

  if (!searchInput) return;

  // Add search functionality
  searchInput.addEventListener('input', debounce(handleFAQSearch, 300));

  // Clear search functionality
  if (clearButton) {
    clearButton.addEventListener('click', clearFAQSearch);
  }

  // Keyboard shortcuts
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      clearFAQSearch();
    }
  });
}

/**
 * Handle FAQ search
 */
function handleFAQSearch() {
  const searchInput = document.getElementById('faq-search');
  const clearButton = document.getElementById('clear-search');
  const noResults = document.getElementById('faq-no-results');
  const searchTerm = searchInput.value.toLowerCase().trim();

  const accordionItems = document.querySelectorAll('.accordion-item');
  let visibleCount = 0;

  accordionItems.forEach(item => {
    const question = item.querySelector('.question-text');
    const answer = item.querySelector('.accordion-content');
    const category = item.dataset.category || '';

    if (!question || !answer) return;

    const questionText = question.textContent.toLowerCase();
    const answerText = answer.textContent.toLowerCase();

    const matches = !searchTerm ||
      questionText.includes(searchTerm) ||
      answerText.includes(searchTerm) ||
      category.includes(searchTerm);

    if (matches) {
      item.style.display = 'block';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });

  // Show/hide clear button
  if (clearButton) {
    clearButton.style.display = searchTerm ? 'inline-block' : 'none';
  }

  // Show/hide no results message
  if (noResults) {
    noResults.style.display = visibleCount === 0 && searchTerm ? 'block' : 'none';
  }

  // Announce results to screen readers
  if (searchTerm) {
    const announcement = `${visibleCount} FAQ items found for "${searchTerm}"`;
    announceToScreenReader(announcement);
  }
}

/**
 * Clear FAQ search
 */
function clearFAQSearch() {
  const searchInput = document.getElementById('faq-search');
  const clearButton = document.getElementById('clear-search');
  const noResults = document.getElementById('faq-no-results');

  if (searchInput) searchInput.value = '';
  if (clearButton) clearButton.style.display = 'none';
  if (noResults) noResults.style.display = 'none';

  // Show all FAQ items
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    item.style.display = 'block';
  });

  // Close all accordions
  const accordionContents = document.querySelectorAll('.accordion-content');
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionContents.forEach(content => content.classList.remove('active'));
  accordionHeaders.forEach(header => header.setAttribute('aria-expanded', 'false'));
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.remove();
    }
  }, 1000);
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}