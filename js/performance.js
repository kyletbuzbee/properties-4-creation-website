/**
 * Properties 4 Creations - Performance Module
 * Handles performance optimizations and monitoring
 *
 * @fileoverview Provides performance optimizations and Core Web Vitals monitoring
 * @author Properties 4 Creations
 */

/**
 * Initialize performance optimizations
 */
export function initPerformanceOptimizations() {
  // Preload critical resources
  preloadCriticalResources();

  // Add resource hints for better loading
  addResourceHints();

  // Optimize scroll performance
  optimizeScrollPerformance();
}

/**
 * Initialize performance monitoring for Core Web Vitals
 */
export function initPerformanceMonitoring() {
  // Check if PerformanceObserver is supported
  if ('PerformanceObserver' in window) {
    const metrics = {
      lcp: 0,
      cls: 0,
      fid: 0,
      navigationTiming: {}
    };

    // Track navigation timing
    if (window.performance && window.performance.timing) {
      metrics.navigationTiming = {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
      };
    }

    // Largest Contentful Paint
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.startTime;
        console.log('LCP:', metrics.lcp, 'ms');
        
        // Send to analytics if available
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'performance_metrics',
            metricType: 'LCP',
            value: metrics.lcp
          });
        }
      }).observe({type: 'largest-contentful-paint', buffered: true});
    } catch (e) {
      console.warn('LCP monitoring failed:', e);
    }

    // Cumulative Layout Shift
    try {
      let cls = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        }
        metrics.cls = cls;
        console.log('CLS:', metrics.cls);
        
        // Send to analytics if available
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'performance_metrics',
            metricType: 'CLS',
            value: metrics.cls
          });
        }
      }).observe({type: 'layout-shift', buffered: true});
    } catch (e) {
      console.warn('CLS monitoring failed:', e);
    }

    // First Input Delay
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          metrics.fid = entry.processingStart - entry.startTime;
          console.log('FID:', metrics.fid, 'ms');
          
          // Send to analytics if available
          if (window.dataLayer) {
            window.dataLayer.push({
              event: 'performance_metrics',
              metricType: 'FID',
              value: metrics.fid
            });
          }
        }
      }).observe({type: 'first-input', buffered: true});
    } catch (e) {
      console.warn('FID monitoring failed:', e);
    }

    // Log metrics to console for debugging
    console.log('Performance Monitoring Initialized');
    console.log('Navigation Timing:', metrics.navigationTiming);
    
    // Expose metrics globally for debugging
    window.performanceMetrics = metrics;
  } else {
    console.log('PerformanceObserver not supported, performance monitoring disabled');
  }
}

/**
 * Initialize lazy loading for images
 */
export function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      img.classList.add('loaded');
    });
  }
}

/**
 * Preload critical resources
 */
function preloadCriticalResources() {
  // Preload logo and critical images
  const criticalImages = [
    '/images/logo/brand-logo.svg',
    '/images/logo/brand-logo.svg'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

/**
 * Add resource hints for better loading
 */
function addResourceHints() {
  // DNS prefetch for external domains
  const domains = ['fonts.googleapis.com', 'fonts.gstatic.com'];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
}

/**
 * Optimize scroll performance
 */
function optimizeScrollPerformance() {
  let ticking = false;

  function updateScrollPosition() {
    // Add scroll-based effects here if needed
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition);
      ticking = true;
    }
  });
}