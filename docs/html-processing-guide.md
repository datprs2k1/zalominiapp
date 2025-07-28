# HTML Content Processing Guide

This guide explains the HTML content processing system in the Zalo Healthcare application. This system converts HTML content from WordPress (or other sources) into a format that's compatible with Tailwind CSS, removing inline styles and adding appropriate Tailwind classes.

## Overview

The HTML content processing system consists of several components that work together to:

1. **Clean and normalize** HTML content from external sources
2. **Apply Tailwind CSS classes** based on the content structure and style
3. **Render processed content** within the application's design system
4. **Provide a visual interface** for debugging and fine-tuning the conversion process

## Key Components

### 1. `normalizeHtml` Function

The core function that processes HTML content and applies Tailwind CSS classes.

**File Location:** `src/utils/normalHTML.tsx`

**Functionality:**

- Parses HTML using the browser's DOM parser
- Removes inline styles and unnecessary classes
- Adds appropriate Tailwind CSS classes based on element types and attributes
- Preserves important structural elements and form functionality
- Returns cleaned and formatted HTML string

**Example:**

```typescript
import { normalizeHtml } from '@/utils/normalHTML';

// Input: HTML with inline styles
const originalHtml = `
<div style="padding: 20px; background-color: #f5f5f5;">
  <h2 style="color: #333; font-size: 24px; font-weight: bold;">Welcome to our clinic</h2>
  <p style="margin: 16px 0; line-height: 1.5;">We provide high-quality healthcare services.</p>
</div>
`;

// Output: HTML with Tailwind classes
const processedHtml = normalizeHtml(originalHtml);
// Result:
// <div class="bg-gray-100 p-5">
//   <h2 class="text-gray-800 text-2xl font-bold">Welcome to our clinic</h2>
//   <p class="my-4 leading-normal">We provide high-quality healthcare services.</p>
// </div>
```

### 2. `HtmlContentDisplay` Component

A React component that displays HTML content after processing.

**File Location:** `src/components/HtmlContentDisplay.tsx`

**Props:**

- `htmlContent` (string): Raw HTML content to process
- `className` (string): Additional CSS classes for the container

**Functionality:**

- Processes HTML content using normalizeHtml
- Renders the processed content
- Handles security concerns with content sanitization

**Example:**

```typescript
import { HtmlContentDisplay } from '@/components/HtmlContentDisplay';

// In a React component
function ArticleContent({ article }) {
  return (
    <div className="article-container">
      <h1>{article.title}</h1>
      <HtmlContentDisplay
        htmlContent={article.content}
        className="prose max-w-none"
      />
    </div>
  );
}
```

### 3. Helper Functions

Utility functions that support the HTML processing workflow.

**File Location:** `src/utils/htmlProcessingHelpers.ts`

**Key Functions:**

- `extractRawHtml`: Extracts clean HTML from WordPress content (removes unnecessary wrappers)
- `addTailwindStructure`: Adds structural Tailwind classes based on HTML hierarchy
- `decodeHTMLEntities`: Converts HTML entities to their character equivalents
- `sanitizeHtml`: Removes potentially dangerous HTML constructs

**Example:**

```typescript
import { extractRawHtml, addTailwindStructure, sanitizeHtml } from '@/utils/htmlProcessingHelpers';

// Extract raw HTML from WordPress content
const rawHtml = extractRawHtml(wordPressContent);

// Add Tailwind structural classes
const structuredHtml = addTailwindStructure(rawHtml);

// Sanitize HTML for security
const safeHtml = sanitizeHtml(structuredHtml);
```

### 4. `ContentProcessor` Component

A visual interface for processing and debugging HTML content conversion.

**File Location:** `src/components/ContentProcessor.tsx`

**Functionality:**

- Provides a text area for pasting raw HTML content
- Shows step-by-step processing with visual diffs
- Allows viewing the original HTML, intermediate steps, and final output
- Supports copying the processed HTML to clipboard

**Example:**

```typescript
import { ContentProcessor } from '@/components/ContentProcessor';

// In a development or admin page
function HtmlDebugTool() {
  return (
    <div className="admin-container">
      <h1>HTML Processing Tool</h1>
      <ContentProcessor />
    </div>
  );
}
```

## Transformation Rules

The HTML processing system applies the following rules when converting content:

### Typography

