import React from 'react';
import { normalizeHtml } from '../utils/normalHTML';

interface HtmlContentDisplayProps {
  htmlContent: string;
  className?: string;
}

/**
 * Component for rendering HTML content that has been normalized and sanitized
 * with proper Tailwind CSS classes
 */
export const HtmlContentDisplay: React.FC<HtmlContentDisplayProps> = ({ htmlContent, className = '' }) => {
  // Only process HTML on client-side
  const [normalizedContent, setNormalizedContent] = React.useState<string>('');

  React.useEffect(() => {
    // Process HTML content when component mounts or htmlContent changes
    if (typeof window !== 'undefined' && htmlContent) {
      setNormalizedContent(normalizeHtml(htmlContent));
    }
  }, [htmlContent]);

  return (
    <div className={`html-content-display ${className}`} dangerouslySetInnerHTML={{ __html: normalizedContent }} />
  );
};

export default HtmlContentDisplay;
