/**
 * Properties 4 Creations - Accessibility Module
 * Handles accessibility features and focus management
 *
 * @fileoverview Provides accessibility enhancements and focus management
 * @author Properties 4 Creations
 */

/**
 * Add focus management for better keyboard navigation
 */
export function initFocusManagement() {
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
export function setCurrentPage() {
  const currentPath = window.location.pathname;

  // Remove trailing slash for comparison
  const normalizedPath = currentPath.replace(/\/$/, '') || '/';

  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');

    if (linkHref === normalizedPath) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });
}

/**
 * Normalize path for comparison
 * @param {string} path - The path to normalize
 * @returns {string} Normalized path
 */
export function normalizePath(path) {
  return path.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
}

/**
 * Announce message to screen readers
 * @param {string} message - The message to announce
 */
export function announceToScreenReader(message) {
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