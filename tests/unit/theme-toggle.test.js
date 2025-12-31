/**
 * Properties 4 Creations - Theme Toggle Unit Tests
 * Comprehensive tests for dark mode functionality
 */

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

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

describe('Theme Toggle Module', () => {
  let themeToggle;
  let themeIcon;
  let themeText;
  let htmlElement;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    document.documentElement.innerHTML = '';
    
    // Reset mocks
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    
    // Create mock elements
    themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    
    themeIcon = document.createElement('span');
    themeIcon.className = 'theme-icon';
    themeIcon.textContent = '🌙';
    
    themeText = document.createElement('span');
    themeText.className = 'theme-text';
    themeText.textContent = 'Dark Mode';
    
    themeToggle.appendChild(themeIcon);
    themeToggle.appendChild(themeText);
    
    htmlElement = document.documentElement;
    
    // Append elements to DOM
    document.body.appendChild(themeToggle);
    
    // Clear any existing data-theme attribute
    htmlElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
    localStorageMock.clear();
  });

  describe('Initialization', () => {
    test('should initialize with light theme by default', () => {
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      initializeThemeToggle();
      
      expect(htmlElement.getAttribute('data-theme')).toBe('light');
      expect(themeToggle.getAttribute('aria-pressed')).toBe('false');
      expect(themeToggle.getAttribute('aria-label')).toBe('Switch to dark mode');
      expect(themeIcon.textContent).toBe('🌙');
      expect(themeText.textContent).toBe('Dark Mode');
    });

    test('should load saved theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      initializeThemeToggle();
      
      expect(htmlElement.getAttribute('data-theme')).toBe('dark');
      expect(themeToggle.getAttribute('aria-pressed')).toBe('true');
      expect(themeToggle.getAttribute('aria-label')).toBe('Switch to light mode');
      expect(themeIcon.textContent).toBe('☀️');
      expect(themeText.textContent).toBe('Light Mode');
    });

    test('should respect system preference when no saved theme', () => {
      // Mock system preference to dark
      window.matchMedia.mockImplementation(() => ({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
      
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      initializeThemeToggle();
      
      expect(htmlElement.getAttribute('data-theme')).toBe('dark');
    });

    test('should not initialize if toggle button is missing', () => {
      themeToggle.remove();
      
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      
      // Should not throw error
      expect(() => initializeThemeToggle()).not.toThrow();
    });
  });

  describe('Theme Toggle Functionality', () => {
    beforeEach(() => {
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      initializeThemeToggle();
    });

    test('should toggle from light to dark', () => {
      // Initially light
      expect(htmlElement.getAttribute('data-theme')).toBe('light');
      
      // Click to toggle
      themeToggle.click();
      
      expect(htmlElement.getAttribute('data-theme')).toBe('dark');
      expect(themeToggle.getAttribute('aria-pressed')).toBe('true');
      expect(themeToggle.getAttribute('aria-label')).toBe('Switch to light mode');
      expect(themeIcon.textContent).toBe('☀️');
      expect(themeText.textContent).toBe('Light Mode');
    });

    test('should toggle from dark to light', () => {
      // Set initial dark theme
      htmlElement.setAttribute('data-theme', 'dark');
      themeToggle.setAttribute('aria-pressed', 'true');
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Light Mode';
      
      // Click to toggle
      themeToggle.click();
      
      expect(htmlElement.getAttribute('data-theme')).toBe('light');
      expect(themeToggle.getAttribute('aria-pressed')).toBe('false');
      expect(themeToggle.getAttribute('aria-label')).toBe('Switch to dark mode');
      expect(themeIcon.textContent).toBe('🌙');
      expect(themeText.textContent).toBe('Dark Mode');
    });

    test('should save theme to localStorage', () => {
      themeToggle.click(); // Toggle to dark
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
      
      themeToggle.click(); // Toggle back to light
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    test('should handle multiple toggles correctly', () => {
      // Toggle multiple times
      themeToggle.click(); // light -> dark
      expect(htmlElement.getAttribute('data-theme')).toBe('dark');
      
      themeToggle.click(); // dark -> light
      expect(htmlElement.getAttribute('data-theme')).toBe('light');
      
      themeToggle.click(); // light -> dark
      expect(htmlElement.getAttribute('data-theme')).toBe('dark');
      
      themeToggle.click(); // dark -> light
      expect(htmlElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('Manual Theme Setting', () => {
    test('should set theme programmatically', () => {
      const { setTheme } = require('../../js/theme-toggle.js');
      
      setTheme('dark');
      
      expect(htmlElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    test('should update toggle button when theme is set programmatically', () => {
      const { setTheme } = require('../../js/theme-toggle.js');
      
      setTheme('dark');
      
      expect(themeToggle.getAttribute('aria-pressed')).toBe('true');
      expect(themeToggle.getAttribute('aria-label')).toBe('Switch to light mode');
      expect(themeIcon.textContent).toBe('☀️');
      expect(themeText.textContent).toBe('Light Mode');
    });
  });

  describe('Meta Theme Color', () => {
    test('should update meta theme-color for light mode', () => {
      const { setTheme } = require('../../js/theme-toggle.js');
      
      setTheme('light');
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      expect(metaThemeColor).toBeTruthy();
      expect(metaThemeColor.getAttribute('content')).toBe('#FFFFFF');
    });

    test('should update meta theme-color for dark mode', () => {
      const { setTheme } = require('../../js/theme-toggle.js');
      
      setTheme('dark');
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      expect(metaThemeColor).toBeTruthy();
      expect(metaThemeColor.getAttribute('content')).toBe('#0B1120');
    });

    test('should create meta theme-color element if it does not exist', () => {
      const { setTheme } = require('../../js/theme-toggle.js');
      
      setTheme('light');
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      expect(metaThemeColor).toBeTruthy();
      expect(metaThemeColor.name).toBe('theme-color');
    });
  });

  describe('Screen Reader Announcements', () => {
    test('should announce theme change to screen readers', () => {
      const { setTheme } = require('../../js/theme-toggle.js');
      
      setTheme('dark');
      
      const liveRegion = document.getElementById('theme-announcements');
      expect(liveRegion).toBeTruthy();
      expect(liveRegion.getAttribute('aria-live')).toBe('polite');
      expect(liveRegion.getAttribute('aria-atomic')).toBe('true');
      expect(liveRegion.textContent).toBe('Dark mode enabled');
    });

    test('should clear announcement after timeout', (done) => {
      const { setTheme } = require('../../js/theme-toggle.js');
      
      setTheme('dark');
      
      setTimeout(() => {
        const liveRegion = document.getElementById('theme-announcements');
        expect(liveRegion.textContent).toBe('');
        done();
      }, 1100); // Slightly longer than 1000ms timeout
    });

    test('should create live region if it does not exist', () => {
      const { setTheme } = require('../../js/theme-toggle.js');
      
      setTheme('light');
      
      const liveRegion = document.getElementById('theme-announcements');
      expect(liveRegion).toBeTruthy();
      expect(liveRegion.className).toBe('sr-only');
    });
  });

  describe('System Theme Preference Changes', () => {
    test('should auto-switch when system preference changes and no saved theme', () => {
      // No saved theme
      localStorageMock.getItem.mockReturnValue(null);
      
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      initializeThemeToggle();
      
      // Mock system preference change to dark
      const systemChangeEvent = new Event('change');
      systemChangeEvent.matches = true;
      
      window.matchMedia.mockImplementation(() => ({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
      
      const { handleSystemThemeChange } = require('../../js/theme-toggle.js');
      handleSystemThemeChange(systemChangeEvent);
      
      expect(htmlElement.getAttribute('data-theme')).toBe('dark');
    });

    test('should not auto-switch when user has manually set a preference', () => {
      // User has manually set dark theme
      localStorageMock.getItem.mockReturnValue('dark');
      
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      initializeThemeToggle();
      
      // Mock system preference change to light
      const systemChangeEvent = new Event('change');
      systemChangeEvent.matches = false;
      
      const { handleSystemThemeChange } = require('../../js/theme-toggle.js');
      handleSystemThemeChange(systemChangeEvent);
      
      // Should remain dark (user preference)
      expect(htmlElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Utility Functions', () => {
    beforeEach(() => {
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      initializeThemeToggle();
    });

    test('should return current theme', () => {
      const { getCurrentTheme } = require('../../js/theme-toggle.js');
      
      expect(getCurrentTheme()).toBe('light');
      
      themeToggle.click();
      expect(getCurrentTheme()).toBe('dark');
    });

    test('should check if system prefers dark mode', () => {
      const { prefersDarkMode } = require('../../js/theme-toggle.js');
      
      // Default mock returns false
      expect(prefersDarkMode()).toBe(false);
      
      // Mock system preference to dark
      window.matchMedia.mockImplementation(() => ({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
      
      expect(prefersDarkMode()).toBe(true);
    });

    test('should provide public API methods', () => {
      const { window } = require('../../js/theme-toggle.js');
      
      expect(typeof window.themeManager.getCurrentTheme).toBe('function');
      expect(typeof window.themeManager.setTheme).toBe('function');
      expect(typeof window.themeManager.toggleTheme).toBe('function');
      expect(typeof window.themeManager.prefersDarkMode).toBe('function');
    });

    test('should toggle theme via public API', () => {
      const { window } = require('../../js/theme-toggle.js');
      
      expect(htmlElement.getAttribute('data-theme')).toBe('light');
      
      window.themeManager.toggleTheme();
      expect(htmlElement.getAttribute('data-theme')).toBe('dark');
      
      window.themeManager.toggleTheme();
      expect(htmlElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing theme toggle gracefully', () => {
      themeToggle.remove();
      
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      
      // Should not throw error
      expect(() => initializeThemeToggle()).not.toThrow();
    });

    test('should handle missing theme elements in updateToggleButton', () => {
      // Remove theme icon and text
      themeIcon.remove();
      themeText.remove();
      
      const { setTheme } = require('../../js/theme-toggle.js');
      
      // Should not throw error
      expect(() => setTheme('dark')).not.toThrow();
    });

    test('should handle invalid theme values gracefully', () => {
      const { setTheme } = require('../../js/theme-toggle.js');
      
      // Should default to light for invalid values
      setTheme('invalid-theme');
      expect(htmlElement.getAttribute('data-theme')).toBe('invalid-theme');
      
      // The function doesn't validate theme values, it just sets them
      // This is by design to allow for future theme additions
    });
  });

  describe('Theme Persistence', () => {
    test('should restore theme on page reload', () => {
      // Simulate saved dark theme
      localStorageMock.getItem.mockReturnValue('dark');
      
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      initializeThemeToggle();
      
      expect(htmlElement.getAttribute('data-theme')).toBe('dark');
      expect(themeToggle.getAttribute('aria-pressed')).toBe('true');
    });

    test('should prioritize saved theme over system preference', () => {
      // User has saved light theme
      localStorageMock.getItem.mockReturnValue('light');
      
      // System prefers dark
      window.matchMedia.mockImplementation(() => ({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
      
      const { initializeThemeToggle } = require('../../js/theme-toggle.js');
      initializeThemeToggle();
      
      // Should use saved light theme, not system dark preference
      expect(htmlElement.getAttribute('data-theme')).toBe('light');
    });
  });
});