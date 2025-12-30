/**
 * Properties 4 Creations - Forms Module
 * Handles form initialization and submission
 *
 * @fileoverview Initializes form functionality using validation module
 * @author Properties 4 Creations
 */

import { 
  handleApplicationSubmit, 
  handleContactSubmit, 
  addFormValidation, 
  setMinimumMoveInDate 
} from './validation.js';

/**
 * Initialize form validation and submission
 */
export function initForms() {
  // Set minimum date for move-in date field
  setMinimumMoveInDate();

  const forms = [
    document.getElementById('application-form'),
    document.getElementById('contact-form')
  ];

  forms.forEach(form => {
    if (form) {
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true; // Disable on page load
      }
      
      if (form.id === 'application-form') {
        form.addEventListener('submit', handleApplicationSubmit);
      } else if (form.id === 'contact-form') {
        form.addEventListener('submit', handleContactSubmit);
      }
      
      addFormValidation(form);
    }
  });
}