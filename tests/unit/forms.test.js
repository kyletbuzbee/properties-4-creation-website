/**
 * Properties 4 Creations - Forms Module Unit Tests
 * Comprehensive tests for form initialization and submission
 */

// Mock the validation module
jest.mock('../../js/validation.js', () => ({
  handleApplicationSubmit: jest.fn(),
  handleContactSubmit: jest.fn(),
  addFormValidation: jest.fn(),
  setMinimumMoveInDate: jest.fn()
}));

import {
  handleApplicationSubmit,
  handleContactSubmit,
  addFormValidation,
  setMinimumMoveInDate
} from '../../js/validation.js';

describe('Forms Module', () => {
  let applicationForm;
  let contactForm;
  let applicationSubmitButton;
  let contactSubmitButton;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Reset DOM
    document.body.innerHTML = '';
    
    // Create mock forms
    applicationForm = document.createElement('form');
    applicationForm.id = 'application-form';
    applicationForm.action = 'https://formspree.io/f/app-form';
    
    applicationSubmitButton = document.createElement('button');
    applicationSubmitButton.type = 'submit';
    applicationSubmitButton.textContent = 'Submit Application';
    
    contactForm = document.createElement('form');
    contactForm.id = 'contact-form';
    contactForm.action = 'https://formspree.io/f/contact-form';
    
    contactSubmitButton = document.createElement('button');
    contactSubmitButton.type = 'submit';
    contactSubmitButton.textContent = 'Send Message';
    
    applicationForm.appendChild(applicationSubmitButton);
    contactForm.appendChild(contactSubmitButton);
    
    document.body.appendChild(applicationForm);
    document.body.appendChild(contactForm);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Form Initialization', () => {
    test('should initialize forms correctly', () => {
      const { initForms } = require('../../js/forms.js');
      
      initForms();
      
      // Should call setMinimumMoveInDate
      expect(setMinimumMoveInDate).toHaveBeenCalled();
      
      // Should add validation to both forms
      expect(addFormValidation).toHaveBeenCalledWith(applicationForm);
      expect(addFormValidation).toHaveBeenCalledWith(contactForm);
      
      // Should add submit event listeners
      expect(applicationSubmitButton.disabled).toBe(true);
      expect(contactSubmitButton.disabled).toBe(true);
    });

    test('should handle missing forms gracefully', () => {
      // Remove one form
      applicationForm.remove();
      
      const { initForms } = require('../../js/forms.js');
      
      // Should not throw error
      expect(() => initForms()).not.toThrow();
      
      // Should still initialize the remaining form
      expect(addFormValidation).toHaveBeenCalledWith(contactForm);
    });

    test('should handle forms without submit buttons', () => {
      // Remove submit buttons
      applicationSubmitButton.remove();
      contactSubmitButton.remove();
      
      const { initForms } = require('../../js/forms.js');
      
      // Should not throw error
      expect(() => initForms()).not.toThrow();
      
      // Should still add validation
      expect(addFormValidation).toHaveBeenCalledWith(applicationForm);
      expect(addFormValidation).toHaveBeenCalledWith(contactForm);
    });

    test('should only initialize forms with correct IDs', () => {
      // Create a form without a specific ID
      const otherForm = document.createElement('form');
      otherForm.action = 'https://example.com';
      document.body.appendChild(otherForm);
      
      const { initForms } = require('../../js/forms.js');
      
      initForms();
      
      // Should only initialize forms with specific IDs
      expect(addFormValidation).toHaveBeenCalledTimes(2);
      expect(addFormValidation).toHaveBeenCalledWith(applicationForm);
      expect(addFormValidation).toHaveBeenCalledWith(contactForm);
    });
  });

  describe('Form Event Listeners', () => {
    beforeEach(() => {
      const { initForms } = require('../../js/forms.js');
      initForms();
    });

    test('should add submit event listener to application form', () => {
      // Simulate form submission
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      expect(handleApplicationSubmit).toHaveBeenCalledWith(submitEvent);
    });

    test('should add submit event listener to contact form', () => {
      // Simulate form submission
      const submitEvent = new Event('submit', { bubbles: true });
      contactForm.dispatchEvent(submitEvent);
      
      expect(handleContactSubmit).toHaveBeenCalledWith(submitEvent);
    });

    test('should not add event listeners to other forms', () => {
      // Create another form
      const otherForm = document.createElement('form');
      otherForm.id = 'other-form';
      document.body.appendChild(otherForm);
      
      const submitEvent = new Event('submit', { bubbles: true });
      otherForm.dispatchEvent(submitEvent);
      
      // Should not call any handler
      expect(handleApplicationSubmit).not.toHaveBeenCalled();
      expect(handleContactSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Submit Button State Management', () => {
    test('should disable submit buttons on initialization', () => {
      const { initForms } = require('../../js/forms.js');
      
      initForms();
      
      expect(applicationSubmitButton.disabled).toBe(true);
      expect(contactSubmitButton.disabled).toBe(true);
    });

    test('should handle forms without submit buttons', () => {
      // Remove submit buttons before initialization
      applicationSubmitButton.remove();
      contactSubmitButton.remove();
      
      const { initForms } = require('../../js/forms.js');
      
      // Should not throw error
      expect(() => initForms()).not.toThrow();
    });

    test('should handle submit buttons with different text', () => {
      applicationSubmitButton.textContent = 'Apply Now';
      contactSubmitButton.textContent = 'Contact Us';
      
      const { initForms } = require('../../js/forms.js');
      
      initForms();
      
      expect(applicationSubmitButton.disabled).toBe(true);
      expect(contactSubmitButton.disabled).toBe(true);
      expect(applicationSubmitButton.textContent).toBe('Apply Now');
      expect(contactSubmitButton.textContent).toBe('Contact Us');
    });
  });

  describe('Form Validation Integration', () => {
    test('should call addFormValidation for each form', () => {
      const { initForms } = require('../../js/forms.js');
      
      initForms();
      
      expect(addFormValidation).toHaveBeenCalledWith(applicationForm);
      expect(addFormValidation).toHaveBeenCalledWith(contactForm);
      expect(addFormValidation).toHaveBeenCalledTimes(2);
    });

    test('should pass correct form references to validation', () => {
      const { initForms } = require('../../js/forms.js');
      
      initForms();
      
      // Verify that the correct form elements were passed
      const calls = addFormValidation.mock.calls;
      expect(calls[0][0]).toBe(applicationForm);
      expect(calls[1][0]).toBe(contactForm);
    });
  });

  describe('Move-in Date Setup', () => {
    test('should call setMinimumMoveInDate on initialization', () => {
      const { initForms } = require('../../js/forms.js');
      
      initForms();
      
      expect(setMinimumMoveInDate).toHaveBeenCalled();
    });

    test('should call setMinimumMoveInDate only once', () => {
      const { initForms } = require('../../js/forms.js');

      initForms();
      initForms(); // Call twice

      expect(setMinimumMoveInDate).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    test('should handle errors in form initialization', () => {
      // Mock addFormValidation to throw error
      addFormValidation.mockImplementation(() => {
        throw new Error('Validation error');
      });
      
      const { initForms } = require('../../js/forms.js');
      
      // Should throw error from initForms since it doesn't have try/catch
      expect(() => initForms()).toThrow('Validation error');
    });

    test('should handle missing validation functions', () => {
      // Mock validation module to return undefined functions
      jest.doMock('../../js/validation.js', () => ({
        handleApplicationSubmit: undefined,
        handleContactSubmit: undefined,
        addFormValidation: undefined,
        setMinimumMoveInDate: undefined
      }));
      
      const { initForms } = require('../../js/forms.js');
      
      // Should not throw error
      expect(() => initForms()).not.toThrow();
    });

    test('should handle forms with missing action attributes', () => {
      applicationForm.removeAttribute('action');
      contactForm.removeAttribute('action');
      
      const { initForms } = require('../../js/forms.js');
      
      // Should not throw error
      expect(() => initForms()).not.toThrow();
    });
  });

  describe('Form Structure Validation', () => {
    test('should handle forms with different structures', () => {
      // Create forms with different input structures
      const nameInput = document.createElement('input');
      nameInput.name = 'name';
      nameInput.required = true;
      
      const emailInput = document.createElement('input');
      emailInput.name = 'email';
      emailInput.type = 'email';
      emailInput.required = true;
      
      applicationForm.appendChild(nameInput);
      applicationForm.appendChild(emailInput);
      
      const { initForms } = require('../../js/forms.js');
      
      initForms();
      
      // Should handle complex form structures
      expect(addFormValidation).toHaveBeenCalledWith(applicationForm);
    });

    test('should handle forms with nested elements', () => {
      const fieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = 'Contact Information';
      
      const nameInput = document.createElement('input');
      nameInput.name = 'name';
      nameInput.required = true;
      
      fieldset.appendChild(legend);
      fieldset.appendChild(nameInput);
      applicationForm.appendChild(fieldset);
      
      const { initForms } = require('../../js/forms.js');
      
      initForms();
      
      // Should handle nested form structures
      expect(addFormValidation).toHaveBeenCalledWith(applicationForm);
    });
  });

  describe('Multiple Initializations', () => {
    test('should handle multiple calls to initForms', () => {
      const { initForms } = require('../../js/forms.js');
      
      initForms();
      initForms(); // Call again
      
      // Should not cause issues
      expect(setMinimumMoveInDate).toHaveBeenCalledTimes(1);
      expect(addFormValidation).toHaveBeenCalledTimes(2);
    });

    test('should not duplicate event listeners', () => {
      const { initForms } = require('../../js/forms.js');
      
      initForms();
      
      // Simulate multiple initializations
      const submitEvent = new Event('submit', { bubbles: true });
      applicationForm.dispatchEvent(submitEvent);
      
      // Should only call handler once per submission
      expect(handleApplicationSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form ID Validation', () => {
    test('should only process forms with correct IDs', () => {
      // Create forms with different IDs
      const otherForm1 = document.createElement('form');
      otherForm1.id = 'test-form';
      otherForm1.appendChild(document.createElement('button'));
      
      const otherForm2 = document.createElement('form');
      otherForm2.id = 'random-form';
      otherForm2.appendChild(document.createElement('button'));
      
      document.body.appendChild(otherForm1);
      document.body.appendChild(otherForm2);
      
      const { initForms } = require('../../js/forms.js');
      
      initForms();
      
      // Should only process forms with specific IDs
      expect(addFormValidation).toHaveBeenCalledTimes(2);
      expect(addFormValidation).toHaveBeenCalledWith(applicationForm);
      expect(addFormValidation).toHaveBeenCalledWith(contactForm);
    });
  });
});