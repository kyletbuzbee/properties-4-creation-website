// Unit tests for form validation functions
import {
  isValidEmail,
  isValidPhone,
  validateField
} from '../js/main.js';

describe('Email Validation', () => {
  test('valid email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
    expect(isValidEmail('test.email@subdomain.domain.org')).toBe(true);
  });

  test('invalid email addresses', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user@domain')).toBe(false);
  });
});

describe('Phone Validation', () => {
  test('valid phone numbers', () => {
    expect(isValidPhone('1234567890')).toBe(true);
    expect(isValidPhone('123-456-7890')).toBe(true);
    expect(isValidPhone('(123) 456-7890')).toBe(true);
    expect(isValidPhone('+11234567890')).toBe(true);
  });

  test('invalid phone numbers', () => {
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('abcdefghijk')).toBe(false);
    expect(isValidPhone('123-456-789')).toBe(false);
  });
});

describe('Field Validation', () => {
  let mockField;

  beforeEach(() => {
    mockField = {
      value: '',
      hasAttribute: jest.fn(),
      getAttribute: jest.fn(),
      type: 'text',
      classList: {
        add: jest.fn(),
        remove: jest.fn()
      },
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
      parentNode: {
        querySelector: jest.fn(),
        appendChild: jest.fn()
      }
    };
  });

  test('required field validation', () => {
    mockField.hasAttribute.mockReturnValue(true);
    mockField.value = '';

    const result = validateField(mockField);

    expect(result).toBe(false);
  });

  test('email field validation', () => {
    mockField.type = 'email';
    mockField.value = 'invalid-email';
    mockField.hasAttribute.mockReturnValue(false);

    const result = validateField(mockField);

    expect(result).toBe(false);
  });

  test('valid field passes validation', () => {
    mockField.hasAttribute.mockReturnValue(true);
    mockField.value = 'test@example.com';
    mockField.type = 'email';

    const result = validateField(mockField);

    expect(result).toBe(true);
  });
});
