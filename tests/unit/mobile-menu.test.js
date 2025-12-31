/**
 * Properties 4 Creations - Mobile Menu Unit Tests
 * Comprehensive tests for mobile navigation menu functionality
 */

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock debounce function for testing
jest.mock('lodash.debounce', () => jest.fn(fn => fn));

describe('Mobile Menu Module', () => {
  let menuToggle;
  let mainNav;
  let body;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Create mock elements
    menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.setAttribute('aria-label', 'Toggle navigation');
    
    mainNav = document.createElement('nav');
    mainNav.className = 'main-navigation';
    
    body = document.body;
    
    // Append elements to DOM
    document.body.appendChild(menuToggle);
    document.body.appendChild(mainNav);
    
    // Clear any existing event listeners
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
  });

  describe('Initialization', () => {
    test('should set initial ARIA attributes correctly', () => {
      // Import and call initialization function
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      initializeMobileMenu();
      
      expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
      expect(mainNav.getAttribute('aria-hidden')).toBe('true');
    });

    test('should not initialize if elements are missing', () => {
      // Remove elements
      menuToggle.remove();
      mainNav.remove();
      
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      
      // Should not throw error
      expect(() => initializeMobileMenu()).not.toThrow();
    });

    test('should add click event listener to menu toggle', () => {
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      initializeMobileMenu();
      
      // Simulate click
      menuToggle.click();
      
      // Check if aria-expanded changed (indicating toggle worked)
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('Menu Toggle Functionality', () => {
    beforeEach(() => {
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      initializeMobileMenu();
    });

    test('should open menu when closed', () => {
      // Initially closed
      expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
      
      // Click to open
      menuToggle.click();
      
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
      expect(mainNav.getAttribute('aria-hidden')).toBe('false');
      expect(body.style.overflow).toBe('hidden');
    });

    test('should close menu when open', () => {
      // Open the menu first
      menuToggle.click();
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
      
      // Click to close
      menuToggle.click();
      
      expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
      expect(mainNav.getAttribute('aria-hidden')).toBe('true');
      expect(body.style.overflow).toBe('');
    });

    test('should handle multiple toggle clicks correctly', () => {
      // Toggle multiple times
      menuToggle.click(); // Open
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
      
      menuToggle.click(); // Close
      expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
      
      menuToggle.click(); // Open again
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      initializeMobileMenu();
    });

    test('should close menu on Escape key', () => {
      // Open menu first
      menuToggle.click();
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
      
      // Simulate Escape key
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
      
      expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
      expect(mainNav.getAttribute('aria-hidden')).toBe('true');
    });

    test('should handle Tab navigation within menu', () => {
      // Open menu
      menuToggle.click();
      
      // Add focusable elements to nav
      const link1 = document.createElement('a');
      link1.href = '#';
      link1.textContent = 'Link 1';
      const link2 = document.createElement('a');
      link2.href = '#';
      link2.textContent = 'Link 2';
      
      mainNav.appendChild(link1);
      mainNav.appendChild(link2);
      
      // Focus first link
      link1.focus();
      
      // Simulate Tab key
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      document.dispatchEvent(tabEvent);
      
      // Should not close menu on normal Tab
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
    });

    test('should close menu on Tab from last element', () => {
      // Open menu
      menuToggle.click();
      
      // Add focusable elements to nav
      const link1 = document.createElement('a');
      link1.href = '#';
      link1.textContent = 'Link 1';
      const link2 = document.createElement('a');
      link2.href = '#';
      link2.textContent = 'Link 2';
      
      mainNav.appendChild(link1);
      mainNav.appendChild(link2);
      
      // Focus last link
      link2.focus();
      
      // Simulate Tab key
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      document.dispatchEvent(tabEvent);
      
      // Should close menu
      expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    });

    test('should close menu on Shift+Tab from first element', () => {
      // Open menu
      menuToggle.click();
      
      // Add focusable elements to nav
      const link1 = document.createElement('a');
      link1.href = '#';
      link1.textContent = 'Link 1';
      const link2 = document.createElement('a');
      link2.href = '#';
      link2.textContent = 'Link 2';
      
      mainNav.appendChild(link1);
      mainNav.appendChild(link2);
      
      // Focus first link
      link1.focus();
      
      // Simulate Shift+Tab key
      const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
      document.dispatchEvent(shiftTabEvent);
      
      // Should close menu
      expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Outside Click Handling', () => {
    beforeEach(() => {
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      initializeMobileMenu();
    });

    test('should close menu when clicking outside', () => {
      // Open menu
      menuToggle.click();
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
      
      // Simulate click outside menu
      const outsideClick = new MouseEvent('click', { bubbles: true });
      document.body.dispatchEvent(outsideClick);
      
      expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    });

    test('should not close menu when clicking inside menu', () => {
      // Open menu
      menuToggle.click();
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
      
      // Add content to menu
      const menuContent = document.createElement('div');
      menuContent.className = 'menu-content';
      mainNav.appendChild(menuContent);
      
      // Simulate click inside menu
      const insideClick = new MouseEvent('click', { bubbles: true });
      menuContent.dispatchEvent(insideClick);
      
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
    });

    test('should not close menu when clicking toggle button', () => {
      // Open menu
      menuToggle.click();
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
      
      // Simulate click on toggle
      const toggleClick = new MouseEvent('click', { bubbles: true });
      menuToggle.dispatchEvent(toggleClick);
      
      // Should toggle, not just close
      expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Window Resize Handling', () => {
    beforeEach(() => {
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      initializeMobileMenu();
    });

    test('should close menu on resize to desktop', () => {
      // Mock window.innerWidth to be mobile size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 767,
      });
      
      // Open menu
      menuToggle.click();
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
      
      // Mock resize to desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      // Simulate resize event
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    });

    test('should not close menu on resize to mobile', () => {
      // Mock window.innerWidth to be desktop size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      // Open menu (should work on desktop too)
      menuToggle.click();
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
      
      // Mock resize to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 767,
      });
      
      // Simulate resize event
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      // Should remain open
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('Utility Functions', () => {
    beforeEach(() => {
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      initializeMobileMenu();
    });

    test('should return correct menu state', () => {
      const { isMenuOpen } = require('../../js/mobile-menu.js');
      
      expect(isMenuOpen()).toBe(false);
      
      menuToggle.click();
      expect(isMenuOpen()).toBe(true);
    });

    test('should provide public API methods', () => {
      const { window } = require('../../js/mobile-menu.js');
      
      expect(typeof window.mobileMenu.open).toBe('function');
      expect(typeof window.mobileMenu.close).toBe('function');
      expect(typeof window.mobileMenu.isOpen).toBe('function');
    });

    test('should handle open and close via public API', () => {
      const { window } = require('../../js/mobile-menu.js');
      
      // Initially closed
      expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
      
      // Open via API
      window.mobileMenu.open();
      expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
      
      // Close via API
      window.mobileMenu.close();
      expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Focus Management', () => {
    beforeEach(() => {
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      initializeMobileMenu();
      
      // Add focusable elements
      const link = document.createElement('a');
      link.href = '#';
      link.className = 'nav-link';
      link.textContent = 'Home';
      mainNav.appendChild(link);
    });

    test('should focus first link after opening menu', (done) => {
      menuToggle.click();
      
      setTimeout(() => {
        expect(document.activeElement).toBe(mainNav.querySelector('.nav-link'));
        done();
      }, 350); // Slightly longer than the 300ms timeout in the code
    });

    test('should return focus to toggle after closing menu', () => {
      // Open menu and focus first link
      menuToggle.click();
      
      setTimeout(() => {
        const firstLink = mainNav.querySelector('.nav-link');
        firstLink.focus();
        expect(document.activeElement).toBe(firstLink);
        
        // Close menu
        menuToggle.click();
        
        // Focus should return to toggle
        expect(document.activeElement).toBe(menuToggle);
      }, 350);
    });
  });

  describe('Body Scroll Prevention', () => {
    beforeEach(() => {
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      initializeMobileMenu();
    });

    test('should prevent body scroll when menu is open', () => {
      // Open menu
      menuToggle.click();
      expect(body.style.overflow).toBe('hidden');
      
      // Close menu
      menuToggle.click();
      expect(body.style.overflow).toBe('');
    });

    test('should handle multiple open/close cycles', () => {
      // Open and close multiple times
      menuToggle.click(); // Open
      expect(body.style.overflow).toBe('hidden');
      
      menuToggle.click(); // Close
      expect(body.style.overflow).toBe('');
      
      menuToggle.click(); // Open again
      expect(body.style.overflow).toBe('hidden');
      
      menuToggle.click(); // Close again
      expect(body.style.overflow).toBe('');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing elements gracefully', () => {
      // Remove elements after initialization
      menuToggle.remove();
      mainNav.remove();
      
      // Should not throw errors
      expect(() => {
        const { initializeMobileMenu } = require('../../js/mobile-menu.js');
        initializeMobileMenu();
      }).not.toThrow();
    });

    test('should handle keyboard events when menu is closed', () => {
      const { initializeMobileMenu } = require('../../js/mobile-menu.js');
      initializeMobileMenu();
      
      // Menu is closed by default
      expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
      
      // Simulate Escape key when menu is closed
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
      
      // Should not cause errors
      expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    });
  });
});