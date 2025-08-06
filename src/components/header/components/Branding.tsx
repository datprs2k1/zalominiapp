/**
 * Branding Component
 * Medical app branding with title and subtitle
 */

import React, { memo } from 'react';
import { MEDICAL_COLOR_PALETTE } from '@/styles/unified-color-system';
import { MEDICAL_BRANDING } from '../constants';

// Branding props
interface BrandingProps {
  title?: string;
  subtitle?: string;
  className?: string;
  showSubtitle?: boolean;
}

// Branding component
export const Branding: React.FC<BrandingProps> = memo(({
  title = MEDICAL_BRANDING.title,
  subtitle = MEDICAL_BRANDING.subtitle,
  className = '',
  showSubtitle = true,
}) => {
  return (
    <div className={`flex flex-col space-y-0 ${className}`}>
      <span
        className="font-bold text-base md:text-lg lg:text-xl leading-tight tracking-tight"
        style={{ color: MEDICAL_COLOR_PALETTE.medical.blue[500] }}
      >
        {title}
      </span>
      
      {showSubtitle && (
        <span
          className="text-xs md:text-sm lg:text-base font-medium leading-tight opacity-80"
          style={{ color: MEDICAL_COLOR_PALETTE.medical.green[500] }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
});

Branding.displayName = 'Branding';