| HTML Element      | Applied Tailwind Classes                       |
| ----------------- | ---------------------------------------------- |
| `<h1>`            | `text-4xl font-bold text-gray-900 mb-6`        |
| `<h2>`            | `text-3xl font-bold text-gray-800 mb-5`        |
| `<h3>`            | `text-2xl font-semibold text-gray-800 mb-4`    |
| `<h4>`            | `text-xl font-semibold text-gray-700 mb-3`     |
| `<h5>`            | `text-lg font-medium text-gray-700 mb-2`       |
| `<h6>`            | `text-base font-medium text-gray-700 mb-2`     |
| `<p>`             | `text-base text-gray-600 mb-4 leading-relaxed` |
| `<strong>`, `<b>` | `font-bold`                                    |
| `<em>`, `<i>`     | `italic`                                       |
| `<u>`             | `underline`                                    |

### Lists

| HTML Element | Applied Tailwind Classes           |
| ------------ | ---------------------------------- |
| `<ul>`       | `list-disc pl-5 mb-4 space-y-2`    |
| `<ol>`       | `list-decimal pl-5 mb-4 space-y-2` |
| `<li>`       | `ml-2`                             |

### Tables

| HTML Element | Applied Tailwind Classes                                                         |
| ------------ | -------------------------------------------------------------------------------- |
| `<table>`    | `w-full border-collapse mb-4`                                                    |
| `<thead>`    | `bg-gray-50`                                                                     |
| `<th>`       | `px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider` |
| `<tbody>`    | `bg-white`                                                                       |
| `<tr>`       | `border-b border-gray-200`                                                       |
| `<td>`       | `px-4 py-2 text-sm text-gray-500`                                                |

### Links and Buttons

| HTML Element | Applied Tailwind Classes                                        |
| ------------ | --------------------------------------------------------------- |
| `<a>`        | `text-primary hover:text-primary-dark underline`                |
| `<button>`   | `px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark` |

### Images and Media

| HTML Element   | Applied Tailwind Classes     |
| -------------- | ---------------------------- |
| `<img>`        | `max-w-full h-auto rounded`  |
| `<figure>`     | `mb-4`                       |
| `<figcaption>` | `text-sm text-gray-500 mt-1` |

### Containers

| HTML Element   | Applied Tailwind Classes                                    |
| -------------- | ----------------------------------------------------------- |
| `<div>`        | Varies based on context                                     |
| `<section>`    | `mb-8`                                                      |
| `<article>`    | `mb-8`                                                      |
| `<aside>`      | `bg-gray-50 p-4 rounded mb-4`                               |
| `<blockquote>` | `pl-4 border-l-4 border-gray-300 italic text-gray-600 my-4` |

## Usage Guidelines

### Direct Usage with `normalizeHtml`

For direct processing of HTML content:

```typescript
import { normalizeHtml } from '@/utils/normalHTML';

function MyComponent({ htmlContent }) {
  const processedHtml = normalizeHtml(htmlContent);

  return (
    <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
  );
}
```

### Using the `HtmlContentDisplay` Component

For a ready-to-use component with built-in processing:

```typescript
import { HtmlContentDisplay } from '@/components/HtmlContentDisplay';

function MyComponent({ htmlContent }) {
  return (
    <div className="my-content-container">
      <HtmlContentDisplay
        htmlContent={htmlContent}
        className="prose max-w-none"
      />
    </div>
  );
}
```

### Using the `ContentProcessor` for Debugging

For debugging and testing HTML processing:

```typescript
import { ContentProcessor } from '@/components/ContentProcessor';

function ProcessingTool() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">HTML Processing Tool</h1>
      <ContentProcessor />
    </div>
  );
}
```

## Customization

### Modifying Transformation Rules

To customize the transformation rules, edit the `normalizeHtml` function in `src/utils/normalHTML.tsx`. The function contains sections for different element types that you can modify.

Example of customizing heading styles:

```typescript
// Inside normalizeHtml function
const processHeadings = (element: Element) => {
  const tagName = element.tagName.toLowerCase();

  // Custom heading styles
  switch (tagName) {
    case 'h1':
      element.className = 'text-5xl font-extrabold text-blue-900 mb-6'; // Custom style
      break;
    case 'h2':
      element.className = 'text-4xl font-bold text-blue-800 mb-5'; // Custom style
      break;
    // ... other headings
  }
};
```

### Adding Support for Custom Elements

To support custom HTML elements or WordPress shortcodes:

```typescript
// Inside normalizeHtml function
const processCustomElements = (element: Element) => {
  // Check for custom elements
  if (element.classList.contains('wp-block-custom')) {
    element.className = 'my-custom-block bg-blue-100 p-4 rounded';
  }

  // Process data attributes
  if (element.getAttribute('data-type') === 'testimonial') {
    element.className = 'testimonial-block italic bg-gray-50 p-4 border-l-4 border-primary';
  }
};

// Add to the main processing loop
const processElement = (element: Element) => {
  // ... existing processing
  processCustomElements(element);
};
```

