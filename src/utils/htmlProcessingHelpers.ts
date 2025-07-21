/**
 * Utility functions for processing HTML content
 */

/**
 * Extracts raw HTML content from WordPress blocks or other sources
 * by removing script tags, style tags, and excessive attributes.
 */
export const extractRawHtml = (html: string): string => {
  if (!html) return '';

  // Create a DOMParser instance if we're on the client side
  if (typeof window === 'undefined') return html;

  const parser = new window.DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove all script tags
  const scripts = doc.querySelectorAll('script');
  scripts.forEach((script) => script.remove());

  // Remove all style tags
  const styles = doc.querySelectorAll('style');
  styles.forEach((style) => style.remove());

  // Clean up WordPress specific elements if needed
  // This can be expanded based on specific patterns in your WordPress content
  const wpElements = doc.querySelectorAll('.wp-block-code');
  wpElements.forEach((el) => {
    // Replace WordPress code blocks with plain code elements
    const code = el.textContent;
    if (code) {
      const newCode = doc.createElement('pre');
      newCode.textContent = code;
      el.parentNode?.replaceChild(newCode, el);
    }
  });

  return doc.body.innerHTML;
};

/**
 * Processes HTML to make it compatible with Tailwind CSS by adding
 * essential structural classes. This is different from normalizeHtml which
 * does more extensive formatting.
 */
export const addTailwindStructure = (html: string): string => {
  if (!html || typeof window === 'undefined') return html;

  const parser = new window.DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Add container classes
  doc.querySelectorAll('section').forEach((section) => {
    section.classList.add('py-8');
  });

  // Add responsive classes
  doc.querySelectorAll('.row, .container').forEach((container) => {
    container.classList.add('flex', 'flex-wrap');
  });

  // Process columns for responsive layout
  doc.querySelectorAll('[class*="col-"]').forEach((col) => {
    col.classList.add('p-4');

    // Add appropriate width classes based on original column specifications
    if (col.classList.contains('medium-6') || col.classList.contains('large-6')) {
      col.classList.add('w-full', 'md:w-1/2');
    } else if (col.classList.contains('medium-4') || col.classList.contains('large-4')) {
      col.classList.add('w-full', 'md:w-1/3');
    } else if (col.classList.contains('medium-3') || col.classList.contains('large-3')) {
      col.classList.add('w-full', 'md:w-1/4');
    } else {
      col.classList.add('w-full');
    }
  });

  return doc.body.innerHTML;
};

export default {
  extractRawHtml,
  addTailwindStructure,
};
