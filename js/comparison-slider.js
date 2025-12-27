// Comparison Slider Functionality
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.comparison-slider');

  sliders.forEach(slider => {
    const container = slider.querySelector('.comparison-container');
    const handle = slider.querySelector('.comparison-handle');
    const beforeImg = slider.querySelector('.comparison-before');
    const afterImg = slider.querySelector('.comparison-after');

    let isDragging = false;

    // Set initial position
    let position = 50;
    updateSlider(position);

    // Mouse events
    handle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    // Touch events
    handle.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDrag);

    function startDrag(e) {
      e.preventDefault();
      isDragging = true;
    }

    function drag(e) {
      if (!isDragging) return;

      const rect = container.getBoundingClientRect();
      const clientX = e.clientX || e.touches[0].clientX;
      let newPosition = ((clientX - rect.left) / rect.width) * 100;

      // Constrain position between 0 and 100
      newPosition = Math.max(0, Math.min(100, newPosition));

      updateSlider(newPosition);
    }

    function stopDrag() {
      isDragging = false;
    }

    function updateSlider(pos) {
      position = pos;
      handle.style.left = position + '%';
      afterImg.style.clipPath = `inset(0 0 0 ${position}%)`;
    }
  });
});