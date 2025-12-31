/**
 * Properties 4 Creations - Performance Module Unit Tests
 * Comprehensive tests for performance optimizations and monitoring
 */

// Mock PerformanceObserver
global.PerformanceObserver = class PerformanceObserver {
  constructor(callback) {
    this.callback = callback;
    this.entries = [];
  }

  observe(options) {
    this.options = options;
    // Simulate some performance entries for testing
    if (options.type === 'largest-contentful-paint') {
      this.simulateLCPEntry();
    } else if (options.type === 'layout-shift') {
      this.simulateCLSEntries();
    } else if (options.type === 'first-input') {
      this.simulateFIDEntry();
    }
  }

  disconnect() {
    this.options = null;
  }

  simulateLCPEntry() {
    // Simulate LCP entry
    const mockEntry = {
      startTime: 1500,
      value: 1500,
      size: 1000000
    };
    
    if (this.callback) {
      this.callback({
        getEntries: () => [mockEntry]
      });
    }
  }

  simulateCLSEntries() {
    // Simulate CLS entries
    const mockEntries = [
      { value: 0.1, hadRecentInput: false },
      { value: 0.05, hadRecentInput: false },
      { value: 0.02, hadRecentInput: true } // Should be ignored
    ];
    
    if (this.callback) {
      this.callback({
        getEntries: () => mockEntries
      });
    }
  }

  simulateFIDEntry() {
    // Simulate FID entry
    const mockEntry = {
      startTime: 100,
      processingStart: 150,
      duration: 50
    };
    
    if (this.callback) {
      this.callback({
        getEntries: () => [mockEntry]
      });
    }
  }
};

// Mock window.performance
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    timing: {
      navigationStart: 0,
      loadEventEnd: 2000,
      domContentLoadedEventEnd: 1500
    }
  }
});

// Mock dataLayer
window.dataLayer = [];

