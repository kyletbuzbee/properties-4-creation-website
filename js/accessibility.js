// Accessibility Enhancements
document.addEventListener('DOMContentLoaded', () => {
  // Add ARIA attributes to interactive elements
  const buttons = document.querySelectorAll('button, [role="button"]');
  buttons.forEach(button => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Interactive button');
    }
  });

  // Add focus styles for keyboard navigation
  const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex="0"]');
  focusableElements.forEach(element => {
    element.addEventListener('focus', () => {
      element.style.outline = '2px solid var(--color-primary-gold)';
      element.style.outlineOffset = '2px';
    });

    element.addEventListener('blur', () => {
      element.style.outline = '';
      element.style.outlineOffset = '';
    });
  });

  // FAQ Accordion functionality
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((question, index) => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Close all FAQ items
      faqQuestions.forEach(q => {
        q.parentElement.classList.remove('active');
        q.setAttribute('aria-expanded', 'false');
      });

      // Open clicked FAQ item if it wasn't active
      if (!isActive) {
        faqItem.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
 
    // Add ARIA attributes with predictable IDs
    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('aria-controls', `faq-answer-${index + 1}`);
  });

  // Reduce motion for users who prefer it
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.body.classList.add('reduce-motion');
  }
  
  // Improve focus management for keyboard navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-navigation');
  
  if (menuToggle && mainNav) {
    // Focus trap for mobile menu
    const focusableElements = mainNav.querySelectorAll('a, button, input, select, textarea, [tabindex="0"]');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    mainNav.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && menuToggle.getAttribute('aria-expanded') === 'true') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  }
});