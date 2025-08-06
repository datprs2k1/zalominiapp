/**
 * Base Header Component
 * Shared header implementation for all platforms
 */

import React, { memo, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import { useRouteHandle } from '@/hooks';
import { PlatformHeaderProps, HeaderVariant } from '../types';
import {
  useOptimizedHeaderAnimations,
  useOptimizedHeaderNavigation,
  useOptimizedHeaderPlatform,
} from '../OptimizedHeaderProvider';
import { SCROLL_THRESHOLD, CSS_CLASSES, ACCESSIBILITY_LABELS } from '../constants';

// Base header props
interface BaseHeaderProps extends PlatformHeaderProps {
  children: React.ReactNode;
  variant?: HeaderVariant;
  showBackground?: boolean;
  enableScrollEffect?: boolean;
}

// Base header component
export const BaseHeader: React.FC<BaseHeaderProps> = memo(
  ({
    children,
    className = '',
    style = {},
    variant = 'main',
    showBackground = true,
    enableScrollEffect = true,
    platform,
    deviceInfo,
    platformStyles,
  }) => {
    const location = useLocation();
    const [handle] = useRouteHandle();
    const [scrolled, setScrolled] = useState(false);

    const { prefersReducedMotion, duration } = useOptimizedHeaderAnimations();
    const { isNavigating } = useOptimizedHeaderNavigation();

    // Enhanced scroll handling with throttling for better performance
    useEffect(() => {
      if (!enableScrollEffect) return;

      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            setScrolled(window.scrollY > SCROLL_THRESHOLD);
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, [enableScrollEffect]);

    // Determine header variant and styling
    const showMainHeader = useMemo(() => !handle?.back, [handle?.back]);
    const headerVariant = useMemo(() => {
      if (variant !== 'main') return variant;
      return showMainHeader ? 'main' : 'navigation';
    }, [variant, showMainHeader]);

    // Enhanced accessibility and medical context with WCAG 2.1 AA compliance
    const headerRole = useMemo(() => (headerVariant === 'main' ? 'banner' : 'navigation'), [headerVariant]);
    const headerAriaLabel = useMemo(() => {
      if (headerVariant === 'main') {
        return ACCESSIBILITY_LABELS.mainHeader;
      }
      return `Điều hướng y tế: ${handle.title === 'custom' ? 'Trang tùy chỉnh' : handle.title}. Nhấn Tab để điều hướng, Enter để kích hoạt`;
    }, [headerVariant, handle.title]);

    // Platform-specific CSS classes
    const getPlatformClasses = (baseClasses: string = '') => {
      return [
        baseClasses,
        `platform-${platform}`,
        `screen-${deviceInfo.screenSize}`,
        `orientation-${deviceInfo.orientation}`,
        `variant-${headerVariant}`,
      ]
        .filter(Boolean)
        .join(' ');
    };

    // Header CSS classes
    const headerClasses = useMemo(() => {
      const baseClasses = CSS_CLASSES.header.base;
      const variantClasses = headerVariant === 'main' ? CSS_CLASSES.header.main : CSS_CLASSES.header.navigation;
      const scrollClasses = scrolled ? CSS_CLASSES.header.scrolled : '';
      const focusClasses = CSS_CLASSES.header.focus;
      const paddingClasses = CSS_CLASSES.content.padding;

      return getPlatformClasses(
        `
      ${baseClasses}
      ${variantClasses}
      ${scrollClasses}
      ${focusClasses}
      ${paddingClasses}
      ${className}
    `
          .replace(/\s+/g, ' ')
          .trim()
      );
    }, [headerVariant, scrolled, className, platform, deviceInfo]);

    return (
      <motion.header
        role={headerRole}
        aria-label={headerAriaLabel}
        className={headerClasses}
        style={style}
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0.01 } : { duration }}
        data-platform={platform}
        data-variant={headerVariant}
        data-scrolled={scrolled}
        data-navigating={isNavigating}
      >
        {children}
      </motion.header>
    );
  }
);

BaseHeader.displayName = 'BaseHeader';