describe('Performance Module', () => {
  beforeEach(() => {
    // Reset dataLayer
    window.dataLayer = [];
    
    // Clear any existing performance metrics
    if (window.performanceMetrics) {
      delete window.performanceMetrics;
    }
    
    // Reset document head
    document.head.innerHTML = '';
  });

  describe('Performance Monitoring Initialization', () => {
    test('should initialize performance monitoring when PerformanceObserver is supported', () => {
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      
      initPerformanceMonitoring();
      
      // Should create PerformanceObserver instances
      expect(PerformanceObserver).toHaveBeenCalled();
      
      // Should set navigation timing metrics
      expect(window.performanceMetrics).toBeDefined();
      expect(window.performanceMetrics.navigationTiming).toBeDefined();
      expect(window.performanceMetrics.navigationTiming.loadTime).toBe(2000);
      expect(window.performanceMetrics.navigationTiming.domReady).toBe(1500);
    });

    test('should handle LCP monitoring', () => {
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      
      initPerformanceMonitoring();
      
      // Check that LCP was recorded
      expect(window.performanceMetrics.lcp).toBe(1500);
    });

    test('should handle CLS monitoring', () => {
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      
      initPerformanceMonitoring();
      
      // CLS should be sum of entries without recent input
      expect(window.performanceMetrics.cls).toBe(0.15); // 0.1 + 0.05
    });

    test('should handle FID monitoring', () => {
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      
      initPerformanceMonitoring();
      
      // FID should be processingStart - startTime
      expect(window.performanceMetrics.fid).toBe(50);
    });

    test('should send metrics to dataLayer when available', () => {
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      
      initPerformanceMonitoring();
      
      // Check that metrics were sent to dataLayer
      expect(window.dataLayer.length).toBeGreaterThan(0);
      
      const lcpEvent = window.dataLayer.find(event => event.metricType === 'LCP');
      const clsEvent = window.dataLayer.find(event => event.metricType === 'CLS');
      const fidEvent = window.dataLayer.find(event => event.metricType === 'FID');
      
      expect(lcpEvent).toBeDefined();
      expect(clsEvent).toBeDefined();
      expect(fidEvent).toBeDefined();
    });

    test('should handle PerformanceObserver errors gracefully', () => {
      // Mock PerformanceObserver to throw error
      global.PerformanceObserver = jest.fn(() => {
        throw new Error('PerformanceObserver not supported');
      });
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      initPerformanceMonitoring();
      
      expect(consoleSpy).toHaveBeenCalledWith('LCP monitoring failed:', expect.any(Error));
      expect(consoleSpy).toHaveBeenCalledWith('CLS monitoring failed:', expect.any(Error));
      expect(consoleSpy).toHaveBeenCalledWith('FID monitoring failed:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    test('should disable monitoring when PerformanceObserver is not supported', () => {
      // Temporarily remove PerformanceObserver
      delete global.PerformanceObserver;
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      initPerformanceMonitoring();
      
      expect(consoleSpy).toHaveBeenCalledWith('PerformanceObserver not supported, performance monitoring disabled');
      
      consoleSpy.mockRestore();
      
      // Restore PerformanceObserver
      global.PerformanceObserver = class PerformanceObserver {};
    });
  });

  describe('Lazy Loading Initialization', () => {
    beforeEach(() => {
      // Create mock images
      const img1 = document.createElement('img');
      img1.loading = 'lazy';
      img1.src = 'test1.jpg';
      
      const img2 = document.createElement('img');
      img2.loading = 'lazy';
      img2.src = 'test2.jpg';
      
      document.body.appendChild(img1);
      document.body.appendChild(img2);
    });

    test('should initialize lazy loading when IntersectionObserver is supported', () => {
      // Mock IntersectionObserver
      global.IntersectionObserver = class IntersectionObserver {
        constructor(callback) {
          this.callback = callback;
          this.observedElements = [];
        }
        
        observe(element) {
          this.observedElements.push(element);
          
          // Simulate intersection immediately for testing
          setTimeout(() => {
            this.callback([{
              isIntersecting: true,
              target: element
            }]);
          }, 0);
        }
        
        unobserve() {}
      };
      
      const { initLazyLoading } = require('../../js/performance.js');
      
      return new Promise((resolve) => {
        initLazyLoading();
        
        setTimeout(() => {
          const images = document.querySelectorAll('img[loading="lazy"]');
          images.forEach(img => {
            expect(img.classList.contains('loaded')).toBe(true);
          });
          resolve();
        }, 100);
      });
    });

    test('should handle lazy loading fallback when IntersectionObserver is not supported', () => {
      // Temporarily remove IntersectionObserver
      delete global.IntersectionObserver;
      
      const { initLazyLoading } = require('../../js/performance.js');
      initLazyLoading();
      
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        expect(img.classList.contains('loaded')).toBe(true);
      });
      
      // Restore IntersectionObserver
      global.IntersectionObserver = class IntersectionObserver {};
    });
  });

  describe('Performance Optimizations', () => {
    test('should preload critical resources', () => {
      const { initPerformanceOptimizations } = require('../../js/performance.js');
      
      initPerformanceOptimizations();
      
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      expect(preloadLinks.length).toBeGreaterThan(0);
      
      // Check that logo is preloaded
      const logoPreload = Array.from(preloadLinks).find(link => 
        link.href.includes('brand-logo.svg')
      );
      expect(logoPreload).toBeDefined();
      expect(logoPreload.as).toBe('image');
    });

    test('should add resource hints for external domains', () => {
      const { initPerformanceOptimizations } = require('../../js/performance.js');
      
      initPerformanceOptimizations();
      
      const dnsPrefetchLinks = document.querySelectorAll('link[rel="dns-prefetch"]');
      expect(dnsPrefetchLinks.length).toBeGreaterThan(0);
      
      // Check that Google Fonts domains are prefetched
      const googleFontsPrefetch = Array.from(dnsPrefetchLinks).find(link => 
        link.href.includes('fonts.googleapis.com') || link.href.includes('fonts.gstatic.com')
      );
      expect(googleFontsPrefetch).toBeDefined();
    });

    test('should optimize scroll performance', () => {
      const { initPerformanceOptimizations } = require('../../js/performance.js');
      
      // Mock requestAnimationFrame
      global.requestAnimationFrame = jest.fn((callback) => {
        callback();
        return 1;
      });
      
      initPerformanceOptimizations();
      
      // Simulate scroll event
      const scrollEvent = new Event('scroll');
      window.dispatchEvent(scrollEvent);
      
      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Performance Metrics Access', () => {
    beforeEach(() => {
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      initPerformanceMonitoring();
    });

    test('should expose metrics globally for debugging', () => {
      expect(window.performanceMetrics).toBeDefined();
      expect(typeof window.performanceMetrics.lcp).toBe('number');
      expect(typeof window.performanceMetrics.cls).toBe('number');
      expect(typeof window.performanceMetrics.fid).toBe('number');
      expect(typeof window.performanceMetrics.navigationTiming).toBe('object');
    });

    test('should provide accurate navigation timing', () => {
      expect(window.performanceMetrics.navigationTiming.loadTime).toBe(2000);
      expect(window.performanceMetrics.navigationTiming.domReady).toBe(1500);
    });

    test('should handle missing performance timing gracefully', () => {
      // Mock missing performance timing
      Object.defineProperty(window, 'performance', {
        value: null,
        writable: true
      });
      
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      
      // Should not throw error
      expect(() => initPerformanceMonitoring()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing document elements gracefully', () => {
      // Clear document body
      document.body.innerHTML = '';
      
      const { initLazyLoading } = require('../../js/performance.js');
      
      // Should not throw error
      expect(() => initLazyLoading()).not.toThrow();
    });

    test('should handle missing performance API gracefully', () => {
      // Mock missing performance API
      delete window.performance;
      
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      
      // Should not throw error
      expect(() => initPerformanceMonitoring()).not.toThrow();
    });

    test('should handle malformed performance entries', () => {
      // Mock PerformanceObserver with malformed entries
      global.PerformanceObserver = class PerformanceObserver {
        constructor(callback) {
          this.callback = callback;
        }
        
        observe(options) {
          if (options.type === 'largest-contentful-paint') {
            // Simulate malformed entry
            if (this.callback) {
              this.callback({
                getEntries: () => [null, undefined, {}]
              });
            }
          }
        }
        
        disconnect() {}
      };
      
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      
      // Should not throw error
      expect(() => initPerformanceMonitoring()).not.toThrow();
    });
  });

  describe('Console Logging', () => {
    test('should log performance metrics to console', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      initPerformanceMonitoring();
      
      expect(consoleSpy).toHaveBeenCalledWith('Performance Monitoring Initialized');
      expect(consoleSpy).toHaveBeenCalledWith('Navigation Timing:', expect.any(Object));
      
      consoleSpy.mockRestore();
    });

    test('should log LCP values', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      initPerformanceMonitoring();
      
      expect(consoleSpy).toHaveBeenCalledWith('LCP:', 1500, 'ms');
      
      consoleSpy.mockRestore();
    });

    test('should log CLS values', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      initPerformanceMonitoring();
      
      expect(consoleSpy).toHaveBeenCalledWith('CLS:', 0.15);
      
      consoleSpy.mockRestore();
    });

    test('should log FID values', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const { initPerformanceMonitoring } = require('../../js/performance.js');
      initPerformanceMonitoring();
      
      expect(consoleSpy).toHaveBeenCalledWith('FID:', 50, 'ms');
      
      consoleSpy.mockRestore();
    });
  });
});