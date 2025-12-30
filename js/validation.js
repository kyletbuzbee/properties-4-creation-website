/**
 * Properties 4 Creations - Form Validation Module
 * Handles form validation and submission logic
 *
 * @fileoverview Provides form validation utilities and submission handlers
 * @author Properties 4 Creations
 */

/**
 * Email validation
 * @param {string} email - The email address to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Phone validation (basic US phone number format)
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if phone is valid, false otherwise
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

/**
 * Validate a single field
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field The field to validate.
 * @param {boolean} showErrorMsg Whether to display the error message.
 * @returns {boolean} True if the field is valid, false otherwise.
 */
export function validateField(field, showErrorMsg = true) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  // Required field validation
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  }

  // Min length validation (only if value is not empty)
  if (isValid && field.hasAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'), 10)) {
    isValid = false;
    errorMessage = `Minimum ${field.getAttribute('minlength')} characters required`;
  }

  // Email validation (only if value is not empty)
  if (isValid && field.type === 'email' && value && !isValidEmail(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid email address';
  }

  // Phone validation (only if value is not empty)
  if (isValid && field.type === 'tel' && value && !isValidPhone(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid phone number';
  }

  // Checkbox validation
  if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
    isValid = false;
    errorMessage = 'You must agree to this';
  }

  if (!isValid && showErrorMsg) {
    showFieldError(field, errorMessage);
  } else {
    clearFieldError(field);
  }

  return isValid;
}

/**
 * Validate the entire form by checking each field.
 * @param {HTMLFormElement} form - The form element to validate
 * @param {boolean} [showErrors=true] - Whether to display error messages for invalid fields
 * @returns {boolean} True if the form is valid, false otherwise
 * @throws {Error} If form parameter is not a valid HTMLFormElement
 */
export function validateForm(form, showErrors = true) {
  if (!form || !(form instanceof HTMLFormElement)) {
    console.error('validateForm: Invalid form parameter');
    return false;
  }

  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isFormValid = true;
  
  try {
    for (const input of inputs) {
      if (!validateField(input, showErrors)) {
        isFormValid = false;
      }
    }
  } catch (error) {
    console.error('Error validating form:', error);
    return false;
  }
  
  return isFormValid;
}

/**
 * Show error for a specific field
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - The field to show error for
 * @param {string} message - The error message to display
 */
function showFieldError(field, message) {
  clearFieldError(field);

  field.classList.add('error');
  field.setAttribute('aria-invalid', 'true');

  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  errorDiv.setAttribute('role', 'alert');

  field.parentNode.appendChild(errorDiv);
}

/**
 * Clear error for a specific field
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - The field to clear error for
 */
function clearFieldError(field) {
  field.classList.remove('error');
  field.removeAttribute('aria-invalid');

  const errorDiv = field.parentNode.querySelector('.field-error');
  if (errorDiv) {
    errorDiv.remove();
  }
}

/**
 * Show success message within the context of a form
 * @param {HTMLFormElement} form - The form to show success for
 * @param {string} message - The success message to display
 */
export function showSuccess(form, message) {
  const successMessageDiv = form.parentNode.querySelector('.success-message');

  if (successMessageDiv) {
    // Clear any previous general error message for this form
    const existingErrorDiv = form.parentNode.querySelector('.form-general-error');
    if (existingErrorDiv) {
      existingErrorDiv.remove();
    }

    successMessageDiv.innerHTML = `<h3>${message}</h3>`;
    successMessageDiv.style.display = 'block';
    successMessageDiv.setAttribute('aria-hidden', 'false');

    // Hide after 5 seconds
    setTimeout(() => {
      successMessageDiv.style.display = 'none';
      successMessageDiv.setAttribute('aria-hidden', 'true');
      successMessageDiv.innerHTML = '';
    }, 5000);
  } else {
    // Fallback if no specific div is found (current implementation)
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.setAttribute('role', 'alert');
    successDiv.setAttribute('aria-live', 'polite');
    form.parentNode.insertBefore(successDiv, form.nextSibling);

    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.remove();
      }
    }, 5000);
  }
}

/**
 * Show error message before a specific form
 * @param {HTMLFormElement} form - The form to show error for
 * @param {string} message - The error message to display
 */
export function showError(form, message) {
  // Clear any existing general error message for this form
  const existingErrorDiv = form.parentNode.querySelector('.form-general-error');
  if (existingErrorDiv) {
    existingErrorDiv.remove();
  }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message form-general-error'; // Add a specific class to identify it
  errorDiv.textContent = message;
  errorDiv.setAttribute('role', 'alert');
  errorDiv.setAttribute('aria-live', 'assertive');

  // Style the error message (keep existing inline style for now)
  errorDiv.style.cssText = `
    background: var(--color-semantic-error);
    color: var(--color-neutral-white);
    padding: var(--spacing-4);
    border-radius: 0.5rem;
    margin: var(--spacing-4) 0;
    text-align: center;
  `;

  form.parentNode.insertBefore(errorDiv, form); // Insert before the form

  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
}

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} Sanitized input string
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Handle application form submission
 * @param {Event} e - The form submission event
 */
