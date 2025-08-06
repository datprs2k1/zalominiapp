import { useRouteHandle } from '@/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { MedicalIcons } from './icons/medical-icons';
import { memo, useCallback, useState, useRef, ReactNode } from 'react';

// Types
interface NavItem {
  id: string;
  name: string;
  path: string;
  ariaLabel: string;
  icon: ReactNode;
}

// Constants - iOS-optimized design for all platforms
const FOOTER_HEIGHT = 90; // iOS standard tab bar height - larger
const BAR_HEIGHT = 60; // iOS tab bar content height - larger
const BUTTON_SIZE = 60; // iOS standard touch target - larger
const ICON_SIZE = 32; // iOS optimal icon size - larger
const MAX_WIDTH = 414; // iPhone Pro Max width
const SHOW_LABELS = false; // Clean icon-only design
const COMPACT_MODE = false; // iOS standard mode

const COLORS = {
  background: 'rgba(255, 255, 255, 0.95)', // Footer background
  border: 'rgba(0, 0, 0, 0.08)', // Softer border
  active: 'rgb(0, 122, 255)', // iOS blue for active icons
  activeText: 'rgb(0, 122, 255)', // iOS blue text on active
  inactive: 'rgba(60, 60, 67, 0.6)', // iOS gray for inactive
  pressed: 'transparent', // No background on press
  focus: 'rgb(0, 122, 255)', // iOS blue for focus
  activeShadow: 'none', // No shadow for transparent design
  activeGlow: 'rgba(0, 122, 255, 0.3)', // iOS blue glow
} as const;

const SHADOWS = {
  elevated: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
} as const;

const TRANSITIONS = {
  spring: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

// Home icon component
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// About icon component
const AboutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

// Navigation items
const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    name: 'Trang chủ',
    path: '/',
    ariaLabel: 'Trang chủ ứng dụng y tế - Điểm khởi đầu cho các dịch vụ chăm sóc sức khỏe',
    icon: <HomeIcon />,
  },
  {
    id: 'services',
    name: 'Dịch vụ',
    path: '/service-prices',
    ariaLabel: 'Dịch vụ y tế và khám chữa bệnh - Xem bảng giá và thông tin chi tiết',
    icon: <MedicalIcons.Stethoscope />,
  },
  {
    id: 'booking',
    name: 'Đặt lịch',
    path: '/booking',
    ariaLabel: 'Đặt lịch khám bệnh và hẹn tái khám - Chức năng chính của ứng dụng',
    icon: <MedicalIcons.MedicalCross size="lg" />,
  },
  {
    id: 'doctor',
    name: 'Bác sĩ',
    path: '/doctor',
    ariaLabel: 'Thông tin bác sĩ và chuyên khoa - Tìm hiểu về đội ngũ y bác sĩ',
    icon: <MedicalIcons.User />,
  },
  {
    id: 'about',
    name: 'Giới thiệu',
    path: '/about',
    ariaLabel: 'Thông tin giới thiệu và liên hệ - Tìm hiểu về cơ sở y tế',
    icon: <AboutIcon />,
  },
];

// Animation variants
const containerVariants: Variants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 0.8,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

// Custom hook for footer navigation logic with iOS-style interactions
const useFooterNavigation = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const [pressedIndex, setPressedIndex] = useState<number>(-1);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleItemPress = useCallback(
    (item: NavItem, index: number) => {
      setActiveItem(item.id);
      setTimeout(() => setActiveItem(''), 150);
      navigate(item.path);
    },
    [navigate]
  );

  const navigateToIndex = useCallback((index: number) => {
    setFocusedIndex(index);
    itemRefs.current[index]?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          navigateToIndex(index > 0 ? index - 1 : NAV_ITEMS.length - 1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateToIndex(index < NAV_ITEMS.length - 1 ? index + 1 : 0);
          break;
        case 'Home':
          event.preventDefault();
          navigateToIndex(0);
          break;
        case 'End':
          event.preventDefault();
          navigateToIndex(NAV_ITEMS.length - 1);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          handleItemPress(NAV_ITEMS[index], index);
          break;
      }
    },
    [handleItemPress, navigateToIndex]
  );

  // Handle focus
  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  // Handle blur
  const handleBlur = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  // Handle hover (mouse enter)
  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  // Handle hover end (mouse leave)
  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(-1);
  }, []);

  // Handle press start (mouse down / touch start)
  const handlePressStart = useCallback((index: number) => {
    setPressedIndex(index);
  }, []);

  // Handle press end (mouse up / touch end)
  const handlePressEnd = useCallback(() => {
    setPressedIndex(-1);
  }, []);

  return {
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
    setFocusedIndex,
  };
};

// Style objects
const footerStyles = {
  position: 'fixed' as const,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  height: `${FOOTER_HEIGHT}px`,
  padding: '0 16px max(16px, 16px) 16px',
  display: 'flex' as const,
  alignItems: 'flex-end' as const,
  justifyContent: 'center' as const,
};

