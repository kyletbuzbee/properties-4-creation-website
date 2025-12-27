/**
 * Properties 4 Creations - Main JavaScript
 * Main entry point with form validation and common functionality
 *
 * @fileoverview Initializes all JavaScript components and functionality
 * @author Properties 4 Creations
 */

document.addEventListener('DOMContentLoaded', () => {
  try {
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
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
  } catch (error) {
    console.error('Error initializing main JavaScript:', error);
    // Fallback to basic functionality
    initializeBasicFunctionality();
  }
});

/**
 * Initialize basic functionality as fallback when main initialization fails
 * @private
 */
function initializeBasicFunctionality() {
  console.warn('Initializing basic functionality due to initialization error');
  
  // Basic form validation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    if (form.id === 'application-form') {
      form.addEventListener('submit', handleApplicationSubmit);
    } else if (form.id === 'contact-form') {
      form.addEventListener('submit', handleContactSubmit);
    }
  });
}

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
 * Initialize performance monitoring for Core Web Vitals
 */
function initializePerformanceMonitoring() {
  // Check if PerformanceObserver is supported
  if ('PerformanceObserver' in window) {
    const metrics = {
      lcp: 0,
      cls: 0,
      fid: 0,
      navigationTiming: {}
    };

    // Track navigation timing
    if (window.performance && window.performance.timing) {
      metrics.navigationTiming = {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
      };
    }

    // Largest Contentful Paint
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.startTime;
        console.log('LCP:', metrics.lcp, 'ms');
        
        // Send to analytics if available
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'performance_metrics',
            metricType: 'LCP',
            value: metrics.lcp
          });
        }
      }).observe({type: 'largest-contentful-paint', buffered: true});
    } catch (e) {
      console.warn('LCP monitoring failed:', e);
    }

    // Cumulative Layout Shift
    try {
      let cls = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        }
        metrics.cls = cls;
        console.log('CLS:', metrics.cls);
        
        // Send to analytics if available
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'performance_metrics',
            metricType: 'CLS',
            value: metrics.cls
          });
        }
      }).observe({type: 'layout-shift', buffered: true});
    } catch (e) {
      console.warn('CLS monitoring failed:', e);
    }

    // First Input Delay
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          metrics.fid = entry.processingStart - entry.startTime;
          console.log('FID:', metrics.fid, 'ms');
          
          // Send to analytics if available
          if (window.dataLayer) {
            window.dataLayer.push({
              event: 'performance_metrics',
              metricType: 'FID',
              value: metrics.fid
            });
          }
        }
      }).observe({type: 'first-input', buffered: true});
    } catch (e) {
      console.warn('FID monitoring failed:', e);
    }

    // Log metrics to console for debugging
    console.log('Performance Monitoring Initialized');
    console.log('Navigation Timing:', metrics.navigationTiming);
    
    // Expose metrics globally for debugging
    window.performanceMetrics = metrics;
  } else {
    console.log('PerformanceObserver not supported, performance monitoring disabled');
  }
}

/**
 * Initialize form validation and submission
 */
function initializeForms() {
  // Set minimum date for move-in date field
  setMinimumMoveInDate();

  const forms = [
    document.getElementById('application-form'),
    document.getElementById('contact-form')
  ];

  forms.forEach(form => {
    if (form) {
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true; // Disable on page load
      }
      
      if (form.id === 'application-form') {
        form.addEventListener('submit', handleApplicationSubmit);
      } else if (form.id === 'contact-form') {
        form.addEventListener('submit', handleContactSubmit);
      }
      
      addFormValidation(form);
    }
  });
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
 * Validate the entire form by checking each field.
 * @param {HTMLFormElement} form - The form element to validate
 * @param {boolean} [showErrors=true] - Whether to display error messages for invalid fields
 * @returns {boolean} True if the form is valid, false otherwise
 * @throws {Error} If form parameter is not a valid HTMLFormElement
 */
function validateForm(form, showErrors = true) {
  if (!form || !(form instanceof HTMLFormElement)) {
    console.error('validateForm: Invalid form parameter');
    return false;
  }

  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isFormValid = true;
  
  try {
    for (const input of inputs) {
      if (!validateField(input, showErrors)) {
        isFormValid = false;
      }
    }
  } catch (error) {
    console.error('Error validating form:', error);
    return false;
  }
  
  return isFormValid;
}

/**
 * Handle application form submission
 */
async function handleApplicationSubmit(e) {
  e.preventDefault();
  const form = e.target;

  if (!validateForm(form)) {
    showError(form, 'Please correct the errors before submitting.');
    return;
  }

  const formData = new FormData(form);
  const formspreeUrl = form.action;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : 'Submit Application';

  if (submitButton) {
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('btn-loading');
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';
  }

  try {
    // Input sanitization
    const sanitizedData = new FormData();
    for (const [key, value] of formData.entries()) {
      sanitizedData.append(key, sanitizeInput(value));
    }

    const response = await fetch(formspreeUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: sanitizedData
    });

    if (response.ok) {
      showSuccess(form, 'Application Submitted Successfully! Thank you! We will contact you within 24 hours.');
      form.reset();
      // After resetting, re-disable the submit button
      if (submitButton) {
        submitButton.disabled = true;
      }
    } else {
      let errorMessage = 'There was an issue submitting your application. Please try again.';
      try {
        const errorData = await response.json();
        if (errorData && errorData.errors) {
          errorMessage = `Submission failed: ${errorData.errors.map(err => err.message).join(', ')}`;
        } else if (errorData && errorData.error) {
          errorMessage = `Submission failed: ${errorData.error}`;
        }
      } catch (jsonError) {
        console.warn('Could not parse error response as JSON:', jsonError);
      }
      showError(form, errorMessage);
    }
  } catch (error) {
    console.error('Network error submitting application:', error);
    showError(form, 'Network error. Please check your internet connection and try again.');
  } finally {
    if (submitButton) {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      submitButton.classList.remove('btn-loading');
      submitButton.innerHTML = originalButtonText;
    }
  }
}

