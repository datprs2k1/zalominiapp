/**
 * Enhanced Mobile Navigation Component
 * Optimized for both Android (Material Design) and iOS (Human Interface Guidelines)
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';

// Types
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  disabled?: boolean;
  ariaLabel?: string;
  voiceControlNames?: string[];
}

interface EnhancedMobileNavigationProps {
  items: NavigationItem[];
  className?: string;
  onItemPress?: (item: NavigationItem) => void;
  enableHapticFeedback?: boolean;
  enableVoiceControl?: boolean;
  enableGestures?: boolean;
}

// Enhanced Mobile Navigation Component
export const EnhancedMobileNavigation: React.FC<EnhancedMobileNavigationProps> = ({
  items,
  className = '',
  onItemPress,
  enableHapticFeedback = true,
  enableVoiceControl = true,
  enableGestures = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { deviceInfo, platformStyles, hapticFeedback, getPlatformClasses } = useEnhancedMobile();
  const prefersReducedMotion = useReducedMotion();
  const [activeItem, setActiveItem] = useState<string>('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Enhanced keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          const prevIndex = index > 0 ? index - 1 : items.length - 1;
          setFocusedIndex(prevIndex);
          itemRefs.current[prevIndex]?.focus();
          break;

        case 'ArrowRight':
          event.preventDefault();
          const nextIndex = index < items.length - 1 ? index + 1 : 0;
          setFocusedIndex(nextIndex);
          itemRefs.current[nextIndex]?.focus();
          break;

        case 'Home':
          event.preventDefault();
          setFocusedIndex(0);
          itemRefs.current[0]?.focus();
          break;

        case 'End':
          event.preventDefault();
          const lastIndex = items.length - 1;
          setFocusedIndex(lastIndex);
          itemRefs.current[lastIndex]?.focus();
          break;

        case 'Enter':
        case ' ':
          event.preventDefault();
          handleItemPress(items[index]);
          break;
      }
    },
    [items]
  );

  // Handle navigation item press with enhanced feedback
  const handleItemPress = useCallback(
    (item: NavigationItem) => {
      if (item.disabled) return;

      // Enhanced haptic feedback based on platform
      if (enableHapticFeedback) {
        if (deviceInfo.platform === 'ios') {
          hapticFeedback.light();
        } else if (deviceInfo.platform === 'android') {
          hapticFeedback.medium();
        }
      }

      // Visual feedback with timeout
      setActiveItem(item.id);
      setTimeout(() => setActiveItem(''), 200);

      // Call custom handler if provided
      onItemPress?.(item);

      // Navigate to the path
      navigate(item.path);
    },
    [hapticFeedback, navigate, onItemPress, enableHapticFeedback, deviceInfo.platform]
  );

  // Get platform-specific styles
  const getNavigationStyles = () => {
    const { platform } = deviceInfo;
    const colors = platformStyles.colors;
    const shadows = platformStyles.shadows;

    if (platform === 'ios') {
      return {
        background: `${colors.systemBackground}F5`, // 96% opacity
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: `0.5px solid ${colors.systemGray5}`,
        boxShadow: shadows.medium,
      };
    } else {
      // Android Material Design
      return {
        background: colors.surface,
        borderTop: `1px solid ${colors.outlineVariant}`,
        boxShadow: shadows.level2,
      };
    }
  };

  const getItemStyles = (item: NavigationItem, isActive: boolean) => {
    const { platform } = deviceInfo;
    const colors = platformStyles.colors;

    if (platform === 'ios') {
      return {
        color: isActive ? colors.systemBlue : colors.systemGray,
        backgroundColor: isActive ? `${colors.systemBlue}15` : 'transparent',
      };
    } else {
      // Android Material Design
      return {
        color: isActive ? colors.primary : colors.onSurfaceVariant,
        backgroundColor: isActive ? `${colors.primary}12` : 'transparent',
      };
    }
  };

  // Check if item is currently active
  const isItemActive = (item: NavigationItem) => {
    return location.pathname === item.path || activeItem === item.id;
  };

  // Animation variants
  const containerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.nav
      className={getPlatformClasses(`enhanced-mobile-navigation ${className}`)}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingBottom: `max(${deviceInfo.safeAreas.bottom}px, 16px)`,
        paddingTop: '8px',
        paddingLeft: `max(${deviceInfo.safeAreas.left}px, 16px)`,
        paddingRight: `max(${deviceInfo.safeAreas.right}px, 16px)`,
        ...getNavigationStyles(),
      }}
      variants={prefersReducedMotion ? {} : containerVariants}
      initial="hidden"
      animate="visible"
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {items.map((item, index) => {
          const isActive = isItemActive(item);
          const isFocused = focusedIndex === index;

          return (
            <motion.button
              key={item.id}
              ref={(el) => (itemRefs.current[index] = el)}
              className={getPlatformClasses('nav-item')}
              role="tab"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: platformStyles.touchTarget.recommended,
                minWidth: platformStyles.touchTarget.recommended,
                padding: '8px 12px',
                border: 'none',
                borderRadius: platformStyles.borderRadius.medium,
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.5 : 1,
                transition: `all ${platformStyles.animations.normal} ${platformStyles.animations.easeInOut}`,
                touchAction: 'manipulation',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
                position: 'relative',
                outline: 'none',
                ...getItemStyles(item, isActive),
              }}
              onClick={() => handleItemPress(item)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              disabled={item.disabled}
              variants={prefersReducedMotion ? {} : itemVariants}
              whileTap="tap"
              aria-label={item.ariaLabel || item.label}
              aria-selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={isFocused ? 0 : -1}
            >
              {/* Focus indicator */}
              {isFocused && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '-2px',
                    borderRadius: `calc(${platformStyles.borderRadius.medium} + 2px)`,
                    border: `2px solid ${deviceInfo.platform === 'ios' ? 'rgb(0, 122, 255)' : 'rgb(37, 99, 235)'}`,
                    pointerEvents: 'none',
                  }}
                />
              )}
              {/* Icon */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px',
                  fontSize: '20px',
                }}
              >
                {item.icon}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: deviceInfo.screenSize === 'small' ? '11px' : '12px',
                  fontWeight: isActive ? '600' : '400',
                  fontFamily: platformStyles.typography.fontFamily.primary,
                  lineHeight: 1.2,
                  textAlign: 'center',
                  maxWidth: '60px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </span>

              {/* Badge */}
              {item.badge && item.badge > 0 && (
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '8px',
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: '9px',
                    backgroundColor:
                      deviceInfo.platform === 'ios' ? platformStyles.colors.systemRed : platformStyles.colors.error,
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </motion.div>
              )}

              {/* Active indicator for iOS */}
              {deviceInfo.platform === 'ios' && isActive && (
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    width: '4px',
                    height: '4px',
                    borderRadius: '2px',
                    backgroundColor: platformStyles.colors.systemBlue,
                    transform: 'translateX(-50%)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default EnhancedMobileNavigation;
