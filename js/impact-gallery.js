// Properties 4 Creations - Impact Gallery
// Handles before/after comparison sliders on the impact page

document.addEventListener('DOMContentLoaded', function () {
    // Initialize comparison sliders for the gallery items
    const sliders = document.querySelectorAll('.comparison-slider');

    sliders.forEach(slider => {
        const beforeSrc = slider.dataset.before;
        const afterSrc = slider.dataset.after;

        if (beforeSrc && afterSrc) {
            // Create the slider structure
            slider.innerHTML = `
        <img src="${beforeSrc}" alt="Before renovation" class="before-image" style="display: block;">
        <div class="slider-overlay" style="background-image: url('${afterSrc}')"></div>
        <div class="slider-handle" role="slider" aria-label="Adjust before/after comparison" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0">
          <div class="slider-handle-button" aria-label="Drag to compare images"></div>
        </div>
        <div class="slider-label before-label">Before</div>
        <div class="slider-label after-label">After</div>
      `;

            // Add event listeners
            const handle = slider.querySelector('.slider-handle');
            const overlay = slider.querySelector('.slider-overlay');
            let isDragging = false;
            let sliderPosition = 50;

            function updateSlider(position) {
                overlay.style.width = `${position}%`;
                handle.style.left = `${position}%`;
                handle.setAttribute('aria-valuenow', Math.round(position));
            }

            function handleInteraction(e) {
                const rect = slider.getBoundingClientRect();
                const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
                const x = clientX - rect.left;
                const percentage = (x / rect.width) * 100;
                sliderPosition = Math.max(0, Math.min(100, percentage));
                updateSlider(sliderPosition);
            }

            // Mouse events
            handle.addEventListener('mousedown', (e) => {
                isDragging = true;
                handle.style.cursor = 'grabbing';
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) handleInteraction(e);
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                handle.style.cursor = 'ew-resize';
            });

            // Touch events
            handle.addEventListener('touchstart', (e) => {
                isDragging = true;
                e.preventDefault();
            });

            document.addEventListener('touchmove', (e) => {
                if (isDragging) handleInteraction(e);
            });

            document.addEventListener('touchend', () => {
                isDragging = false;
            });

            // Keyboard navigation
            handle.addEventListener('keydown', (e) => {
                const step = 5;
                if (e.key === 'ArrowLeft') {
                    sliderPosition = Math.max(0, sliderPosition - step);
                    updateSlider(sliderPosition);
                    e.preventDefault();
                } else if (e.key === 'ArrowRight') {
                    sliderPosition = Math.min(100, sliderPosition + step);
                    updateSlider(sliderPosition);
                    e.preventDefault();
                }
            });

            // Initialize position
            updateSlider(sliderPosition);
        }
    });
});