const barContainerStyles = {
  backgroundColor: COLORS.background,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: SHADOWS.elevated,
  border: `0.5px solid ${COLORS.border}`,
  width: '100%',
  maxWidth: `${MAX_WIDTH}px`,
  height: `${BAR_HEIGHT}px`,
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  marginBottom: '8px',
};

const navContentStyles = {
  width: '100%',
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'space-around' as const,
  padding: '0 16px',
};

const getButtonStyles = (isActive: boolean, isPressed: boolean) => {
  let background = 'transparent'; // Always transparent
  let boxShadow = 'none';
  let transform = 'none'; // No scaling to prevent overflow

  if (isPressed) {
    background = 'transparent'; // No background on press
    boxShadow = 'none';
    transform = 'none'; // No scaling to prevent overflow
  } else if (isActive) {
    // No background for active state, just icon color change
    background = 'transparent';
    boxShadow = 'none';
    transform = 'none'; // No scaling to prevent overflow
  }

  return {
    // Optimized dimensions for small screens
    width: `${BUTTON_SIZE}px`,
    height: `${BUTTON_SIZE}px`,
    minWidth: `${BUTTON_SIZE}px`,
    minHeight: `${BUTTON_SIZE}px`,
    maxWidth: `${BUTTON_SIZE}px`,
    maxHeight: `${BUTTON_SIZE}px`,
    padding: '8px', // Reduced padding for small screens
    borderRadius: '0px', // No border radius for transparent design
    display: 'flex' as const,
    flexDirection: 'row' as const, // Always row for icon-centered layout
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    background,
    color: isActive ? COLORS.activeText : COLORS.inactive, // Blue on active, gray on inactive
    border: 'none',
    cursor: 'pointer',
    position: 'relative' as const,
    transition: `all 0.2s ${TRANSITIONS.spring}`,
    outline: 'none',
    transform,
    boxShadow,
    overflow: 'visible' as const, // Allow icons to be fully visible
    // No backdrop filter needed for transparent design
  };
};

const focusIndicatorStyles = {
  position: 'absolute' as const,
  inset: '-2px',
  borderRadius: '10px',
  border: `2px solid ${COLORS.focus}`,
  pointerEvents: 'none' as const,
};

const iconStyles = (isPressed: boolean, isActive: boolean) => ({
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  fontSize: `${ICON_SIZE}px`, // iOS optimal icon size
  transition: `all 0.2s ${TRANSITIONS.spring}`,
  transform: isPressed ? 'scale(0.85)' : 'scale(1)', // iOS-style press feedback
  filter: isActive ? `drop-shadow(0 1px 3px ${COLORS.activeGlow})` : 'none', // iOS blue glow
  color: 'inherit', // Inherit from button (iOS blue on active, gray on inactive)
  width: '100%',
  height: '100%', // Always full height for centered icon
  position: 'relative' as const,
  zIndex: 1,
});

// Label styles removed - pure icon-only design

const WebFooter = memo(function WebFooter() {
  const [handle] = useRouteHandle();
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
    setFocusedIndex,
  } = useFooterNavigation();

  if (handle.back) {
    return null;
  }

  return (
    <motion.footer
      className="web-footer rounded-bar"
      role="contentinfo"
      aria-label="Điều hướng chính của ứng dụng y tế"
      variants={prefersReducedMotion ? {} : containerVariants}
      initial="hidden"
      animate="visible"
      style={footerStyles}
    >
      <div style={barContainerStyles}>
        <div style={navContentStyles}>
          <nav role="navigation" aria-label="Điều hướng tab chính" style={{ display: 'contents' }}>
            <div role="tablist" style={{ display: 'contents' }}>
              {NAV_ITEMS.map((item, index) => {
                const isActive = location.pathname === item.path;
                const isPressed = pressedIndex === index;
                const isFocused = focusedIndex === index;
                const isHovered = hoveredIndex === index;

                return (
                  <motion.button
                    key={item.id}
                    ref={(el) => (itemRefs.current[index] = el)}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={item.ariaLabel}
                    tabIndex={focusedIndex === index ? 0 : -1}
                    onClick={() => handleItemPress(item, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={() => handleFocus(index)}
                    onBlur={handleBlur}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onMouseDown={() => handlePressStart(index)}
                    onMouseUp={handlePressEnd}
                    onTouchStart={() => handlePressStart(index)}
                    onTouchEnd={handlePressEnd}
                    variants={prefersReducedMotion ? {} : itemVariants}
                    whileTap="tap"
                    style={getButtonStyles(isActive, isPressed)}
                  >
                    {focusedIndex === index && <div style={focusIndicatorStyles} />}

                    {/* Active state is now handled by button background */}

                    <div style={iconStyles(isPressed, isActive)} title={item.name}>
                      {item.icon}
                    </div>

                    {/* Pure icon-only design - no labels for cleaner look */}
                  </motion.button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </motion.footer>
  );
});

WebFooter.displayName = 'WebFooter';

export default WebFooter;
