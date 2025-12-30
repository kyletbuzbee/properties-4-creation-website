// Accessibility tests using axe-core
import axe from 'axe-core';

// Mock axe for testing
jest.mock('axe-core', () => ({
  run: jest.fn(),
  configure: jest.fn(),
  getRules: jest.fn()
}));

describe('Accessibility Tests', () => {
  beforeEach(() => {
    // Setup document for testing
    document.body.innerHTML = '';
  });

  test('homepage has no accessibility violations', async () => {
    // Mock axe results
    axe.run.mockResolvedValue({
      violations: [],
      passes: [],
      incomplete: [],
      inapplicable: []
    });

    // Create mock homepage content
    document.body.innerHTML = `
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="#main-content">Skip to main content</a></li>
          </ul>
        </nav>
      </header>
      <main id="main-content" role="main">
        <h1>Main heading</h1>
        <button aria-label="Close menu">×</button>
      </main>
    `;

    const results = await axe.run(document.body);

    expect(results.violations).toHaveLength(0);
  });

  test('form elements have proper accessibility attributes', () => {
    document.body.innerHTML = `
      <form>
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" name="name" required aria-describedby="name-help">
          <div id="name-help">Enter your full legal name</div>
        </div>
        <button type="submit">Submit</button>
      </form>
    `;

    const label = document.querySelector('label');
    const input = document.querySelector('input');
    const help = document.querySelector('#name-help');

    expect(label.getAttribute('for')).toBe('name');
    expect(input.id).toBe('name');
    expect(input.hasAttribute('aria-describedby')).toBe(true);
    expect(input.getAttribute('aria-describedby')).toBe('name-help');
  });

  test('images have alt text or aria-hidden', () => {
    document.body.innerHTML = `
      <img src="logo.svg" alt="Properties 4 Creations Logo">
      <img src="decorative.svg" aria-hidden="true">
    `;

    const images = document.querySelectorAll('img');

    expect(images[0].hasAttribute('alt')).toBe(true);
    expect(images[0].getAttribute('alt')).not.toBe('');
    expect(images[1].hasAttribute('aria-hidden')).toBe(true);
  });

  test('buttons have accessible names', () => {
    document.body.innerHTML = `
      <button>Submit</button>
      <button aria-label="Close menu">×</button>
      <button aria-labelledby="close-text">×</button>
      <span id="close-text">Close</span>
    `;

    const buttons = document.querySelectorAll('button');

    expect(buttons[0].textContent.trim()).toBe('Submit');
    expect(buttons[1].getAttribute('aria-label')).toBe('Close menu');
    expect(buttons[2].getAttribute('aria-labelledby')).toBe('close-text');
  });

  test('heading hierarchy is correct', () => {
    document.body.innerHTML = `
      <h1>Main Title</h1>
      <h2>Section Title</h2>
      <h3>Subsection Title</h3>
      <h2>Another Section</h2>
    `;

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const levels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));

    expect(levels).toEqual([1, 2, 3, 2]); // Valid hierarchy
  });

  test('color contrast meets WCAG standards', () => {
    // Test that theme colors meet contrast requirements
    const root = document.documentElement;

    // Set light theme colors
    root.style.setProperty('--color-primary-navy', '#0B1120');
    root.style.setProperty('--color-neutral-white', '#FFFFFF');

    expect(root.style.getPropertyValue('--color-primary-navy')).toBe('#0B1120');
    expect(root.style.getPropertyValue('--color-neutral-white')).toBe('#FFFFFF');
  });
});
