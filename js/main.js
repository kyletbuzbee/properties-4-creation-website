// Properties 4 Creations - Main JavaScript
// Main entry point with form validation and common functionality

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initializeForms();
  initializeAccordions();
  initializePropertyFilters();

  // Add accessibility features
  addSkipLink();
  addFocusManagement();

  // Initialize current page indicator
  setCurrentPage();

  // Register service worker for PWA functionality
  registerServiceWorker();

  // Initialize lazy loading for images
  initializeLazyLoading();

  // Add performance optimizations
  initializePerformanceOptimizations();
});

/**
 * Register service worker for PWA functionality
 * REMOVED: Service worker not needed for this application
 */
function registerServiceWorker() {
  // Service worker removed - not needed for housing application site
  // Forms require real-time processing, offline capability creates confusion
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      img.classList.add('loaded');
    });
  }
}

/**
 * Initialize performance optimizations
 */
function initializePerformanceOptimizations() {
  // Preload critical resources
  preloadCriticalResources();

  // Add resource hints for better loading
  addResourceHints();

  // Optimize scroll performance
  optimizeScrollPerformance();
}

/**
 * Preload critical resources
 */
function preloadCriticalResources() {
  // Preload logo and critical images
  const criticalImages = [
    '/images/logo/brand-logo.svg',
    '/images/logo/brand-logo.png'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

/**
 * Add resource hints for better loading
 */
function addResourceHints() {
  // DNS prefetch for external domains
  const domains = ['fonts.googleapis.com', 'fonts.gstatic.com'];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
}

/**
 * Optimize scroll performance
 */
function optimizeScrollPerformance() {
  let ticking = false;

  function updateScrollPosition() {
    // Add scroll-based effects here if needed
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition);
      ticking = true;
    }
  });
}

/**
 * Initialize form validation and submission
 */
function initializeForms() {
  // Set minimum date for move-in date field
  setMinimumMoveInDate();

  // Application form validation
  const applicationForm = document.getElementById('application-form');
  if (applicationForm) {
    applicationForm.addEventListener('submit', handleApplicationSubmit);
    addFormValidation(applicationForm);
  }

  // Contact form validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
    addFormValidation(contactForm);
  }
}

/**
 * Set minimum date for move-in date field (7 days from today)
 */
function setMinimumMoveInDate() {
  const moveDateInput = document.getElementById('move-date');
  if (moveDateInput) {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 7);

    // Format as YYYY-MM-DD
    const formattedDate = minDate.toISOString().split('T')[0];
    moveDateInput.setAttribute('min', formattedDate);
  }
}

/**
 * Handle application form submission
 */
function handleApplicationSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Basic validation
  if (!data.name || !data.email || !data.phone || !data.voucher || !data.household || !data.bedrooms) {
    showError('Please fill in all required fields');
    return;
  }

  // Email validation
  if (!isValidEmail(data.email)) {
    showError('Please enter a valid email address');
    return;
  }

  // Phone validation
  if (!isValidPhone(data.phone)) {
    showError('Please enter a valid phone number');
    return;
  }

  // Show success message
  showSuccess('Thank you! Your application has been submitted. We will contact you within 24 hours.');

  // Reset form
  e.target.reset();

  // In a real application, you would send this data to a server
  console.log('Application submitted:', data);
}

/**
 * Handle contact form submission
 */
function handleContactSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Basic validation
  if (!data.name || !data.email || !data.message) {
    showError('Please fill in all required fields');
    return;
  }

  // Email validation
  if (!isValidEmail(data.email)) {
    showError('Please enter a valid email address');
    return;
  }

  // Show success message
  showSuccess('Thank you! Your message has been sent. We will respond within 24 hours.');

  // Reset form
  e.target.reset();

  // In a real application, you would send this data to a server
  console.log('Contact form submitted:', data);
}

/**
 * Add real-time form validation
 */
function addFormValidation(form) {
  const inputs = form.querySelectorAll('input, select, textarea');

  inputs.forEach(input => {
    // Real-time validation on blur
    input.addEventListener('blur', () => {
      validateField(input);
    });

    // Clear errors on input
    input.addEventListener('input', () => {
      clearFieldError(input);
    });
  });
}

/**
 * Validate a single field
 */