/**
 * Handle contact form submission
 */
async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;

  if (!validateForm(form)) {
    showError(form, 'Please correct the errors before submitting.');
    return;
  }

  const formData = new FormData(form);
  const formspreeUrl = form.action;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : 'Send Message';

  if (submitButton) {
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('btn-loading');
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';
  }

  try {
    // Input sanitization
    const sanitizedData = new FormData();
    for (const [key, value] of formData.entries()) {
      sanitizedData.append(key, sanitizeInput(value));
    }

    const response = await fetch(formspreeUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: sanitizedData
    });

    if (response.ok) {
      showSuccess(form, 'Message Sent Successfully! Thank you! We will respond within 24 hours.');
      form.reset();
      // After resetting, re-disable the submit button
      if (submitButton) {
        submitButton.disabled = true;
      }
    } else {
      let errorMessage = 'There was an issue sending your message. Please try again.';
      try {
        const errorData = await response.json();
        if (errorData && errorData.errors) {
          errorMessage = `Submission failed: ${errorData.errors.map(err => err.message).join(', ')}`;
        } else if (errorData && errorData.error) {
          errorMessage = `Submission failed: ${errorData.error}`;
        }
      } catch (jsonError) {
        console.warn('Could not parse error response as JSON:', jsonError);
      }
      showError(form, errorMessage);
    }
  } catch (error) {
    console.error('Network error submitting contact form:', error);
    showError(form, 'Network error. Please check your internet connection and try again.');
  } finally {
    if (submitButton) {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      submitButton.classList.remove('btn-loading');
      submitButton.innerHTML = originalButtonText;
    }
  }
}

/**
 * Add real-time form validation and manage submit button state
 */
function addFormValidation(form) {
  const inputs = form.querySelectorAll('input, select, textarea');
  const submitButton = form.querySelector('button[type="submit"]');

  inputs.forEach(input => {
    // Real-time validation on blur to show errors
    input.addEventListener('blur', () => {
      validateField(input);
    });

    // On input, clear the specific field's error and check form validity to update button state
    input.addEventListener('input', () => {
      clearFieldError(input);
      if (submitButton) {
        // Check all fields to see if the form is now valid
        const isFormValid = validateForm(form, false); // Pass false to prevent showing new errors on every keystroke
        submitButton.disabled = !isFormValid;
      }
    });
  });
}

/**
 * Validate a single field
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field The field to validate.
 * @param {boolean} showErrorMsg Whether to display the error message.
 * @returns {boolean} True if the field is valid, false otherwise.
 */
export function validateField(field, showErrorMsg = true) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  // Required field validation
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  }

  // Min length validation (only if value is not empty)
  if (isValid && field.hasAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'), 10)) {
    isValid = false;
    errorMessage = `Minimum ${field.getAttribute('minlength')} characters required`;
  }

  // Email validation (only if value is not empty)
  if (isValid && field.type === 'email' && value && !isValidEmail(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid email address';
  }

  // Phone validation (only if value is not empty)
  if (isValid && field.type === 'tel' && value && !isValidPhone(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid phone number';
  }

  // Checkbox validation
  if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
    isValid = false;
    errorMessage = 'You must agree to this';
  }

  if (!isValid && showErrorMsg) {
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
 * Show success message within the context of a form
 */
function showSuccess(form, message) {
  const successMessageDiv = form.parentNode.querySelector('.success-message');

  if (successMessageDiv) {
    // Clear any previous general error message for this form
    const existingErrorDiv = form.parentNode.querySelector('.form-general-error');
    if (existingErrorDiv) {
      existingErrorDiv.remove();
    }

    successMessageDiv.innerHTML = `<h3>${message}</h3>`;
    successMessageDiv.style.display = 'block';
    successMessageDiv.setAttribute('aria-hidden', 'false');

    // Hide after 5 seconds
    setTimeout(() => {
      successMessageDiv.style.display = 'none';
      successMessageDiv.setAttribute('aria-hidden', 'true');
      successMessageDiv.innerHTML = '';
    }, 5000);
  } else {
    // Fallback if no specific div is found (current implementation)
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.setAttribute('role', 'alert');
    successDiv.setAttribute('aria-live', 'polite');
    form.parentNode.insertBefore(successDiv, form.nextSibling);

    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.remove();
      }
    }, 5000);
  }
}

/**
 * Show error message before a specific form
 */
function showError(form, message) {
  // Clear any existing general error message for this form
  const existingErrorDiv = form.parentNode.querySelector('.form-general-error');
  if (existingErrorDiv) {
    existingErrorDiv.remove();
  }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message form-general-error'; // Add a specific class to identify it
  errorDiv.textContent = message;
  errorDiv.setAttribute('role', 'alert');
  errorDiv.setAttribute('aria-live', 'assertive');

  // Style the error message (keep existing inline style for now)
  errorDiv.style.cssText = `
    background: var(--color-semantic-error);
    color: var(--color-neutral-white);
    padding: var(--spacing-4);
    border-radius: 0.5rem;
    margin: var(--spacing-4) 0;
    text-align: center;
  `;

  form.parentNode.insertBefore(errorDiv, form); // Insert before the form

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
/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} Sanitized input string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Utility function to debounce function calls
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} Debounced function
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
