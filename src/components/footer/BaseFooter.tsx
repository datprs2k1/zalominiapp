import React, { memo, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { BaseFooterProps } from './types';
import { useFooterNavigation, useFooterAnimations, useFooterAccessibility } from './hooks';
import {
  generateButtonStyles,
  generateContainerStyles,
  generateBarStyles,
  getAriaLabel,
  truncateText,
  getOptimalFontSize,
  shouldShowLabels,
  getOptimalIconSize,
} from './utils';
import { MEDICAL_FOOTER_THEME } from './medical-theme';
import { medicalHaptics } from './medical-haptics';
import './medical-footer.css';

// Medical Context Interface
interface MedicalContext {
  emergencyMode?: boolean;
  trustMode?: boolean;
  appointmentCount?: number;
  urgentNotifications?: number;
  healthStatus?: 'excellent' | 'good' | 'warning' | 'critical';
  trustLevel?: 'verified' | 'certified' | 'secure';
}

// Enhanced Base footer component with medical theming
export const BaseFooter = memo<
  BaseFooterProps & {
    className?: string;
    renderCustomButton?: (item: any, index: number, defaultProps: any) => React.ReactNode;
    renderCustomBadge?: (badge: number) => React.ReactNode;
    dimensions: any;
    medicalContext?: MedicalContext;
  }
>(
  ({
    items,
    deviceInfo,
    platformStyles,
    className = '',
    renderCustomButton,
    renderCustomBadge,
    dimensions,
    medicalContext = {},
  }) => {
    const location = useLocation();
    const prefersReducedMotion = useReducedMotion();

    const {
      activeItem,
      focusedIndex,
      hoveredIndex,
      pressedIndex,
      itemRefs,
      handleItemPress,
      handleKeyDown,
      handleFocus,
      handleBlur,
      handleMouseEnter,
      handleMouseLeave,
      handlePressStart,
      handlePressEnd,
    } = useFooterNavigation(items);

    const { containerVariants, itemVariants, badgeVariants } = useFooterAnimations(prefersReducedMotion);
    const { announceText } = useFooterAccessibility();

    // Pure icon-only design - never show labels
    const showLabels = false; // Always false for clean icon-only design
    const optimalIconSize = getOptimalIconSize(deviceInfo.platform, showLabels);

    // Update dimensions with dynamic values
    const dynamicDimensions = {
      ...dimensions,
      showLabels,
      iconSize: optimalIconSize,
    };

    // Medical theming state
    const [emergencyMode, setEmergencyMode] = useState(medicalContext.emergencyMode || false);
    const [trustMode, setTrustMode] = useState(medicalContext.trustMode || false);

    // Update medical modes when context changes
    useEffect(() => {
      if (medicalContext.emergencyMode !== emergencyMode) {
        setEmergencyMode(medicalContext.emergencyMode || false);
        if (medicalContext.emergencyMode) {
          medicalHaptics.emergencyOn();
        } else {
          medicalHaptics.emergencyOff();
        }
      }
      if (medicalContext.trustMode !== trustMode) {
        setTrustMode(medicalContext.trustMode || false);
        if (medicalContext.trustMode) {
          medicalHaptics.trust();
        }
      }
    }, [medicalContext.emergencyMode, medicalContext.trustMode, emergencyMode, trustMode]);

    // Generate medical-enhanced styles
    const getMedicalTheme = () => {
      if (emergencyMode) {
        return MEDICAL_FOOTER_THEME.presets.emergency;
      } else if (trustMode) {
        return MEDICAL_FOOTER_THEME.presets.trust;
      }
      return MEDICAL_FOOTER_THEME.presets.standard;
    };

    const medicalTheme = getMedicalTheme();
    const containerStyles = generateContainerStyles(platformStyles, dynamicDimensions, deviceInfo.safeAreas.bottom);
    const barStyles = generateBarStyles(platformStyles, dynamicDimensions);

    // Enhanced container styles with medical theming
    const medicalContainerStyles = {
      ...containerStyles,
      background: deviceInfo.platform === 'web' ? medicalTheme.background.light : medicalTheme.background.light,
      backdropFilter: `blur(${medicalTheme.blur.blur}) saturate(${medicalTheme.blur.saturation}) brightness(${medicalTheme.blur.brightness})`,
      WebkitBackdropFilter: `blur(${medicalTheme.blur.blur}) saturate(${medicalTheme.blur.saturation}) brightness(${medicalTheme.blur.brightness})`,
      boxShadow: medicalTheme.shadow.light,
      borderTop: medicalTheme.border.light,
    };

    // Enhanced bar styles with medical theming
    const medicalBarStyles = {
      ...barStyles,
      height: MEDICAL_FOOTER_THEME.spacing.footer.contentHeight,
    };

    // Default button renderer
    const renderButton = (item: any, index: number) => {
      const isActive = location.pathname === item.path;
      const isPressed = pressedIndex === index;
      const isFocused = focusedIndex === index;
      const isHovered = hoveredIndex === index;

      const buttonStyles = generateButtonStyles(
        isActive,
        isPressed,
        isFocused,
        platformStyles,
        dynamicDimensions,
        isHovered
      );

      // Enhanced click handler with medical haptic feedback
      const handleMedicalClick = () => {
        // Trigger appropriate medical haptic feedback
        if (emergencyMode) {
          medicalHaptics.emergency();
        } else if (item.id === 'booking') {
          medicalHaptics.appointment();
        } else if (item.id === 'support') {
          medicalHaptics.urgent();
        } else if (item.id === 'doctor') {
          medicalHaptics.consultation();
        } else {
          medicalHaptics.select();
        }

        handleItemPress(item, index);
      };

      // Enhanced ARIA label with medical context
      const getMedicalAriaLabel = () => {
        let baseLabel = getAriaLabel(item, isActive);

        if (emergencyMode) {
          baseLabel += ' - Chế độ khẩn cấp đang hoạt động';
        }

        if (medicalContext.urgentNotifications && medicalContext.urgentNotifications > 0) {
          baseLabel += ` - ${medicalContext.urgentNotifications} thông báo khẩn cấp`;
        }

        if (item.id === 'booking' && medicalContext.appointmentCount && medicalContext.appointmentCount > 0) {
          baseLabel += ` - ${medicalContext.appointmentCount} lịch hẹn`;
        }

        return baseLabel;
      };

      const defaultProps = {
        ref: (el: HTMLButtonElement | null) => (itemRefs.current[index] = el),
        role: 'tab',
        'aria-selected': isActive,
        'aria-label': getMedicalAriaLabel(),
        tabIndex: focusedIndex === index ? 0 : -1,
        onClick: handleMedicalClick,
        onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, index),
        onFocus: () => handleFocus(index),
        onBlur: handleBlur,
        onMouseEnter: () => handleMouseEnter(index),
        onMouseLeave: handleMouseLeave,
        onMouseDown: () => handlePressStart(index),
        onMouseUp: handlePressEnd,
        onTouchStart: () => handlePressStart(index),
        onTouchEnd: handlePressEnd,
        style: buttonStyles,
        className: `medical-nav-item ${isActive ? 'selected' : ''}`,
      };

      if (renderCustomButton) {
        return renderCustomButton(item, index, { ...defaultProps, key: item.id });
      }

      return (
        <motion.button key={item.id} {...defaultProps} variants={itemVariants}>
          {/* Focus indicator */}
          {isFocused && (
            <div
              style={{
                position: 'absolute',
                inset: '-2px',
                borderRadius: `${platformStyles.borderRadius.md - 2}px`,
                border: `2px solid ${platformStyles.colors.focus}`,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Active state is now handled by button background */}

          {/* Icon - Centered and optimized for circular design */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${optimalIconSize}px`, // Large, prominent icons
              color: 'inherit', // Inherit color from button (white on active, gray on inactive)
              transition: `all ${platformStyles.animations.duration.fast}ms ${platformStyles.animations.easing.spring}`,
              transform: 'none', // No scaling to prevent overflow
              filter: isActive ? 'none' : 'none', // No additional filters needed
              width: '100%',
              height: '100%', // Always full height for centered icon
              position: 'relative',
              zIndex: 1,
            }}
          >
            {item.icon}
          </div>

          {/* Pure icon-only design - no labels for cleaner look */}

          {/* Badge */}
          {item.badge && item.badge > 0 && (
            <motion.div
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                minWidth: '16px',
                height: '16px',
                backgroundColor: platformStyles.colors.badge,
                color: 'white',
                borderRadius: '8px',
                fontSize: '10px',
                fontWeight: platformStyles.typography.fontWeight.semibold,
                fontFamily: platformStyles.typography.fontFamily,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px',
                boxShadow: `0 2px 6px ${platformStyles.colors.badge}30`,
              }}
            >
              {renderCustomBadge ? renderCustomBadge(item.badge) : item.badge > 99 ? '99+' : item.badge}
            </motion.div>
          )}
        </motion.button>
      );
    };

    // Generate medical CSS classes
    const getMedicalClasses = () => {
      let classes = ['medical-footer-base', className];

      if (emergencyMode) {
        classes.push('emergency-mode');
      }

      if (trustMode) {
        classes.push('trust-mode');
      }

      if (deviceInfo.platform === 'ios') {
        classes.push('ios-footer');
      } else if (deviceInfo.platform === 'android') {
        classes.push('android-footer');
      } else {
        classes.push('universal-footer');
      }

      return classes.join(' ');
    };

    return (
      <>
        <motion.footer
          className={getMedicalClasses()}
          role="contentinfo"
          aria-label={
            emergencyMode
              ? 'Điều hướng chính của ứng dụng y tế - Chế độ khẩn cấp đang hoạt động'
              : 'Điều hướng chính của ứng dụng y tế với thiết kế bệnh viện iOS'
          }
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={medicalContainerStyles}
        >
          <div className="medical-footer-content" style={medicalBarStyles}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: `0 ${platformStyles.spacing.md}px`,
              }}
            >
              <nav role="navigation" aria-label="Điều hướng tab chính" style={{ display: 'contents' }}>
                <div role="tablist" style={{ display: 'contents' }}>
                  {items.map((item, index) => renderButton(item, index))}
                </div>
              </nav>
            </div>
          </div>
        </motion.footer>

        {/* Screen reader announcements */}
        {announceText && (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          >
            {announceText}
          </div>
        )}
      </>
    );
  }
);

BaseFooter.displayName = 'BaseFooter';
