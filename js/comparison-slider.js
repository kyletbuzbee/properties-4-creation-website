// Properties 4 Creations - Comparison Slider
// Handles before/after image comparison functionality

document.addEventListener('DOMContentLoaded', () => {
  initializeComparisonSliders();
});

/**
 * Initialize all comparison sliders on the page
 */
function initializeComparisonSliders() {
  const sliders = document.querySelectorAll('.comparison-slider');

  sliders.forEach((slider, index) => {
    createComparisonSlider(slider, index);
  });
}

/**
 * Create a comparison slider for a given container
 */
function createComparisonSlider(container, index) {
  const beforeImage = container.querySelector('.before-image');
  const afterImage = container.querySelector('.after-image');

  if (!beforeImage || !afterImage) {
    console.warn('Comparison slider missing before or after image');
    return;
  }

  // Create slider handle
  const handle = document.createElement('div');
  handle.className = 'slider-handle';
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-label', 'Adjust before/after comparison');
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('aria-valuenow', '50');
  handle.setAttribute('tabindex', '0');

  // Create handle button for better accessibility
  const handleButton = document.createElement('button');
  handleButton.className = 'slider-handle-button';
  handleButton.setAttribute('aria-label', 'Drag to compare before and after images');
  handle.appendChild(handleButton);

  // Set up the overlay structure
  const overlay = document.createElement('div');
  overlay.className = 'slider-overlay';
  overlay.style.backgroundImage = `url(${afterImage.src})`;

  // Position images
  container.style.position = 'relative';
  beforeImage.style.position = 'absolute';
  beforeImage.style.top = '0';
  beforeImage.style.left = '0';
  beforeImage.style.width = '100%';
  beforeImage.style.height = '100%';
  beforeImage.style.objectFit = 'cover';

  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '50%';
  overlay.style.height = '100%';
  overlay.style.backgroundSize = 'cover';
  overlay.style.backgroundPosition = 'center';
  overlay.style.backgroundRepeat = 'no-repeat';

  handle.style.position = 'absolute';
  handle.style.top = '50%';
  handle.style.left = '50%';
  handle.style.transform = 'translate(-50%, -50%)';
  handle.style.zIndex = '10';
  handle.style.cursor = 'ew-resize';

  // Add elements to container
  container.appendChild(overlay);
  container.appendChild(handle);

  // Initialize slider position
  let sliderPosition = 50; // percentage
  updateSlider(sliderPosition, container, overlay, handle);

  // Mouse events
  let isDragging = false;

  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    handle.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    sliderPosition = Math.max(0, Math.min(100, percentage));
    updateSlider(sliderPosition, container, overlay, handle);
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      handle.style.cursor = 'ew-resize';
    }
  });

  // Touch events for mobile
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    sliderPosition = Math.max(0, Math.min(100, percentage));
    updateSlider(sliderPosition, container, overlay, handle);
  });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Keyboard navigation
  handle.addEventListener('keydown', (e) => {
    const step = 5; // 5% steps

    switch (e.key) {
      case 'ArrowLeft':
        sliderPosition = Math.max(0, sliderPosition - step);
        updateSlider(sliderPosition, container, overlay, handle);
        e.preventDefault();
        break;
      case 'ArrowRight':
        sliderPosition = Math.min(100, sliderPosition + step);
        updateSlider(sliderPosition, container, overlay, handle);
        e.preventDefault();
        break;
      case 'Home':
        sliderPosition = 0;
        updateSlider(sliderPosition, container, overlay, handle);
        e.preventDefault();
        break;
      case 'End':
        sliderPosition = 100;
        updateSlider(sliderPosition, container, overlay, handle);
        e.preventDefault();
        break;
    }
  });

  // Add labels for accessibility
  const beforeLabel = document.createElement('div');
  beforeLabel.className = 'slider-label before-label';
  beforeLabel.textContent = 'Before';
  beforeLabel.setAttribute('aria-hidden', 'true');

  const afterLabel = document.createElement('div');
  afterLabel.className = 'slider-label after-label';
  afterLabel.textContent = 'After';
  afterLabel.setAttribute('aria-hidden', 'true');

  container.appendChild(beforeLabel);
  container.appendChild(afterLabel);
}

/**
 * Update slider position
 */
function updateSlider(position, container, overlay, handle) {
  // Update overlay width
  overlay.style.width = `${position}%`;

  // Update handle position
  handle.style.left = `${position}%`;

  // Update ARIA attributes
  handle.setAttribute('aria-valuenow', Math.round(position));

  // Update background position for smooth image transition
  overlay.style.backgroundPosition = `${100 - position}% center`;
}

/**
 * Create a simple static comparison (fallback for browsers without JS)
 */
function createStaticComparison(container) {
  const beforeImage = container.querySelector('.before-image');
  const afterImage = container.querySelector('.after-image');

  if (!beforeImage || !afterImage) return;

  // Create a simple side-by-side layout
  container.style.display = 'flex';

  beforeImage.style.flex = '1';
  beforeImage.style.objectFit = 'cover';
  beforeImage.style.height = '300px';

  afterImage.style.flex = '1';
  afterImage.style.objectFit = 'cover';
  afterImage.style.height = '300px';

  // Add labels
  const beforeLabel = document.createElement('div');
  beforeLabel.textContent = 'Before';
  beforeLabel.style.textAlign = 'center';
  beforeLabel.style.padding = '0.5rem';
  beforeLabel.style.fontWeight = 'bold';

  const afterLabel = document.createElement('div');
  afterLabel.textContent = 'After';
  afterLabel.style.textAlign = 'center';
  afterLabel.style.padding = '0.5rem';
  afterLabel.style.fontWeight = 'bold';

  container.insertBefore(beforeLabel, beforeImage);
  container.appendChild(afterLabel);
}

// Export for potential use by other scripts
window.comparisonSlider = {
  initialize: initializeComparisonSliders,
  create: createComparisonSlider
};