export async function handleApplicationSubmit(e) {
  e.preventDefault();
  const form = e.target;

  if (!validateForm(form)) {
    showError(form, 'Please correct the errors before submitting.');
    return;
  }

  const formData = new FormData(form);
  const formspreeUrl = form.action;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : 'Submit Application';

  if (submitButton) {
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('btn-loading');
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';
  }

  try {
    // Input sanitization
    const sanitizedData = new FormData();
    for (const [key, value] of formData.entries()) {
      sanitizedData.append(key, sanitizeInput(value));
    }

    const response = await fetch(formspreeUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: sanitizedData
    });

    if (response.ok) {
      showSuccess(form, 'Application Submitted Successfully! Thank you! We will contact you within 24 hours.');
      form.reset();
      // After resetting, re-disable the submit button
      if (submitButton) {
        submitButton.disabled = true;
      }
    } else {
      let errorMessage = 'There was an issue submitting your application. Please try again.';
      try {
        const errorData = await response.json();
        if (errorData && errorData.errors) {
          errorMessage = `Submission failed: ${errorData.errors.map(err => err.message).join(', ')}`;
        } else if (errorData && errorData.error) {
          errorMessage = `Submission failed: ${errorData.error}`;
        }
      } catch (jsonError) {
        console.warn('Could not parse error response as JSON:', jsonError);
      }
      showError(form, errorMessage);
    }
  } catch (error) {
    console.error('Network error submitting application:', error);
    showError(form, 'Network error. Please check your internet connection and try again.');
  } finally {
    if (submitButton) {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      submitButton.classList.remove('btn-loading');
      submitButton.innerHTML = originalButtonText;
    }
  }
}

/**
 * Handle contact form submission
 * @param {Event} e - The form submission event
 */
export async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;

  if (!validateForm(form)) {
    showError(form, 'Please correct the errors before submitting.');
    return;
  }

  const formData = new FormData(form);
  const formspreeUrl = form.action;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : 'Send Message';

  if (submitButton) {
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('btn-loading');
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';
  }

  try {
    // Input sanitization
    const sanitizedData = new FormData();
    for (const [key, value] of formData.entries()) {
      sanitizedData.append(key, sanitizeInput(value));
    }

    const response = await fetch(formspreeUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: sanitizedData
    });

    if (response.ok) {
      showSuccess(form, 'Message Sent Successfully! Thank you! We will respond within 24 hours.');
      form.reset();
      // After resetting, re-disable the submit button
      if (submitButton) {
        submitButton.disabled = true;
      }
    } else {
      let errorMessage = 'There was an issue sending your message. Please try again.';
      try {
        const errorData = await response.json();
        if (errorData && errorData.errors) {
          errorMessage = `Submission failed: ${errorData.errors.map(err => err.message).join(', ')}`;
        } else if (errorData && errorData.error) {
          errorMessage = `Submission failed: ${errorData.error}`;
        }
      } catch (jsonError) {
        console.warn('Could not parse error response as JSON:', jsonError);
      }
      showError(form, errorMessage);
    }
  } catch (error) {
    console.error('Network error submitting contact form:', error);
    showError(form, 'Network error. Please check your internet connection and try again.');
  } finally {
    if (submitButton) {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      submitButton.classList.remove('btn-loading');
      submitButton.innerHTML = originalButtonText;
    }
  }
}

/**
 * Add real-time form validation and manage submit button state
 * @param {HTMLFormElement} form - The form to add validation to
 */
export function addFormValidation(form) {
  const inputs = form.querySelectorAll('input, select, textarea');
  const submitButton = form.querySelector('button[type="submit"]');

  inputs.forEach(input => {
    // Real-time validation on blur to show errors
    input.addEventListener('blur', () => {
      validateField(input);
    });

    // On input, clear the specific field's error and check form validity to update button state
    input.addEventListener('input', () => {
      clearFieldError(input);
      if (submitButton) {
        // Check all fields to see if the form is now valid
        const isFormValid = validateForm(form, false); // Pass false to prevent showing new errors on every keystroke
        submitButton.disabled = !isFormValid;
      }
    });
  });
}

/**
 * Set minimum date for move-in date field (7 days from today)
 */
export function setMinimumMoveInDate() {
  const moveDateInput = document.getElementById('move-date');
  if (moveDateInput) {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 7);

    // Format as YYYY-MM-DD
    const formattedDate = minDate.toISOString().split('T')[0];
    moveDateInput.setAttribute('min', formattedDate);
  }
}