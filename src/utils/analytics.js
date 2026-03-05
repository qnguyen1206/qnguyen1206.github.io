// Google Analytics 4 initialization and tracking utilities

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * Check if we should skip analytics (localhost/dev environment)
 */
function shouldSkipAnalytics() {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || 
         hostname === '127.0.0.1' || 
         hostname.startsWith('192.168.') ||
         hostname === '';
}

/**
 * Initialize Google Analytics
 */
export function initAnalytics() {
  // Skip analytics on local development
  if (shouldSkipAnalytics()) {
    console.log('Google Analytics: Skipped (local development)');
    return;
  }

  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics: No measurement ID provided');
    return;
  }

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);

  // Track section views on scroll
  initSectionTracking();
}

/**
 * Track a custom event
 * @param {string} eventName - Name of the event
 * @param {object} params - Event parameters
 */
export function trackEvent(eventName, params = {}) {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
}

/**
 * Track a page/section view
 * @param {string} pagePath - Virtual page path
 * @param {string} pageTitle - Page title
 */
export function trackPageView(pagePath, pageTitle) {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle
    });
  }
}

/**
 * Track project modal open
 * @param {string} projectId - Project ID
 * @param {string} projectTitle - Project title
 */
export function trackProjectView(projectId, projectTitle) {
  trackEvent('view_project', {
    project_id: projectId,
    project_title: projectTitle,
    content_type: 'project'
  });
}

/**
 * Track blog post open
 * @param {string} postId - Blog post ID
 * @param {string} postTitle - Blog post title
 * @param {string} category - Blog category
 */
export function trackBlogView(postId, postTitle, category) {
  trackEvent('view_blog_post', {
    post_id: postId,
    post_title: postTitle,
    category: category,
    content_type: 'blog'
  });
}

/**
 * Track external link clicks
 * @param {string} url - External URL
 * @param {string} linkText - Link text/label
 */
export function trackOutboundLink(url, linkText) {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: linkText,
    link_url: url
  });
}

/**
 * Initialize intersection observer to track section views
 */
function initSectionTracking() {
  const sections = document.querySelectorAll('section[id]');
  const trackedSections = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !trackedSections.has(entry.target.id)) {
        const sectionId = entry.target.id;
        trackedSections.add(sectionId);
        
        trackPageView(`/#${sectionId}`, `Section: ${sectionId}`);
      }
    });
  }, {
    threshold: 0.3 // Trigger when 30% of section is visible
  });

  sections.forEach(section => observer.observe(section));
}
