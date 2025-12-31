/**
 * Properties 4 Creations - Validation Unit Tests
 * Comprehensive tests for form validation and submission logic
 */

import {
  isValidEmail,
  isValidPhone,
  validateField,
  validateForm,
  sanitizeInput,
  handleApplicationSubmit,
  handleContactSubmit,
  addFormValidation,
  setMinimumMoveInDate
} from '../../js/validation.js';

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to reduce noise
const originalConsole = console;
beforeEach(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
  fetch.mockClear();
});

describe('Email Validation', () => {
  test('should validate correct email addresses', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'user123@test-domain.com'
    ];

    validEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  test('should reject invalid email addresses', () => {
    const invalidEmails = [
      'invalid-email',
      '@example.com',
      'user@',
      'user@.com',
      'user name@example.com',
      'user@example..com'
    ];

    invalidEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(false);
    });
  });

  test('should handle empty and null inputs', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
  });
});

describe('Phone Validation', () => {
  test('should validate correct US phone numbers', () => {
    const validPhones = [
      '1234567890',
      '+1234567890',
      '1-234-567-8900',
      '(123) 456-7890',
      '123.456.7890',
      '+1 (555) 123-4567'
    ];

    validPhones.forEach(phone => {
      expect(isValidPhone(phone)).toBe(true);
    });
  });

  test('should reject invalid phone numbers', () => {
    const invalidPhones = [
      '123456789', // Too short
      '123456789012345678901234567890', // Too long
      'abc-def-ghij',
      '123-abc-7890',
      '',
      null,
      undefined
    ];

    invalidPhones.forEach(phone => {
      expect(isValidPhone(phone)).toBe(false);
    });
  });

  test('should handle edge cases', () => {
    // Exactly 10 digits
    expect(isValidPhone('1234567890')).toBe(true);
    
    // Exactly 15 digits (max for international)
    expect(isValidPhone('+123456789012345')).toBe(true);
    
    // Spaces and special characters should be stripped
    expect(isValidPhone('  123 456 7890  ')).toBe(true);
  });
});

describe('Field Validation', () => {
  let mockField;

  beforeEach(() => {
    // Create a mock input element
    mockField = document.createElement('input');
    mockField.type = 'text';
    mockField.value = '';
    document.body.appendChild(mockField);
  });

  afterEach(() => {
    if (mockField.parentNode) {
      mockField.parentNode.removeChild(mockField);
    }
  });

  test('should validate required field with value', () => {
    mockField.required = true;
    mockField.value = 'test value';
    
    const result = validateField(mockField, false);
    expect(result).toBe(true);
    expect(mockField.classList.contains('error')).toBe(false);
  });

  test('should fail validation for empty required field', () => {
    mockField.required = true;
    mockField.value = '';
    
    const result = validateField(mockField, false);
    expect(result).toBe(false);
    expect(mockField.classList.contains('error')).toBe(true);
    expect(mockField.getAttribute('aria-invalid')).toBe('true');
  });

  test('should validate email field with correct format', () => {
    mockField.type = 'email';
    mockField.required = true;
    mockField.value = 'test@example.com';
    
    const result = validateField(mockField, false);
    expect(result).toBe(true);
  });

  test('should fail validation for invalid email', () => {
    mockField.type = 'email';
    mockField.required = true;
    mockField.value = 'invalid-email';
    
    const result = validateField(mockField, false);
    expect(result).toBe(false);
  });

  test('should validate phone field with correct format', () => {
    mockField.type = 'tel';
    mockField.required = true;
    mockField.value = '1234567890';
    
    const result = validateField(mockField, false);
    expect(result).toBe(true);
  });

  test('should fail validation for invalid phone', () => {
    mockField.type = 'tel';
    mockField.required = true;
    mockField.value = 'invalid-phone';
    
    const result = validateField(mockField, false);
    expect(result).toBe(false);
  });

  test('should validate minlength constraint', () => {
    mockField.required = true;
    mockField.setAttribute('minlength', '5');
    mockField.value = 'test'; // 4 characters
    
    const result = validateField(mockField, false);
    expect(result).toBe(false);
  });

  test('should pass validation with sufficient length', () => {
    mockField.required = true;
    mockField.setAttribute('minlength', '5');
    mockField.value = 'test123'; // 8 characters
    
    const result = validateField(mockField, false);
    expect(result).toBe(true);
  });

  test('should handle checkbox validation', () => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.required = true;
    document.body.appendChild(checkbox);

    checkbox.checked = false;
    const result = validateField(checkbox, false);
    expect(result).toBe(false);

    checkbox.checked = true;
    const result2 = validateField(checkbox, false);
    expect(result2).toBe(true);

    checkbox.parentNode.removeChild(checkbox);
  });

  test('should not validate empty optional fields', () => {
    mockField.required = false;
    mockField.value = '';
    
    const result = validateField(mockField, false);
    expect(result).toBe(true);
  });

  test('should show error message when requested', () => {
    mockField.required = true;
    mockField.value = '';
    
    validateField(mockField, true);
    
    const errorDiv = mockField.parentNode.querySelector('.field-error');
    expect(errorDiv).toBeTruthy();
    expect(errorDiv.textContent).toBe('This field is required');
    expect(errorDiv.getAttribute('role')).toBe('alert');
  });

  test('should clear error when field becomes valid', () => {
    mockField.required = true;
    mockField.value = '';
    
    // First, trigger an error
    validateField(mockField, true);
    expect(mockField.classList.contains('error')).toBe(true);
    
    // Then fix the field
    mockField.value = 'valid value';
    validateField(mockField, false);
    
    expect(mockField.classList.contains('error')).toBe(false);
    expect(mockField.getAttribute('aria-invalid')).toBe(null);
    expect(mockField.parentNode.querySelector('.field-error')).toBeNull();
  });
});