## Security Considerations

### HTML Sanitization

Always sanitize HTML before rendering to prevent XSS attacks:

```typescript
import { sanitizeHtml } from '@/utils/htmlProcessingHelpers';

const safeHtml = sanitizeHtml(processedHtml);
```

### Using `dangerouslySetInnerHTML`

Be cautious when using `dangerouslySetInnerHTML` directly. It's preferable to use the `HtmlContentDisplay` component which includes sanitization.

### Image Handling

For security and performance, consider transforming image URLs to go through a CDN or optimization service:

```typescript
// Process images for security and optimization
const processImages = (element: Element) => {
  if (element.tagName.toLowerCase() === 'img') {
    const src = element.getAttribute('src');
    if (src && !src.startsWith('https://trusted-domain.com')) {
      // Replace with proxied/sanitized URL
      element.setAttribute('src', `https://our-image-proxy.com?url=${encodeURIComponent(src)}`);
    }

    // Add loading lazy
    element.setAttribute('loading', 'lazy');
  }
};
```

## Performance Optimization

### Caching Processed HTML

For better performance, consider caching processed HTML:

```typescript
import { normalizeHtml } from '@/utils/normalHTML';
import * as cacheService from '@/services/cache';

async function getProcessedHtml(content: string, contentId: string) {
  // Try to get from cache
  const cached = await cacheService.get('processedHtml', contentId);
  if (cached) {
    return cached;
  }

  // Process and cache
  const processed = normalizeHtml(content);
  await cacheService.set('processedHtml', contentId, processed);

  return processed;
}
```

### Lazy Processing for Long Content

For very long content, consider processing lazily:

```typescript
import { useState, useEffect } from 'react';
import { normalizeHtml } from '@/utils/normalHTML';

function LazyProcessedContent({ htmlContent, contentId }) {
  const [processed, setProcessed] = useState('');

  useEffect(() => {
    const processAsync = async () => {
      // Show loading UI first
      setProcessed('<div class="loading">Processing content...</div>');

      // Process in next tick to avoid blocking UI
      setTimeout(() => {
        const result = normalizeHtml(htmlContent);
        setProcessed(result);
      }, 0);
    };

    processAsync();
  }, [htmlContent, contentId]);

  return <div dangerouslySetInnerHTML={{ __html: processed }} />;
}
```

## Requirements

- React 16.8+ (for hooks)
- Tailwind CSS configured in the project
- Client-side only (relies on DOMParser)

## Browser Compatibility

The HTML processing system is compatible with all modern browsers:

- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+
- iOS Safari 9.3+
- Android Browser 5+
- Samsung Browser 5+

## Troubleshooting

### Common Issues

1. **Missing Elements**: Some elements might be removed during processing if they're not recognized or contain invalid markup.

   **Solution**: Check the original HTML and make sure it's valid. Use the `ContentProcessor` to debug the transformation step by step.

2. **Incorrect Styles**: Tailwind classes might not match the original styling exactly.

   **Solution**: Customize the transformation rules in `normalizeHtml` to better match your design needs.

3. **Performance Issues**: Processing large HTML documents might cause performance issues.

   **Solution**: Implement caching and lazy processing as described in the Performance Optimization section.

### Debugging

For detailed debugging, use the `ContentProcessor` component:

1. Paste your HTML content in the input field
2. Click "Process Content"
3. Review each processing step
4. Check the console for warnings or errors

## Examples

### Processing Blog Content

```typescript
import { HtmlContentDisplay } from '@/components/HtmlContentDisplay';

function BlogPost({ post }) {
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="post-meta mb-6">
        <span>By {post.author}</span> • <span>{post.date}</span>
      </div>
      <HtmlContentDisplay
        htmlContent={post.content}
        className="prose lg:prose-xl max-w-none"
      />
    </article>
  );
}
```

### Processing Medical Service Descriptions

```typescript
import { HtmlContentDisplay } from '@/components/HtmlContentDisplay';

function ServiceDetails({ service }) {
  return (
    <div className="service-details">
      <h2 className="text-2xl font-bold mb-4">{service.name}</h2>
      <div className="service-price mb-4">
        <span className="font-medium">Price:</span> ${service.price}
      </div>
      <div className="service-description">
        <HtmlContentDisplay
          htmlContent={service.description}
          className="prose"
        />
      </div>
    </div>
  );
}
```
