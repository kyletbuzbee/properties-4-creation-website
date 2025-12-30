/**
 * Properties 4 Creations - Properties Filters Module
 * Handles property filtering functionality
 *
 * @fileoverview Provides property filtering logic for the properties page
 * @author Properties 4 Creations
 */

/**
 * Initialize property filters
 */
export function initPropertyFilters() {
  const searchInput = document.getElementById('property-search');
  const bedroomsSelect = document.getElementById('filter-bedrooms');
  const locationSelect = document.getElementById('filter-location');
  const noResults = document.getElementById('no-results');

  // Only run on pages with property filters
  if (!searchInput && !bedroomsSelect && !locationSelect) {
    return;
  }

  const propertyCards = document.querySelectorAll('.property-card');

  function filterProperties() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedBedrooms = bedroomsSelect ? bedroomsSelect.value : '';
    const selectedLocation = locationSelect ? locationSelect.value : '';

    let visibleCount = 0;

    propertyCards.forEach(card => {
      // Guard against missing elements
      const titleElement = card.querySelector('.property-title');
      const detailsElement = card.querySelector('.property-details');
      const tagElements = card.querySelectorAll('.tag');

      if (!titleElement || !detailsElement) {
        console.warn('Property card missing required elements:', card);
        return;
      }

      const title = titleElement.textContent.toLowerCase();
      const details = detailsElement.textContent.toLowerCase();
      const tags = Array.from(tagElements).map(tag => tag.textContent.toLowerCase());

      let matchesSearch = !searchTerm || title.includes(searchTerm) || details.includes(searchTerm) || tags.some(tag => tag.includes(searchTerm));
      let matchesBedrooms = !selectedBedrooms || details.includes(selectedBedrooms + ' br') || (selectedBedrooms === '4' && details.includes('4+ br'));
      let matchesLocation = !selectedLocation || title.includes(selectedLocation) || details.includes(selectedLocation);

      if (matchesSearch && matchesBedrooms && matchesLocation) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Show/hide no results message
    if (noResults) {
      noResults.style.display = visibleCount === 0 && (searchTerm || selectedBedrooms || selectedLocation) ? 'block' : 'none';
    }
  }

  // Add event listeners
  if (searchInput) searchInput.addEventListener('input', filterProperties);
  if (bedroomsSelect) bedroomsSelect.addEventListener('change', filterProperties);
  if (locationSelect) locationSelect.addEventListener('change', filterProperties);
}