describe('Form Validation', () => {
  let mockForm;

  beforeEach(() => {
    mockForm = document.createElement('form');
    document.body.appendChild(mockForm);
  });

  afterEach(() => {
    if (mockForm.parentNode) {
      mockForm.parentNode.removeChild(mockForm);
    }
  });

  test('should validate form with all required fields filled', () => {
    const field1 = document.createElement('input');
    field1.required = true;
    field1.value = 'value1';
    
    const field2 = document.createElement('input');
    field2.required = true;
    field2.value = 'value2';
    
    mockForm.appendChild(field1);
    mockForm.appendChild(field2);
    
    const result = validateForm(mockForm, false);
    expect(result).toBe(true);
  });

  test('should fail validation with empty required field', () => {
    const field1 = document.createElement('input');
    field1.required = true;
    field1.value = 'value1';
    
    const field2 = document.createElement('input');
    field2.required = true;
    field2.value = '';
    
    mockForm.appendChild(field1);
    mockForm.appendChild(field2);
    
    const result = validateForm(mockForm, false);
    expect(result).toBe(false);
  });

  test('should handle non-required fields correctly', () => {
    const requiredField = document.createElement('input');
    requiredField.required = true;
    requiredField.value = 'value1';
    
    const optionalField = document.createElement('input');
    optionalField.required = false;
    optionalField.value = '';
    
    mockForm.appendChild(requiredField);
    mockForm.appendChild(optionalField);
    
    const result = validateForm(mockForm, false);
    expect(result).toBe(true);
  });

  test('should handle different input types', () => {
    const emailField = document.createElement('input');
    emailField.type = 'email';
    emailField.required = true;
    emailField.value = 'test@example.com';
    
    const phoneField = document.createElement('input');
    phoneField.type = 'tel';
    phoneField.required = true;
    phoneField.value = '1234567890';
    
    const textField = document.createElement('input');
    textField.type = 'text';
    textField.required = true;
    textField.value = 'test value';
    
    mockForm.appendChild(emailField);
    mockForm.appendChild(phoneField);
    mockForm.appendChild(textField);
    
    const result = validateForm(mockForm, false);
    expect(result).toBe(true);
  });

  test('should handle select elements', () => {
    const selectField = document.createElement('select');
    selectField.required = true;
    selectField.innerHTML = '<option value="">Select an option</option><option value="option1">Option 1</option>';
    selectField.value = 'option1';
    
    mockForm.appendChild(selectField);
    
    const result = validateForm(mockForm, false);
    expect(result).toBe(true);
  });

  test('should handle textarea elements', () => {
    const textareaField = document.createElement('textarea');
    textareaField.required = true;
    textareaField.value = 'Some text content';
    
    mockForm.appendChild(textareaField);
    
    const result = validateForm(mockForm, false);
    expect(result).toBe(true);
  });

  test('should return false for invalid form parameter', () => {
    expect(validateForm(null)).toBe(false);
    expect(validateForm(undefined)).toBe(false);
    expect(validateForm({})).toBe(false);
    expect(validateForm('not a form')).toBe(false);
  });

  test('should handle form with no required fields', () => {
    const field1 = document.createElement('input');
    field1.required = false;
    field1.value = '';
    
    const field2 = document.createElement('input');
    field2.required = false;
    field2.value = '';
    
    mockForm.appendChild(field1);
    mockForm.appendChild(field2);
    
    const result = validateForm(mockForm, false);
    expect(result).toBe(true);
  });
});

