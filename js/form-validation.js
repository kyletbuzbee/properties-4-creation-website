/**
 * Form Validation Module
 * Handles client-side form validation with real-time feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

      inputs.forEach(input => {
        const errorMessage = input.nextElementSibling;

        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--color-semantic-error)';
          if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.textContent = 'This field is required';
          }
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          isValid = false;
          input.style.borderColor = 'var(--color-semantic-error)';
          if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.textContent = 'Please enter a valid email address';
          }
        } else {
          input.style.borderColor = '';
          if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.textContent = '';
          }
        }
      });

      if (isValid) {
        // Form is valid, simulate submission
        try {
          // In a real implementation, this would be an actual fetch call
          // For demo purposes, we'll simulate a successful submission
          showNotification('Form submitted successfully!', 'success');
          form.reset();

          // Scroll to top to see notification
          window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
          console.error('Form submission error:', error);
          showNotification(`Error: ${error.message}`, 'error');
        }
      } else {
        showNotification('Please fill in all required fields.', 'error');
      }
    });
  });
});

/**
 * Validates an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email is valid
 */
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}