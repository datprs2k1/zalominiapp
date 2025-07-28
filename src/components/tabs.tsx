import { createElement, FunctionComponent, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MEDICAL_COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TOUCH_TARGETS,
  combineClasses,
} from '@/styles/medical-design-system';
import { MedicalSpinner, AnimatedMedicalIcon } from '@/components/medical-animations';

interface Tab {
  name: string;
  content: FunctionComponent;
  icon?: 'cross' | 'stethoscope' | 'heartbeat' | 'pill';
  ariaLabel?: string;
}

interface TabsProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  tabs: Tab[];
  className?: string;
  ariaLabel?: string;
}

// Medical-themed tab animations
const tabAnimations = {
  container: {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
        staggerChildren: 0.1,
      },
    },
  },
  tab: {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.15 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  },
  indicator: {
    initial: { scaleX: 0 },
    animate: {
      scaleX: 1,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
    exit: {
      scaleX: 0,
      transition: { duration: 0.2 },
    },
  },
  content: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  },
};

function Tabs({ activeTab, onTabChange, tabs, className = '', ariaLabel }: TabsProps) {
  return (
    <motion.div
      className={combineClasses('flex flex-col flex-1 overflow-hidden', className)}
      variants={tabAnimations.container}
      initial="initial"
      animate="animate"
      role="tablist"
      aria-label={ariaLabel || 'Danh sách tab'}
    >
      {/* Medical-themed Tab Navigation */}
      <motion.div
        className={combineClasses(
          'flex-none flex items-start justify-start',
          SPACING.padding.section,
          'gap-2 sm:gap-4',
          'bg-white',
          'overflow-x-auto scrollbar-hide',
          'border-b border-gray-100',
          SHADOWS.card
        )}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {tabs.map(({ name, icon, ariaLabel: tabAriaLabel }, index) => {
          const isActive = activeTab === index;

          return (
            <motion.button
              key={index}
              className={combineClasses(
                'flex-none flex flex-col items-center relative',
                'py-3 sm:py-4 px-2 sm:px-3',
                'transition-all duration-300',
                'group select-none',
                TOUCH_TARGETS.interactive,
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                isActive ? 'focus:ring-blue-500' : 'focus:ring-gray-300'
              )}
              onClick={() => onTabChange(index)}
              variants={tabAnimations.tab}
              whileHover="hover"
              whileTap="tap"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${index}`}
              aria-label={tabAriaLabel || `Tab ${name}`}
              tabIndex={isActive ? 0 : -1}
            >
              {/* Medical Icon */}
              {icon && (
                <motion.div
                  className="mb-1"
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
                >
                  <AnimatedMedicalIcon
                    type={icon}
                    size="sm"
                    color={isActive ? 'primary' : 'secondary'}
                    animate={isActive}
                  />
                </motion.div>
              )}

              {/* Tab Label */}
              <motion.div
                className={combineClasses(
                  'truncate px-2 py-1',
                  BORDER_RADIUS.button,
                  'transition-all duration-300',
                  'text-sm font-medium',
                  isActive ? 'text-white font-semibold shadow-sm' : 'text-gray-600 group-hover:text-gray-800'
                )}
                style={{
                  backgroundColor: isActive ? MEDICAL_COLORS.primary[500] : 'transparent',
                  color: isActive ? 'white' : undefined,
                }}
                animate={
                  isActive
                    ? {
                        backgroundColor: MEDICAL_COLORS.primary[500],
                        color: 'white',
                      }
                    : {
                        backgroundColor: 'transparent',
                      }
                }
                transition={{ duration: 0.3 }}
              >
                {name}
              </motion.div>

              {/* Active Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden">
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="h-full rounded-t"
                      style={{
                        background: `linear-gradient(90deg, ${MEDICAL_COLORS.primary[500]}, ${MEDICAL_COLORS.secondary[500]})`,
                      }}
                      variants={tabAnimations.indicator}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      layoutId="activeTabIndicator"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{ backgroundColor: MEDICAL_COLORS.primary[50] }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: isActive ? 0 : 0.5 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          );
        })}
      </motion.div>

      {/* Medical-themed Tab Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Suspense
          fallback={
            <motion.div
              className="flex flex-col justify-center items-center p-8 min-h-[200px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MedicalSpinner size="lg" color="primary" />
              <motion.p
                className="text-sm font-medium text-gray-600 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Đang tải nội dung y tế...
              </motion.p>
            </motion.div>
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabAnimations.content}
              initial="initial"
              animate="animate"
              exit="exit"
              role="tabpanel"
              id={`tabpanel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              className="h-full"
            >
              {createElement(tabs[activeTab].content)}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>
    </motion.div>
  );
}

export default Tabs;