export function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  // Required field validation
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  }

  // Email validation
  if (field.type === 'email' && value && !isValidEmail(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid email address';
  }

  // Phone validation
  if (field.type === 'tel' && value && !isValidPhone(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid phone number';
  }

  // Min length validation
  if (field.hasAttribute('minlength') && value.length < field.getAttribute('minlength')) {
    isValid = false;
    errorMessage = `Minimum ${field.getAttribute('minlength')} characters required`;
  }

  if (!isValid) {
    showFieldError(field, errorMessage);
  } else {
    clearFieldError(field);
  }

  return isValid;
}

/**
 * Show error for a specific field
 */
function showFieldError(field, message) {
  clearFieldError(field);

  field.classList.add('error');
  field.setAttribute('aria-invalid', 'true');

  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  errorDiv.setAttribute('role', 'alert');

  field.parentNode.appendChild(errorDiv);
}

/**
 * Clear error for a specific field
 */
function clearFieldError(field) {
  field.classList.remove('error');
  field.removeAttribute('aria-invalid');

  const errorDiv = field.parentNode.querySelector('.field-error');
  if (errorDiv) {
    errorDiv.remove();
  }
}

/**
 * Email validation
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Phone validation (basic US phone number format)
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

/**
 * Show success message
 */
function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  successDiv.setAttribute('role', 'alert');
  successDiv.setAttribute('aria-live', 'polite');

  // Find the form and add the message after it
  const form = document.querySelector('form');
  if (form) {
    form.parentNode.insertBefore(successDiv, form.nextSibling);
  } else {
    document.body.appendChild(successDiv);
  }

  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.remove();
    }
  }, 5000);
}

/**
 * Show error message
 */
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.setAttribute('role', 'alert');
  errorDiv.setAttribute('aria-live', 'assertive');

  // Style the error message
  errorDiv.style.cssText = `
    background: var(--color-semantic-error);
    color: var(--color-neutral-white);
    padding: var(--spacing-4);
    border-radius: 0.5rem;
    margin: var(--spacing-4) 0;
    text-align: center;
  `;

  // Find the form and add the message before it
  const form = document.querySelector('form');
  if (form) {
    form.parentNode.insertBefore(errorDiv, form);
  } else {
    document.body.appendChild(errorDiv);
  }

  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
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

      allContents.forEach(c => c.classList.remove('active'));
      allHeaders.forEach(h => h.setAttribute('aria-expanded', 'false'));

      // Open clicked accordion if it wasn't active
      if (!isActive) {
        content.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });

    // Set initial ARIA attributes
    header.setAttribute('aria-expanded', 'false');
    const content = header.nextElementSibling;
    content.setAttribute('aria-hidden', 'true');
  });

  // Initialize FAQ search if on FAQ page
  initializeFAQSearch();
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
 * Initialize property filters
 */
function initializePropertyFilters() {
  const searchInput = document.getElementById('property-search');
  const bedroomsSelect = document.getElementById('filter-bedrooms');
  const locationSelect = document.getElementById('filter-location');

  if (!searchInput && !bedroomsSelect && !locationSelect) {
    return; // Not on properties page
  }

  const propertyCards = document.querySelectorAll('.property-card');

  function filterProperties() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedBedrooms = bedroomsSelect ? bedroomsSelect.value : '';
    const selectedLocation = locationSelect ? locationSelect.value : '';

    propertyCards.forEach(card => {
      const title = card.querySelector('.property-title').textContent.toLowerCase();
      const details = card.querySelector('.property-details').textContent.toLowerCase();
      const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());

      let matchesSearch = !searchTerm || title.includes(searchTerm) || details.includes(searchTerm) || tags.some(tag => tag.includes(searchTerm));
      let matchesBedrooms = !selectedBedrooms || details.includes(selectedBedrooms + ' br') || (selectedBedrooms === '4' && details.includes('4+ br'));
      let matchesLocation = !selectedLocation || title.includes(selectedLocation) || details.includes(selectedLocation);

      if (matchesSearch && matchesBedrooms && matchesLocation) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Add event listeners
  if (searchInput) searchInput.addEventListener('input', filterProperties);
  if (bedroomsSelect) bedroomsSelect.addEventListener('change', filterProperties);
  if (locationSelect) locationSelect.addEventListener('change', filterProperties);
}

/**
 * Add skip link for accessibility
 */
function addSkipLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';

  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Add focus management for better keyboard navigation
 */
function addFocusManagement() {
  // Trap focus in mobile menu when open
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-navigation');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        // Focus first menu item
        const firstLink = mainNav.querySelector('.nav-link');
        if (firstLink) {
          setTimeout(() => firstLink.focus(), 100);
        }
      }
    });
  }

  // Close mobile menu on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const menuToggle = document.querySelector('.menu-toggle');
      if (menuToggle && menuToggle.getAttribute('aria-expanded') === 'true') {
        menuToggle.click();
        menuToggle.focus();
      }
    }
  });
}

/**
 * Set current page indicator in navigation
 */
function setCurrentPage() {
  const currentPath = window.location.pathname;

  // Remove trailing slash for comparison
  const normalizedPath = currentPath.replace(/\/$/, '') || '/';

  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');

    if (linkHref === normalizedPath) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
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
