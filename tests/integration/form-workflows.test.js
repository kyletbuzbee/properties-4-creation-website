/**
 * Properties 4 Creations - Form Workflows Integration Tests
 * Comprehensive tests for complete form submission workflows
 */

// Mock fetch globally
global.fetch = jest.fn();

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

describe('Form Workflows Integration Tests', () => {
  let applicationForm;
  let contactForm;
  let applicationSubmitButton;
  let contactSubmitButton;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    fetch.mockClear();
    localStorageMock.clear();
    
    // Reset DOM
    document.body.innerHTML = '';
    
    // Create complete application form
    applicationForm = document.createElement('form');
    applicationForm.id = 'application-form';
    applicationForm.action = 'https://formspree.io/f/app-form';
    applicationForm.innerHTML = `
      <div class="form-group">
        <label for="name">Full Name *</label>
        <input type="text" id="name" name="name" required minlength="2">
      </div>
      <div class="form-group">
        <label for="email">Email Address *</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="phone">Phone Number *</label>
        <input type="tel" id="phone" name="phone" required>
      </div>
      <div class="form-group">
        <label for="move-date">Preferred Move-in Date *</label>
        <input type="date" id="move-date" name="move-date" required>
      </div>
      <div class="form-group">
        <label for="message">Additional Information</label>
        <textarea id="message" name="message" rows="4"></textarea>
      </div>
      <div class="form-group">
        <input type="checkbox" id="agree" name="agree" required>
        <label for="agree">I agree to the terms and conditions *</label>
      </div>
      <button type="submit" class="btn btn-primary">Submit Application</button>
    `;
    
    // Create complete contact form
    contactForm = document.createElement('form');
    contactForm.id = 'contact-form';
    contactForm.action = 'https://formspree.io/f/contact-form';
    contactForm.innerHTML = `
      <div class="form-group">
        <label for="contact-name">Your Name *</label>
        <input type="text" id="contact-name" name="name" required minlength="2">
      </div>
      <div class="form-group">
        <label for="contact-email">Your Email *</label>
        <input type="email" id="contact-email" name="email" required>
      </div>
      <div class="form-group">
        <label for="contact-subject">Subject *</label>
        <input type="text" id="contact-subject" name="subject" required minlength="5">
      </div>
      <div class="form-group">
        <label for="contact-message">Your Message *</label>
        <textarea id="contact-message" name="message" rows="5" required minlength="10"></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Send Message</button>
    `;
    
    applicationSubmitButton = applicationForm.querySelector('button[type="submit"]');
    contactSubmitButton = contactForm.querySelector('button[type="submit"]');
    
    document.body.appendChild(applicationForm);
    document.body.appendChild(contactForm);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Complete Application Form Workflow', () => {
    test('should successfully submit a complete application form', async () => {
      // Set up form data
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      const phoneInput = applicationForm.querySelector('#phone');
      const moveDateInput = applicationForm.querySelector('#move-date');
      const messageInput = applicationForm.querySelector('#message');
      const agreeCheckbox = applicationForm.querySelector('#agree');
      
      nameInput.value = 'John Doe';
      emailInput.value = 'john.doe@example.com';
      phoneInput.value = '555-123-4567';
      moveDateInput.value = '2024-01-15';
      messageInput.value = 'Looking for a 3-bedroom home for my family.';
      agreeCheckbox.checked = true;
      
      // Mock successful fetch response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      });
      
      // Submit form
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify fetch was called with correct data
      expect(fetch).toHaveBeenCalledWith('https://formspree.io/f/app-form', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: expect.any(FormData)
      });
      
      // Verify button state during submission
      expect(applicationSubmitButton.disabled).toBe(false); // Should be re-enabled after success
      expect(applicationSubmitButton.textContent).toBe('Submit Application');
      
      // Verify form was reset
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(phoneInput.value).toBe('');
      expect(messageInput.value).toBe('');
      expect(agreeCheckbox.checked).toBe(false);
    });

    test('should handle application form validation errors', async () => {
      // Set up invalid form data
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      const phoneInput = applicationForm.querySelector('#phone');
      const agreeCheckbox = applicationForm.querySelector('#agree');
      
      nameInput.value = 'J'; // Too short
      emailInput.value = 'invalid-email'; // Invalid email
      phoneInput.value = 'not-a-phone'; // Invalid phone
      agreeCheckbox.checked = false; // Not checked
      
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should not make fetch call for invalid form
      expect(fetch).not.toHaveBeenCalled();
      
      // Verify error messages are shown
      const errorMessages = applicationForm.querySelectorAll('.field-error');
      expect(errorMessages.length).toBeGreaterThan(0);
      
      // Verify button remains disabled
      expect(applicationSubmitButton.disabled).toBe(true);
    });

    test('should handle application form network errors', async () => {
      // Set up valid form data
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      const phoneInput = applicationForm.querySelector('#phone');
      const agreeCheckbox = applicationForm.querySelector('#agree');
      
      nameInput.value = 'John Doe';
      emailInput.value = 'john.doe@example.com';
      phoneInput.value = '555-123-4567';
      agreeCheckbox.checked = true;
      
      // Mock network error
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify error handling
      expect(fetch).toHaveBeenCalled();
      expect(applicationSubmitButton.disabled).toBe(false);
      expect(applicationSubmitButton.textContent).toBe('Submit Application');
    });

    test('should handle application form server errors', async () => {
      // Set up valid form data
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      const phoneInput = applicationForm.querySelector('#phone');
      const agreeCheckbox = applicationForm.querySelector('#agree');
      
      nameInput.value = 'John Doe';
      emailInput.value = 'john.doe@example.com';
      phoneInput.value = '555-123-4567';
      agreeCheckbox.checked = true;
      
      // Mock server error
      fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({
          errors: [{ message: 'Invalid email format' }]
        })
      });
      
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify error handling
      expect(fetch).toHaveBeenCalled();
      expect(applicationSubmitButton.disabled).toBe(false);
    });

    test('should sanitize malicious input in application form', async () => {
      // Set up form with malicious input
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      const messageInput = applicationForm.querySelector('#message');
      const agreeCheckbox = applicationForm.querySelector('#agree');
      
      nameInput.value = '<script>alert("xss")</script>John Doe';
      emailInput.value = 'john@example.com';
      messageInput.value = 'javascript:alert("test")<div onclick="alert(\'bad\')">Safe message</div>';
      agreeCheckbox.checked = true;
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      });
      
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify that malicious content was sanitized
      const formData = fetch.mock.calls[0][1].body;
      expect(formData.get('name')).toBe('John Doe');
      expect(formData.get('message')).toBe('Safe message');
    });
  });

  describe('Complete Contact Form Workflow', () => {
    test('should successfully submit a complete contact form', async () => {
      // Set up form data
      const nameInput = contactForm.querySelector('#contact-name');
      const emailInput = contactForm.querySelector('#contact-email');
      const subjectInput = contactForm.querySelector('#contact-subject');
      const messageInput = contactForm.querySelector('#contact-message');
      
      nameInput.value = 'Jane Smith';
      emailInput.value = 'jane.smith@example.com';
      subjectInput.value = 'Property Inquiry';
      messageInput.value = 'I am interested in your available properties.';
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      });
      
      const submitEvent = new Event('submit', { bubbles: true });
      contactForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(fetch).toHaveBeenCalledWith('https://formspree.io/f/contact-form', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: expect.any(FormData)
      });
      
      expect(contactSubmitButton.disabled).toBe(false);
      expect(contactSubmitButton.textContent).toBe('Send Message');
      
      // Verify form was reset
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(subjectInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });

    test('should handle contact form validation errors', async () => {
      // Set up invalid form data
      const nameInput = contactForm.querySelector('#contact-name');
      const emailInput = contactForm.querySelector('#contact-email');
      const subjectInput = contactForm.querySelector('#contact-subject');
      const messageInput = contactForm.querySelector('#contact-message');
      
      nameInput.value = 'J'; // Too short
      emailInput.value = 'invalid-email'; // Invalid email
      subjectInput.value = 'test'; // Too short
      messageInput.value = 'Hi'; // Too short
      
      const submitEvent = new Event('submit', { bubbles: true });
      contactForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(fetch).not.toHaveBeenCalled();
      
      const errorMessages = contactForm.querySelectorAll('.field-error');
      expect(errorMessages.length).toBeGreaterThan(0);
      
      expect(contactSubmitButton.disabled).toBe(true);
    });

    test('should handle contact form network errors', async () => {
      // Set up valid form data
      const nameInput = contactForm.querySelector('#contact-name');
      const emailInput = contactForm.querySelector('#contact-email');
      const subjectInput = contactForm.querySelector('#contact-subject');
      const messageInput = contactForm.querySelector('#contact-message');
      
      nameInput.value = 'Jane Smith';
      emailInput.value = 'jane.smith@example.com';
      subjectInput.value = 'Property Inquiry';
      messageInput.value = 'I am interested in your available properties.';
      
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      const submitEvent = new Event('submit', { bubbles: true });
      contactForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(fetch).toHaveBeenCalled();
      expect(contactSubmitButton.disabled).toBe(false);
    });
  });

  describe('Form State Management', () => {
    test('should manage submit button state correctly during form lifecycle', async () => {
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      const agreeCheckbox = applicationForm.querySelector('#agree');
      
      // Initially disabled
      expect(applicationSubmitButton.disabled).toBe(true);
      
      // Fill required fields
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      agreeCheckbox.checked = true;
      
      // Trigger validation
      nameInput.dispatchEvent(new Event('input'));
      emailInput.dispatchEvent(new Event('input'));
      agreeCheckbox.dispatchEvent(new Event('input'));
      
      // Should be enabled after validation
      expect(applicationSubmitButton.disabled).toBe(false);
      
      // Submit form
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      });
      
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should be re-enabled after successful submission
      expect(applicationSubmitButton.disabled).toBe(false);
    });

    test('should prevent multiple submissions', async () => {
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      const agreeCheckbox = applicationForm.querySelector('#agree');
      
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      agreeCheckbox.checked = true;
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      });
      
      // First submission
      const submitEvent1 = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent1);
      
      // Second submission attempt
      const submitEvent2 = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent2);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should only make one fetch call
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cross-Form Interactions', () => {
    test('should handle multiple forms on the same page independently', async () => {
      // Set up both forms
      const appInputs = {
        name: applicationForm.querySelector('#name'),
        email: applicationForm.querySelector('#email'),
        agree: applicationForm.querySelector('#agree')
      };
      
      const contactInputs = {
        name: contactForm.querySelector('#contact-name'),
        email: contactForm.querySelector('#contact-email')
      };
      
      // Fill application form
      appInputs.name.value = 'John Doe';
      appInputs.email.value = 'john@example.com';
      appInputs.agree.checked = true;
      
      // Fill contact form
      contactInputs.name.value = 'Jane Smith';
      contactInputs.email.value = 'jane@example.com';
      
      // Mock responses
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      });
      
      // Submit both forms
      const appSubmitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(appSubmitEvent);
      
      const contactSubmitEvent = new Event('submit', { bubbles: true });
      contactForm.dispatchEvent(contactSubmitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Both should have been submitted
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch.mock.calls[0][0]).toBe('https://formspree.io/f/app-form');
      expect(fetch.mock.calls[1][0]).toBe('https://formspree.io/f/contact-form');
    });
  });

  describe('Error Recovery', () => {
    test('should allow retry after network error', async () => {
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      const agreeCheckbox = applicationForm.querySelector('#agree');
      
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      agreeCheckbox.checked = true;
      
      // First submission fails
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      const submitEvent1 = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent1);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(fetch).toHaveBeenCalled();
      expect(applicationSubmitButton.disabled).toBe(false);
      
      // Second submission succeeds
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      });
      
      const submitEvent2 = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent2);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(applicationSubmitButton.disabled).toBe(false);
    });

    test('should preserve form data after validation errors', async () => {
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      const agreeCheckbox = applicationForm.querySelector('#agree');
      
      nameInput.value = 'John Doe';
      emailInput.value = 'invalid-email'; // Invalid
      agreeCheckbox.checked = true;
      
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Form data should be preserved
      expect(nameInput.value).toBe('John Doe');
      expect(emailInput.value).toBe('invalid-email');
      expect(agreeCheckbox.checked).toBe(true);
      
      // Fix the error
      emailInput.value = 'john@example.com';
      emailInput.dispatchEvent(new Event('input'));
      
      // Should now be able to submit
      expect(applicationSubmitButton.disabled).toBe(false);
    });
  });

  describe('Accessibility Integration', () => {
    test('should provide proper feedback for screen readers', async () => {
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      const agreeCheckbox = applicationForm.querySelector('#agree');
      
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      agreeCheckbox.checked = true;
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      });
      
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should create live region for announcements
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeTruthy();
      expect(liveRegion.textContent).toContain('Application Submitted Successfully');
    });

    test('should handle focus management during errors', async () => {
      const nameInput = applicationForm.querySelector('#name');
      const emailInput = applicationForm.querySelector('#email');
      
      nameInput.value = ''; // Empty required field
      emailInput.value = 'john@example.com';
      
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // First invalid field should have focus
      expect(document.activeElement).toBe(nameInput);
    });
  });
});