describe('Input Sanitization', () => {
  test('should remove HTML tags from input', () => {
    const maliciousInput = '<script>alert("xss")</script>Hello World';
    const sanitized = sanitizeInput(maliciousInput);
    expect(sanitized).toBe('Hello World');
  });

  test('should remove javascript: protocol', () => {
    const maliciousInput = 'javascript:alert("xss")';
    const sanitized = sanitizeInput(maliciousInput);
    expect(sanitized).toBe('alert("xss")');
  });

  test('should remove event handlers', () => {
    const maliciousInput = 'onclick="alert(\'xss\')"';
    const sanitized = sanitizeInput(maliciousInput);
    expect(sanitized).toBe('');
  });

  test('should handle normal input without changes', () => {
    const normalInput = 'This is a normal input';
    const sanitized = sanitizeInput(normalInput);
    expect(sanitized).toBe('This is a normal input');
  });

  test('should trim whitespace', () => {
    const inputWithSpaces = '  Hello World  ';
    const sanitized = sanitizeInput(inputWithSpaces);
    expect(sanitized).toBe('Hello World');
  });

  test('should handle non-string input', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
    expect(sanitizeInput(123)).toBe('');
    expect(sanitizeInput({})).toBe('');
  });

  test('should handle mixed malicious content', () => {
    const complexInput = '<div onclick="alert(\'xss\')">javascript:alert("test")<script>alert("bad")</script>Safe Content</div>';
    const sanitized = sanitizeInput(complexInput);
    expect(sanitized).toBe('Safe Content');
  });
});

describe('Form Submission Handlers', () => {
  let mockForm;
  let submitButton;

  beforeEach(() => {
    mockForm = document.createElement('form');
    mockForm.action = 'https://formspree.io/f/test';
    
    const nameField = document.createElement('input');
    nameField.name = 'name';
    nameField.required = true;
    nameField.value = 'Test User';
    
    const emailField = document.createElement('input');
    emailField.name = 'email';
    emailField.type = 'email';
    emailField.required = true;
    emailField.value = 'test@example.com';
    
    submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    
    mockForm.appendChild(nameField);
    mockForm.appendChild(emailField);
    mockForm.appendChild(submitButton);
    document.body.appendChild(mockForm);
  });

  afterEach(() => {
    if (mockForm.parentNode) {
      mockForm.parentNode.removeChild(mockForm);
    }
    fetch.mockClear();
  });

  test('should handle successful application form submission', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    });

    const event = new Event('submit', { bubbles: true });
    mockForm.id = 'application-form';
    mockForm.dispatchEvent(event);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(fetch).toHaveBeenCalledWith('https://formspree.io/f/test', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: expect.any(FormData)
    });

    // Check that button was updated
    expect(submitButton.textContent).toBe('Submit');
    expect(submitButton.disabled).toBe(false);
  });

  test('should handle successful contact form submission', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    });

    const event = new Event('submit', { bubbles: true });
    mockForm.id = 'contact-form';
    mockForm.dispatchEvent(event);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(fetch).toHaveBeenCalledWith('https://formspree.io/f/test', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: expect.any(FormData)
    });
  });

  test('should handle form validation errors', async () => {
    // Make form invalid
    const emailField = mockForm.querySelector('input[type="email"]');
    emailField.value = 'invalid-email';
    
    const event = new Event('submit', { bubbles: true });
    mockForm.id = 'application-form';
    mockForm.dispatchEvent(event);

    await new Promise(resolve => setTimeout(resolve, 100));

    // Should not make fetch call for invalid form
    expect(fetch).not.toHaveBeenCalled();
  });

  test('should handle network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const event = new Event('submit', { bubbles: true });
    mockForm.id = 'application-form';
    mockForm.dispatchEvent(event);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(console.error).toHaveBeenCalledWith('Network error submitting application:', expect.any(Error));
  });

  test('should handle server errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({
        errors: [{ message: 'Invalid email format' }]
      })
    });

    const event = new Event('submit', { bubbles: true });
    mockForm.id = 'application-form';
    mockForm.dispatchEvent(event);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(console.warn).toHaveBeenCalledWith('Could not parse error response as JSON:', expect.any(Error));
  });

  test('should sanitize form data before submission', async () => {
    const maliciousField = document.createElement('input');
    maliciousField.name = 'message';
    maliciousField.value = '<script>alert("xss")</script>Safe message';
    mockForm.appendChild(maliciousField);

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    });

    const event = new Event('submit', { bubbles: true });
    mockForm.id = 'application-form';
    mockForm.dispatchEvent(event);

    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify that the malicious content was sanitized
    const formData = fetch.mock.calls[0][1].body;
    const messageValue = formData.get('message');
    expect(messageValue).toBe('Safe message');
  });
});

