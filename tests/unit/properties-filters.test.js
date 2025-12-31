/**
 * Properties 4 Creations - Properties Filters Unit Tests
 * Comprehensive tests for property filtering functionality
 */

describe('Properties Filters Module', () => {
  let searchInput;
  let bedroomsSelect;
  let locationSelect;
  let noResultsMessage;
  let propertyCards;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Create filter elements
    searchInput = document.createElement('input');
    searchInput.id = 'property-search';
    searchInput.type = 'text';
    searchInput.placeholder = 'Search properties...';
    
    bedroomsSelect = document.createElement('select');
    bedroomsSelect.id = 'filter-bedrooms';
    bedroomsSelect.innerHTML = `
      <option value="">All Bedrooms</option>
      <option value="1">1 Bedroom</option>
      <option value="2">2 Bedrooms</option>
      <option value="3">3 Bedrooms</option>
      <option value="4">4+ Bedrooms</option>
    `;
    
    locationSelect = document.createElement('select');
    locationSelect.id = 'filter-location';
    locationSelect.innerHTML = `
      <option value="">All Locations</option>
      <option value="Tyler">Tyler</option>
      <option value="Longview">Longview</option>
      <option value="Marshall">Marshall</option>
    `;
    
    noResultsMessage = document.createElement('div');
    noResultsMessage.id = 'no-results';
    noResultsMessage.textContent = 'No properties found matching your criteria.';
    noResultsMessage.style.display = 'none';
    
    // Create property cards
    propertyCards = [];
    const properties = [
      { title: 'Jefferson Riverfront', details: '3 br, 2 ba - Tyler', tags: ['Family Home', 'River View'] },
      { title: 'Kemp Townhome', details: '2 br, 1 ba - Longview', tags: ['Townhome', 'Affordable'] },
      { title: 'Longview Victorian', details: '4+ br, 3 ba - Longview', tags: ['Historic', 'Large'] },
      { title: 'Marshall Farmhouse', details: '3 br, 2 ba - Marshall', tags: ['Country', 'Renovated'] },
      { title: 'Mineola Studio', details: '1 br, 1 ba - Mineola', tags: ['Studio', 'Modern'] }
    ];
    
    properties.forEach((prop, index) => {
      const card = document.createElement('div');
      card.className = 'property-card';
      card.innerHTML = `
        <h3 class="property-title">${prop.title}</h3>
        <p class="property-details">${prop.details}</p>
        <div class="property-tags">
          ${prop.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      `;
      propertyCards.push(card);
      document.body.appendChild(card);
    });
    
    // Add filter elements to DOM
    document.body.appendChild(searchInput);
    document.body.appendChild(bedroomsSelect);
    document.body.appendChild(locationSelect);
    document.body.appendChild(noResultsMessage);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Filter Initialization', () => {
    test('should initialize property filters when elements are present', () => {
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      
      // Mock console.warn to capture warnings
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      initPropertyFilters();
      
      // Should not warn about missing elements
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    test('should not initialize when filter elements are missing', () => {
      // Remove filter elements
      searchInput.remove();
      bedroomsSelect.remove();
      locationSelect.remove();
      
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      
      // Should not throw error and should return early
      expect(() => initPropertyFilters()).not.toThrow();
    });

    test('should handle missing no-results element gracefully', () => {
      noResultsMessage.remove();
      
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      
      // Should not throw error
      expect(() => initPropertyFilters()).not.toThrow();
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      initPropertyFilters();
    });

    test('should filter properties by title search', () => {
      searchInput.value = 'Jefferson';
      searchInput.dispatchEvent(new Event('input'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      expect(visibleCards[0].querySelector('.property-title').textContent).toBe('Jefferson Riverfront');
    });

    test('should filter properties by details search', () => {
      searchInput.value = 'Tyler';
      searchInput.dispatchEvent(new Event('input'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      expect(visibleCards[0].querySelector('.property-title').textContent).toBe('Jefferson Riverfront');
    });

    test('should filter properties by tag search', () => {
      searchInput.value = 'Historic';
      searchInput.dispatchEvent(new Event('input'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      expect(visibleCards[0].querySelector('.property-title').textContent).toBe('Longview Victorian');
    });

    test('should be case insensitive', () => {
      searchInput.value = 'jEfFeRsOn';
      searchInput.dispatchEvent(new Event('input'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      expect(visibleCards[0].querySelector('.property-title').textContent).toBe('Jefferson Riverfront');
    });

    test('should show all properties when search is cleared', () => {
      // First filter something
      searchInput.value = 'Jefferson';
      searchInput.dispatchEvent(new Event('input'));
      
      let visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      
      // Clear search
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      
      visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(5);
    });

    test('should handle empty search term', () => {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(5);
    });
  });

  describe('Bedrooms Filter', () => {
    beforeEach(() => {
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      initPropertyFilters();
    });

    test('should filter by 1 bedroom', () => {
      bedroomsSelect.value = '1';
      bedroomsSelect.dispatchEvent(new Event('change'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      expect(visibleCards[0].querySelector('.property-title').textContent).toBe('Mineola Studio');
    });

    test('should filter by 2 bedrooms', () => {
      bedroomsSelect.value = '2';
      bedroomsSelect.dispatchEvent(new Event('change'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      expect(visibleCards[0].querySelector('.property-title').textContent).toBe('Kemp Townhome');
    });

    test('should filter by 3 bedrooms', () => {
      bedroomsSelect.value = '3';
      bedroomsSelect.dispatchEvent(new Event('change'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(2);
      
      const titles = Array.from(visibleCards).map(card => 
        card.querySelector('.property-title').textContent
      );
      expect(titles).toContain('Jefferson Riverfront');
      expect(titles).toContain('Marshall Farmhouse');
    });

    test('should filter by 4+ bedrooms', () => {
      bedroomsSelect.value = '4';
      bedroomsSelect.dispatchEvent(new Event('change'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      expect(visibleCards[0].querySelector('.property-title').textContent).toBe('Longview Victorian');
    });

    test('should show all properties when bedrooms filter is cleared', () => {
      bedroomsSelect.value = '3';
      bedroomsSelect.dispatchEvent(new Event('change'));
      
      let visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(2);
      
      bedroomsSelect.value = '';
      bedroomsSelect.dispatchEvent(new Event('change'));
      
      visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(5);
    });
  });

  describe('Location Filter', () => {
    beforeEach(() => {
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      initPropertyFilters();
    });

    test('should filter by Tyler', () => {
      locationSelect.value = 'Tyler';
      locationSelect.dispatchEvent(new Event('change'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      expect(visibleCards[0].querySelector('.property-title').textContent).toBe('Jefferson Riverfront');
    });

    test('should filter by Longview', () => {
      locationSelect.value = 'Longview';
      locationSelect.dispatchEvent(new Event('change'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(2);
      
      const titles = Array.from(visibleCards).map(card => 
        card.querySelector('.property-title').textContent
      );
      expect(titles).toContain('Kemp Townhome');
      expect(titles).toContain('Longview Victorian');
    });

    test('should filter by Marshall', () => {
      locationSelect.value = 'Marshall';
      locationSelect.dispatchEvent(new Event('change'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      expect(visibleCards[0].querySelector('.property-title').textContent).toBe('Marshall Farmhouse');
    });

    test('should show all properties when location filter is cleared', () => {
      locationSelect.value = 'Longview';
      locationSelect.dispatchEvent(new Event('change'));
      
      let visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(2);
      
      locationSelect.value = '';
      locationSelect.dispatchEvent(new Event('change'));
      
      visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(5);
    });
  });

  describe('Combined Filtering', () => {
    beforeEach(() => {
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      initPropertyFilters();
    });

    test('should combine search and bedrooms filter', () => {
      searchInput.value = 'Longview';
      searchInput.dispatchEvent(new Event('input'));
      
      bedroomsSelect.value = '2';
      bedroomsSelect.dispatchEvent(new Event('change'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      expect(visibleCards[0].querySelector('.property-title').textContent).toBe('Kemp Townhome');
    });

    test('should combine search and location filter', () => {
      searchInput.value = 'Historic';
      searchInput.dispatchEvent(new Event('input'));
      
      locationSelect.value = 'Longview';
      locationSelect.dispatchEvent(new Event('change'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      expect(visibleCards[0].querySelector('.property-title').textContent).toBe('Longview Victorian');
    });

    test('should combine all three filters', () => {
      searchInput.value = 'Farmhouse';
      searchInput.dispatchEvent(new Event('input'));
      
      bedroomsSelect.value = '3';
      bedroomsSelect.dispatchEvent(new Event('change'));
      
      locationSelect.value = 'Marshall';
      locationSelect.dispatchEvent(new Event('change'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      expect(visibleCards[0].querySelector('.property-title').textContent).toBe('Marshall Farmhouse');
    });

    test('should show no results when no properties match all filters', () => {
      searchInput.value = 'Nonexistent';
      searchInput.dispatchEvent(new Event('input'));
      
      bedroomsSelect.value = '1';
      bedroomsSelect.dispatchEvent(new Event('change'));
      
      locationSelect.value = 'Tyler';
      locationSelect.dispatchEvent(new Event('change'));
      
      const visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(0);
      expect(noResultsMessage.style.display).toBe('block');
    });
  });

  describe('No Results Message', () => {
    beforeEach(() => {
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      initPropertyFilters();
    });

    test('should show no results message when search yields no matches', () => {
      searchInput.value = 'Nonexistent Property';
      searchInput.dispatchEvent(new Event('input'));
      
      expect(noResultsMessage.style.display).toBe('block');
    });

    test('should hide no results message when properties are found', () => {
      searchInput.value = 'Nonexistent Property';
      searchInput.dispatchEvent(new Event('input'));
      expect(noResultsMessage.style.display).toBe('block');
      
      searchInput.value = 'Jefferson';
      searchInput.dispatchEvent(new Event('input'));
      
      expect(noResultsMessage.style.display).toBe('none');
    });

    test('should show no results message only when filters are active', () => {
      // No filters active
      expect(noResultsMessage.style.display).toBe('none');
      
      // Apply filter with no results
      searchInput.value = 'Nonexistent';
      searchInput.dispatchEvent(new Event('input'));
      
      expect(noResultsMessage.style.display).toBe('block');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing property card elements gracefully', () => {
      // Remove some property card elements
      const firstCard = document.querySelector('.property-card');
      const titleElement = firstCard.querySelector('.property-title');
      titleElement.remove();
      
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      
      // Should not throw error
      expect(() => initPropertyFilters()).not.toThrow();
    });

    test('should handle malformed property card structure', () => {
      // Create a malformed card
      const malformedCard = document.createElement('div');
      malformedCard.className = 'property-card';
      // Missing title and details elements
      document.body.appendChild(malformedCard);
      
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      
      // Should not throw error
      expect(() => initPropertyFilters()).not.toThrow();
    });

    test('should handle missing filter elements gracefully', () => {
      searchInput.remove();
      
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      
      // Should not throw error
      expect(() => initPropertyFilters()).not.toThrow();
    });

    test('should handle console warnings for missing elements', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Create card without required elements
      const incompleteCard = document.createElement('div');
      incompleteCard.className = 'property-card';
      // Only add title, missing details
      const title = document.createElement('h3');
      title.className = 'property-title';
      title.textContent = 'Incomplete Property';
      incompleteCard.appendChild(title);
      document.body.appendChild(incompleteCard);
      
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      initPropertyFilters();
      
      expect(consoleSpy).toHaveBeenCalledWith('Property card missing required elements:', expect.any(HTMLElement));
      
      consoleSpy.mockRestore();
    });
  });

  describe('Filter State Management', () => {
    beforeEach(() => {
      const { initPropertyFilters } = require('../../js/properties-filters.js');
      initPropertyFilters();
    });

    test('should maintain filter state across multiple operations', () => {
      // Apply multiple filters
      searchInput.value = 'Longview';
      searchInput.dispatchEvent(new Event('input'));
      
      bedroomsSelect.value = '2';
      bedroomsSelect.dispatchEvent(new Event('change'));
      
      // Verify both filters are active
      let visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      expect(visibleCards[0].querySelector('.property-title').textContent).toBe('Kemp Townhome');
      
      // Change one filter
      bedroomsSelect.value = '3';
      bedroomsSelect.dispatchEvent(new Event('change'));
      
      // Should update based on new combination
      visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(0);
      expect(noResultsMessage.style.display).toBe('block');
    });

    test('should reset filters properly', () => {
      // Apply all filters
      searchInput.value = 'Jefferson';
      searchInput.dispatchEvent(new Event('input'));
      
      bedroomsSelect.value = '3';
      bedroomsSelect.dispatchEvent(new Event('change'));
      
      locationSelect.value = 'Tyler';
      locationSelect.dispatchEvent(new Event('change'));
      
      let visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(1);
      
      // Reset all filters
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      
      bedroomsSelect.value = '';
      bedroomsSelect.dispatchEvent(new Event('change'));
      
      locationSelect.value = '';
      locationSelect.dispatchEvent(new Event('change'));
      
      visibleCards = document.querySelectorAll('.property-card[style*="display: block"]');
      expect(visibleCards.length).toBe(5);
      expect(noResultsMessage.style.display).toBe('none');
    });
  });
});