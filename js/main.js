/**
 * Properties 4 Creations - Main JavaScript
 *
 * This file contains the core JavaScript functionality for the website including:
 * - Feature detection
 * - Theme toggle
 * - Mobile menu
 * - Form validation
 * - Notification system
 * - Lazy loading
 * - Accessibility enhancements
 */

/**
 * Feature Detection Section
 * Detects browser support for modern APIs to provide progressive enhancement
 */
const supportsIntersectionObserver = 'IntersectionObserver' in window;

/**
 * Detects if browser supports passive event listeners for better scroll performance
 * @returns {boolean} True if passive events are supported
 */
const supportsPassiveEvents = (() => {
  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
      }
    });
    window.addEventListener("testPassive", null, opts);
    window.removeEventListener("testPassive", null, opts);
  } catch (e) {}
  return supportsPassive;
})();

/**
 * Theme Toggle Section
 * Implements dark/light mode toggle with localStorage persistence
 * Respects system color scheme preferences
 */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  body.classList.add('dark-mode');
  themeToggle.innerHTML = '☀️';
}

// Toggle theme
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  themeToggle.innerHTML = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/**
 * Mobile Menu Section
 * Implements accessible mobile navigation with keyboard support
 * Includes focus trapping and proper ARIA attributes
 */
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-navigation');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    mainNav.setAttribute('aria-hidden', isExpanded);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  });
  
  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      menuToggle.setAttribute('aria-expanded', 'false');
      mainNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      menuToggle.focus();
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.setAttribute('aria-expanded', 'false');
      mainNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Active Page Highlighting
 * Highlights the current page in navigation for better user orientation
 */
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  if (link.getAttribute('href') === currentPath ||
      (currentPath === '/' && link.getAttribute('href') === '/')) {
    link.setAttribute('aria-current', 'page');
  }
});

/**
 * Sticky Header
 * Makes header sticky when scrolling down the page
 * Uses throttling for better performance
 */
const handleScroll = () => {
  const header = document.querySelector('.header-glass');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

// Throttle the scroll event for better performance
let isThrottled = false;
window.addEventListener('scroll', () => {
  if (!isThrottled) {
    handleScroll();
    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
    }, 100);
  }
});

/**
 * Smooth Scroll
 * Implements smooth scrolling for anchor links for better UX
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

/**
 * Notification System
 * Displays user-friendly notifications for form submissions and other user actions
 */

/**
 * Shows a notification message to the user
 * @param {string} message - The message to display
 * @param {'success'|'error'|'info'|'warning'} [type='success'] - Type of notification
 */
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'assertive');
  
  // Add notification container if it doesn't exist
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }
  
  container.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
      
      // Remove container if empty
      if (container && container.children.length === 0) {
        container.remove();
      }
    }, 300);
  }, 5000);
}

/**
 * Form Validation Section
 * Handles client-side form validation with real-time feedback
 */
const forms = document.querySelectorAll('form');

forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
      const errorMessage = input.nextElementSibling;
      
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = 'var(--color-semantic-error)';
        if (errorMessage && errorMessage.classList.contains('error-message')) {
          errorMessage.textContent = 'This field is required';
        }
      } else if (input.type === 'email' && !validateEmail(input.value)) {
        isValid = false;
        input.style.borderColor = 'var(--color-semantic-error)';
        if (errorMessage && errorMessage.classList.contains('error-message')) {
          errorMessage.textContent = 'Please enter a valid email address';
        }
      } else {
        input.style.borderColor = '';
        if (errorMessage && errorMessage.classList.contains('error-message')) {
          errorMessage.textContent = '';
        }
      }
    });
    
    if (isValid) {
      // Form is valid, simulate submission
      try {
        // In a real implementation, this would be an actual fetch call
        // For demo purposes, we'll simulate a successful submission
        showNotification('Form submitted successfully!', 'success');
        form.reset();
        
        // Scroll to top to see notification
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
      } catch (error) {
        console.error('Form submission error:', error);
        showNotification(`Error: ${error.message}`, 'error');
      }
    } else {
      showNotification('Please fill in all required fields.', 'error');
    }
  });
});

/**
 * Validates an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email is valid
 */
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Lazy Loading Section
 * Implements lazy loading for images to improve page performance
 * Uses IntersectionObserver API with fallback for older browsers
 */
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

if (supportsIntersectionObserver) {
  const lazyImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src || lazyImage.src;
        lazyImage.classList.remove('lazy');
        lazyImageObserver.unobserve(lazyImage);
      }
    });
  }, {
    rootMargin: '200px',
    threshold: 0.01
  });
  
  lazyImages.forEach(lazyImage => {
    lazyImageObserver.observe(lazyImage);
  });
} else {
  // Fallback for browsers without IntersectionObserver
  lazyImages.forEach(lazyImage => {
    lazyImage.src = lazyImage.dataset.src || lazyImage.src;
  });
}