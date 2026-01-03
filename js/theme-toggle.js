// Properties 4 Creations - Theme Toggle
// Handles dark mode functionality

document.addEventListener('DOMContentLoaded', () => {
  initializeThemeToggle();
});

/**
 * Initialize theme toggle functionality
 */
function initializeThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');

  if (!themeToggle) {
    console.warn('Theme toggle button not found');
    return;
  }

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  // Set initial theme
  setTheme(defaultTheme);

  // Update toggle button appearance
  updateToggleButton(defaultTheme);

  // Add click event listener
  themeToggle.addEventListener('click', handleThemeToggle);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange);
}

/**
 * Handle theme toggle button click
 */
function handleThemeToggle() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  setTheme(newTheme);
}

/**
 * Set the theme
 */
function setTheme(theme) {
  // Update data attribute on html element
  document.documentElement.setAttribute('data-theme', theme);

  // Save to localStorage
  localStorage.setItem('theme', theme);

  // Update toggle button appearance
  updateToggleButton(theme);

  // Update meta theme-color for mobile browsers
  updateMetaThemeColor(theme);

  // Announce theme change to screen readers
  announceThemeChange(theme);
}

/**
 * Update the toggle button appearance and accessibility attributes
 */
function updateToggleButton(theme) {
  const themeToggle = document.getElementById('theme-toggle');

  if (!themeToggle) return;

  const themeIcon = themeToggle.querySelector('.theme-icon');
  const themeText = themeToggle.querySelector('.theme-text');

  if (theme === 'dark') {
    // Dark mode is active
    themeToggle.setAttribute('aria-pressed', 'true');
    themeToggle.setAttribute('aria-label', 'Switch to light mode');

    if (themeIcon) themeIcon.textContent = '☀️';
    if (themeText) themeText.textContent = 'Light Mode';
  } else {
    // Light mode is active
    themeToggle.setAttribute('aria-pressed', 'false');
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');

    if (themeIcon) themeIcon.textContent = '🌙';
    if (themeText) themeText.textContent = 'Dark Mode';
  }
}

/**
 * Update meta theme-color for mobile browsers
 */
function updateMetaThemeColor(theme) {
  let metaThemeColor = document.querySelector('meta[name="theme-color"]');

  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    document.head.appendChild(metaThemeColor);
  }

  // Set theme color based on current theme
  const color = theme === 'dark' ? '#0B1120' : '#FFFFFF';
  metaThemeColor.setAttribute('content', color);
}

/**
 * Announce theme change to screen readers
 */
function announceThemeChange(theme) {
  const announcement = theme === 'dark'
    ? 'Dark mode enabled'
    : 'Light mode enabled';

  // Create or update live region for screen reader announcements
  let liveRegion = document.getElementById('theme-announcements');

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'theme-announcements';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }

  liveRegion.textContent = announcement;

  // Clear the announcement after a short delay
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 1000);
}

/**
 * Handle system theme preference changes
 */
function handleSystemThemeChange(event) {
  // Only auto-switch if user hasn't manually set a preference
  const savedTheme = localStorage.getItem('theme');

  if (!savedTheme) {
    const newTheme = event.matches ? 'dark' : 'light';
    setTheme(newTheme);
  }
}

/**
 * Get current theme
 */
function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

/**
 * Check if dark mode is preferred
 */
function prefersDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Toggle theme programmatically
 */
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

// Export functions for testing and potential use by other scripts
export { initializeThemeToggle, setTheme, toggleTheme, getCurrentTheme, prefersDarkMode };

// Also attach to window for backwards compatibility
window.themeManager = {
  getCurrentTheme,
  setTheme,
  toggleTheme,
  prefersDarkMode
};