describe('Form Validation Setup', () => {
  let mockForm;

  beforeEach(() => {
    mockForm = document.createElement('form');
    
    const requiredField = document.createElement('input');
    requiredField.required = true;
    requiredField.type = 'text';
    
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    
    mockForm.appendChild(requiredField);
    mockForm.appendChild(submitButton);
    document.body.appendChild(mockForm);
  });

  afterEach(() => {
    if (mockForm.parentNode) {
      mockForm.parentNode.removeChild(mockForm);
    }
  });

  test('should add validation event listeners to form fields', () => {
    addFormValidation(mockForm);
    
    const requiredField = mockForm.querySelector('input[required]');
    const submitButton = mockForm.querySelector('button[type="submit"]');
    
    // Simulate field blur with empty value
    requiredField.dispatchEvent(new Event('blur'));
    
    expect(requiredField.classList.contains('error')).toBe(true);
    expect(submitButton.disabled).toBe(true);
    
    // Simulate field input
    requiredField.value = 'test value';
    requiredField.dispatchEvent(new Event('input'));
    
    expect(requiredField.classList.contains('error')).toBe(false);
    expect(submitButton.disabled).toBe(false);
  });

  test('should handle multiple fields correctly', () => {
    const field1 = document.createElement('input');
    field1.required = true;
    field1.type = 'text';
    
    const field2 = document.createElement('input');
    field2.required = true;
    field2.type = 'email';
    
    mockForm.appendChild(field1);
    mockForm.appendChild(field2);
    
    addFormValidation(mockForm);
    
    // Both fields empty - submit should be disabled
    field1.dispatchEvent(new Event('blur'));
    field2.dispatchEvent(new Event('blur'));
    
    const submitButton = mockForm.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBe(true);
    
    // Fill one field - submit should still be disabled
    field1.value = 'test value';
    field1.dispatchEvent(new Event('input'));
    expect(submitButton.disabled).toBe(true);
    
    // Fill both fields - submit should be enabled
    field2.value = 'test@example.com';
    field2.dispatchEvent(new Event('input'));
    expect(submitButton.disabled).toBe(false);
  });
});

describe('Move-in Date Validation', () => {
  let mockDateInput;

  beforeEach(() => {
    mockDateInput = document.createElement('input');
    mockDateInput.type = 'date';
    mockDateInput.id = 'move-date';
    document.body.appendChild(mockDateInput);
  });

  afterEach(() => {
    if (mockDateInput.parentNode) {
      mockDateInput.parentNode.removeChild(mockDateInput);
    }
  });

  test('should set minimum date to 7 days from today', () => {
    setMinimumMoveInDate();
    
    const minDate = mockDateInput.getAttribute('min');
    const today = new Date();
    const expectedMinDate = new Date(today);
    expectedMinDate.setDate(today.getDate() + 7);
    const expectedDateString = expectedMinDate.toISOString().split('T')[0];
    
    expect(minDate).toBe(expectedDateString);
  });

  test('should not set minimum date if element does not exist', () => {
    // Remove the element to test the case where it doesn't exist
    mockDateInput.parentNode.removeChild(mockDateInput);
    
    // Should not throw an error
    expect(() => setMinimumMoveInDate()).not.toThrow();
  });
});