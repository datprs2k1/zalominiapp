/**
 * Skip Link Component
 * Provides keyboard navigation accessibility for screen readers
 */

import React, { memo } from 'react';
import { SKIP_LINK_ID, ACCESSIBILITY_LABELS, CSS_CLASSES } from '../constants';

// Skip link props
interface SkipLinkProps {
  targetId?: string;
  label?: string;
  className?: string;
}

// Skip link component
export const SkipLink: React.FC<SkipLinkProps> = memo(({
  targetId = SKIP_LINK_ID,
  label = ACCESSIBILITY_LABELS.skipLink,
  className = '',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className={`${CSS_CLASSES.skipLink} ${className}`}
      tabIndex={0}
    >
      {label}
    </a>
  );
});

SkipLink.displayName = 'SkipLink';
