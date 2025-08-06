/**
 * Title Component
 * Header title with platform-specific typography and animations
 */

import React, { memo } from 'react';
import { useAtomValue } from 'jotai';

import { TitleProps } from '../types';
import { customTitleState } from '@/state';
import { decodeHTML } from '@/utils/decodeHTML';
import { MEDICAL_COLOR_PALETTE } from '@/styles/unified-color-system';

// Custom title component for dynamic titles
const CustomTitle: React.FC = memo(() => {
  const title = useAtomValue(customTitleState);
  return <>{decodeHTML(title)}</>;
});

CustomTitle.displayName = 'CustomTitle';

// Title component
export const Title: React.FC<TitleProps> = memo(({
  title,
  subtitle,
  className = '',
  truncate = true,
}) => {
  const isCustomTitle = title === 'custom';
  
  return (
    <div className={`flex flex-col ${className}`}>
      <div
        className={`
          text-base md:text-lg lg:text-xl font-semibold leading-tight tracking-tight
          transition-colors duration-200 hover:opacity-80
          ${truncate ? 'truncate flex-1' : ''}
        `}
        style={{ color: MEDICAL_COLOR_PALETTE.medical.blue[500] }}
        role="heading"
        aria-level={1}
        aria-live="polite"
        aria-label={`Trang hiện tại: ${isCustomTitle ? 'Trang tùy chỉnh' : title}`}
      >
        {isCustomTitle ? <CustomTitle /> : title}
      </div>
      
      {subtitle && (
        <div
          className="text-xs md:text-sm font-medium leading-tight opacity-70"
          style={{ color: MEDICAL_COLOR_PALETTE.medical.green[500] }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
});

Title.displayName = 'Title';
