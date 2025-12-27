/**
 * Lazy Loading Module
 * Implements lazy loading for images to improve page performance
 * Uses IntersectionObserver API with fallback for older browsers
 */

document.addEventListener('DOMContentLoaded', () => {
  const supportsIntersectionObserver = 'IntersectionObserver' in window;
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if (supportsIntersectionObserver) {
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src || lazyImage.src;
          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    }, {
      rootMargin: '200px',
      threshold: 0.01
    });

    lazyImages.forEach(lazyImage => {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(lazyImage => {
      lazyImage.src = lazyImage.dataset.src || lazyImage.src;
    });
  }
});