import { ReactNode, memo } from 'react';
import { motion } from 'framer-motion';
import ArrowRightIcon from './icons/arrow-right';
import { To } from 'react-router-dom';
import TransitionLink from './transition-link';
import {
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TYPOGRAPHY,
  ANIMATIONS,
  TOUCH_TARGETS,
  combineClasses,
} from '@/styles/medical-design-system';

interface SectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  viewMore?: To;
  isCard?: boolean;
  noPadding?: boolean;
  noBackground?: boolean;
  accentColor?: string;
  icon?: ReactNode;
  highlighted?: boolean;
  spacing?: 'default' | 'compact' | 'spacious';
  animateEntry?: boolean;
  borderStyle?: 'none' | 'subtle' | 'accent';
}

const Section = memo(function Section({
  children,
  className = '',
  title,
  viewMore,
  isCard = false,
  noPadding = false,
  noBackground = false,
  accentColor = 'blue',
  icon,
  highlighted = false,
  spacing = 'default',
  animateEntry = false,
  borderStyle = 'none',
}: SectionProps) {
  // Get medical color classes based on accent color
  const getAccentClasses = (color: string) => {
    const colorMap = {
      blue: {
        iconBg: 'bg-blue-50 text-blue-600',
        underline: 'bg-blue-500',
        buttonBg: 'bg-blue-50 text-blue-600',
        buttonHover: 'hover:bg-blue-100 active:bg-blue-200',
        iconColor: 'text-blue-500',
        highlightBg: 'bg-blue-50',
        highlightBorder: 'border-blue-200',
      },
      green: {
        iconBg: 'bg-green-50 text-green-600',
        underline: 'bg-green-500',
        buttonBg: 'bg-green-50 text-green-600',
        buttonHover: 'hover:bg-green-100 active:bg-green-200',
        iconColor: 'text-green-500',
        highlightBg: 'bg-green-50',
        highlightBorder: 'border-green-200',
      },
      teal: {
        iconBg: 'bg-teal-50 text-teal-600',
        underline: 'bg-teal-500',
        buttonBg: 'bg-teal-50 text-teal-600',
        buttonHover: 'hover:bg-teal-100 active:bg-teal-200',
        iconColor: 'text-teal-500',
        highlightBg: 'bg-teal-50',
        highlightBorder: 'border-teal-200',
      },
      purple: {
        iconBg: 'bg-purple-50 text-purple-600',
        underline: 'bg-purple-500',
        buttonBg: 'bg-purple-50 text-purple-600',
        buttonHover: 'hover:bg-purple-100 active:bg-purple-200',
        iconColor: 'text-purple-500',
        highlightBg: 'bg-purple-50',
        highlightBorder: 'border-purple-200',
      },
      orange: {
        iconBg: 'bg-orange-50 text-orange-600',
        underline: 'bg-orange-500',
        buttonBg: 'bg-orange-50 text-orange-600',
        buttonHover: 'hover:bg-orange-100 active:bg-orange-200',
        iconColor: 'text-orange-500',
        highlightBg: 'bg-orange-50',
        highlightBorder: 'border-orange-200',
      },
      red: {
        iconBg: 'bg-red-50 text-red-600',
        underline: 'bg-red-500',
        buttonBg: 'bg-red-50 text-red-600',
        buttonHover: 'hover:bg-red-100 active:bg-red-200',
        iconColor: 'text-red-500',
        highlightBg: 'bg-red-50',
        highlightBorder: 'border-red-200',
      },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const accentClasses = getAccentClasses(accentColor);

  // Determine spacing classes based on spacing prop
  const getSpacingClasses = (spacingType: string) => {
    const spacingMap = {
      default: {
        margin: SPACING.margin.section,
        padding: SPACING.padding.section,
      },
      compact: {
        margin: 'my-3',
        padding: 'px-3 py-3',
      },
      spacious: {
        margin: 'my-8 md:my-12',
        padding: 'px-4 md:px-6 py-6 md:py-8',
      },
    };
    return spacingMap[spacingType as keyof typeof spacingMap] || spacingMap.default;
  };

  const spacingClasses = getSpacingClasses(spacing);

  // Modern header with accent and icon using medical design system
  const header = (title || viewMore) && (
    <div
      className={combineClasses(
        'flex items-center justify-between flex-wrap gap-2',
        SPACING.margin.card,
        highlighted && 'pb-3'
      )}
    >
      {title && (
        <div className="flex items-center">
          {icon && (
            <div
              className={combineClasses(
                'mr-2.5 flex items-center justify-center h-8 w-8',
                BORDER_RADIUS.button,
                accentClasses.iconBg
              )}
            >
              {icon}
            </div>
          )}
          <div className="relative">
            <h2 className={combineClasses(TYPOGRAPHY.sectionTitle, 'relative', highlighted && 'font-bold')}>
              {title}
              <span
                className={combineClasses(
                  'absolute -bottom-1 left-0 h-[3px] rounded-full',
                  highlighted ? 'w-16' : 'w-8',
                  accentClasses.underline
                )}
              ></span>
            </h2>
          </div>
        </div>
      )}

      {viewMore && (
        <TransitionLink
          to={viewMore}
          className={combineClasses(
            'flex items-center justify-center p-2',
            BORDER_RADIUS.pill,
            accentClasses.buttonBg,
            accentClasses.buttonHover,
            'transition-all',
            ANIMATIONS.fast,
            TOUCH_TARGETS.interactive
          )}
        >
          <div className={combineClasses(TYPOGRAPHY.button, 'font-medium')}>Xem thêm</div>
        </TransitionLink>
      )}
    </div>
  );

  const containerPadding = noPadding ? '' : spacing === 'default' ? SPACING.padding.section : spacingClasses.padding;
  let sectionClasses = combineClasses(
    containerPadding,
    className,
    spacing === 'default' ? SPACING.margin.section : spacingClasses.margin
  );
  let contentClasses = '';

  // Define border styles
  const getBorderClasses = () => {
    if (borderStyle === 'none') return noBackground ? '' : 'border border-gray-50';
    if (borderStyle === 'subtle') return 'border border-gray-100';
    if (borderStyle === 'accent') return `border-2 ${accentClasses.highlightBorder}`;
    return noBackground ? '' : 'border border-gray-50';
  };

  // Enhanced card styles
  if (isCard) {
    contentClasses = combineClasses(
      noBackground ? '' : highlighted ? accentClasses.highlightBg : 'bg-white',
      BORDER_RADIUS.cardLarge,
      highlighted ? SHADOWS.cardActive : SHADOWS.card,
      getBorderClasses(),
      SPACING.padding.cardLarge,
      `hover:${highlighted ? SHADOWS.cardActive : SHADOWS.cardHover}`,
      'transition-all',
      ANIMATIONS.normal
    );
  }

  // Animation variants for entry animation
  const entryAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const sectionContent = isCard ? (
    <div className={`flex flex-col justify-center gap-3 ${contentClasses}`}>
      {header}
      {children}
    </div>
  ) : (
    <>
      {header}
      {children}
    </>
  );

  // Apply a highlighted background if not a card but highlighted is true
  const wrapperClasses =
    !isCard && highlighted
      ? combineClasses('py-4 px-3', BORDER_RADIUS.cardLarge, accentClasses.highlightBg, getBorderClasses())
      : '';

  // Conditionally wrap with motion component for animation
  return animateEntry ? (
    <motion.div
      className={sectionClasses}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={entryAnimation}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {wrapperClasses ? <div className={wrapperClasses}>{sectionContent}</div> : sectionContent}
    </motion.div>
  ) : (
    <div className={sectionClasses}>
      {wrapperClasses ? <div className={wrapperClasses}>{sectionContent}</div> : sectionContent}
    </div>
  );
});

export default Section;
