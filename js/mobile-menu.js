// Properties 4 Creations - Mobile Menu
// Handles mobile navigation menu functionality

document.addEventListener('DOMContentLoaded', () => {
  initializeMobileMenu();
});

/**
 * Initialize mobile menu functionality
 */
function initializeMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-navigation');

  if (!menuToggle || !mainNav) {
    console.warn('Mobile menu elements not found');
    return;
  }

  // Set initial ARIA attributes
  menuToggle.setAttribute('aria-expanded', 'false');
  // Only set aria-hidden on mobile
  if (window.innerWidth < 768) {
    mainNav.setAttribute('aria-hidden', 'true');
  }

  // Add click event listener
  menuToggle.addEventListener('click', handleMenuToggle);

  // Handle keyboard navigation
  document.addEventListener('keydown', handleKeydown);

  // Close menu when clicking outside
  document.addEventListener('click', handleOutsideClick);

  // Close menu on window resize (if switching to desktop)
  window.addEventListener('resize', debounce(handleResize, 250));
}

/**
 * Handle menu toggle button click
 */
function handleMenuToggle() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-navigation');

  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

  if (isExpanded) {
    closeMenu();
  } else {
    openMenu();
  }
}

/**
 * Open the mobile menu
 */
function openMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-navigation');
  const body = document.body;

  // Update ARIA attributes
  menuToggle.setAttribute('aria-expanded', 'true');
  if (window.innerWidth < 768) {
    mainNav.setAttribute('aria-hidden', 'false');
  }

  // Prevent body scroll
  body.style.overflow = 'hidden';

  // Focus management - focus first menu item after animation
  setTimeout(() => {
    const firstLink = mainNav.querySelector('.nav-link');
    if (firstLink) {
      firstLink.focus();
    }
  }, 300); // Match CSS transition duration
}

/**
 * Close the mobile menu
 */
function closeMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-navigation');
  const body = document.body;

  // Update ARIA attributes
  menuToggle.setAttribute('aria-expanded', 'false');
  if (window.innerWidth < 768) {
    mainNav.setAttribute('aria-hidden', 'true');
  }

  // Restore body scroll
  body.style.overflow = '';

  // Return focus to menu toggle
  menuToggle.focus();
}

/**
 * Handle keyboard navigation
 */
function handleKeydown(event) {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-navigation');

  // Close menu on Escape key
  if (event.key === 'Escape') {
    const isOpen = menuToggle && menuToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
      event.preventDefault();
    }
  }

  // Handle Tab navigation within menu
  if (event.key === 'Tab') {
    const isOpen = menuToggle && menuToggle.getAttribute('aria-expanded') === 'true';

    if (isOpen && mainNav) {
      const focusableElements = mainNav.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // If Tab on last element, close menu and focus toggle
      if (event.target === lastElement && !event.shiftKey) {
        closeMenu();
        event.preventDefault();
      }

      // If Shift+Tab on first element, close menu and focus toggle
      if (event.target === firstElement && event.shiftKey) {
        closeMenu();
        event.preventDefault();
      }
    }
  }
}

/**
 * Handle clicks outside the menu
 */
function handleOutsideClick(event) {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-navigation');

  const isOpen = menuToggle && menuToggle.getAttribute('aria-expanded') === 'true';

  if (isOpen) {
    // Check if click is outside menu and toggle
    const isClickInsideMenu = mainNav && mainNav.contains(event.target);
    const isClickOnToggle = menuToggle && menuToggle.contains(event.target);

    if (!isClickInsideMenu && !isClickOnToggle) {
      closeMenu();
    }
  }
}

/**
 * Handle window resize
 */
function handleResize() {
  const menuToggle = document.querySelector('.menu-toggle');

  // If window is resized to desktop size and menu is open, close it
  if (window.innerWidth >= 768) {
    const isOpen = menuToggle && menuToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    }
  }
}

/**
 * Utility function to get current menu state
 */
function isMenuOpen() {
  const menuToggle = document.querySelector('.menu-toggle');
  return menuToggle && menuToggle.getAttribute('aria-expanded') === 'true';
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

// Export functions for testing and potential use by other scripts
export { initializeMobileMenu, openMenu, closeMenu, isMenuOpen };

// Also attach to window for backwards compatibility
window.mobileMenu = {
  open: openMenu,
  close: closeMenu,
  isOpen: isMenuOpen
};
