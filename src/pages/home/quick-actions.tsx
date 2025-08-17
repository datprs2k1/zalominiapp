import TransitionLink from '@/components/transition-link';
import emergencyIcon from '@/static/icons/emergency-simple.svg';
import calendarIcon from '@/static/icons/calendar-simple.svg';
import historyIcon from '@/static/icons/history-simple.svg';
import chatIcon from '@/static/icons/chat-simple.svg';
import labIcon from '@/static/icons/lab-simple.svg';
import gridIcon from '@/static/icons/grid-simple.svg';
import { To } from 'react-router-dom';
import { Grid, Section } from '@/components/ui';
import { cn } from '@/utils/cn';

interface QuickActionProps {
  to: To;
  icon: string;
  title: string;
  priority?: 'emergency' | 'primary' | 'secondary' | 'tertiary' | 'orange' | 'teal';
  size?: 'large' | 'medium' | 'small';
  variant?: 'emergency' | 'primary' | 'secondary' | 'tertiary' | 'orange' | 'teal';
  subtitle?: string;
}

const QuickAction = ({
  icon,
  title,
  to,
  priority = 'tertiary',
  size = 'medium',
  variant = 'tertiary',
  subtitle,
}: QuickActionProps) => {
  // Compact mobile-optimized size configurations for Android and iOS
  const sizeConfig = {
    large: {
      container: 'h-18 px-2 py-2',
      icon: 'w-6 h-6',
      text: 'text-xs font-medium',
      subtitle: 'text-xs font-normal',
      iconContainer: 'w-10 h-10 mb-1',
      spacing: 'space-y-0.5',
    },
    medium: {
      container: 'h-18 px-2 py-2',
      icon: 'w-6 h-6',
      text: 'text-xs font-medium',
      subtitle: 'text-xs font-normal',
      iconContainer: 'w-10 h-10 mb-1',
      spacing: 'space-y-0.5',
    },
    small: {
      container: 'h-18 px-2 py-2',
      icon: 'w-6 h-6',
      text: 'text-xs font-medium',
      subtitle: 'text-xs font-normal',
      iconContainer: 'w-10 h-10 mb-1',
      spacing: 'space-y-0.5',
    },
  };

  // Serene Blues healthcare variant color configurations
  const variantConfig = {
    emergency: {
      bg: 'bg-gradient-to-br from-red-500 to-blue-600 backdrop-blur-sm',
      hover: 'hover:from-red-600 hover:to-blue-700',
      text: 'text-white',
      shadow: 'shadow-lg shadow-blue-500/25',
      ring: 'focus:ring-blue-500/50 focus:ring-2',
      iconBg: 'bg-white/30 backdrop-blur-sm',
      border: 'border border-blue-300/20',
    },
    primary: {
      bg: 'bg-gradient-to-br from-blue-400 to-blue-600 backdrop-blur-sm',
      hover: 'hover:from-blue-500 hover:to-blue-700',
      text: 'text-white',
      shadow: 'shadow-lg shadow-blue-500/25',
      ring: 'focus:ring-blue-500/50 focus:ring-2',
      iconBg: 'bg-white/30 backdrop-blur-sm',
      border: 'border border-blue-300/20',
    },
    secondary: {
      bg: 'bg-gradient-to-br from-blue-300 to-blue-500 backdrop-blur-sm',
      hover: 'hover:from-blue-400 hover:to-blue-600',
      text: 'text-white',
      shadow: 'shadow-lg shadow-blue-400/25',
      ring: 'focus:ring-blue-400/50 focus:ring-2',
      iconBg: 'bg-white/30 backdrop-blur-sm',
      border: 'border border-blue-200/20',
    },
    tertiary: {
      bg: 'bg-gradient-to-br from-sky-400 to-blue-500 backdrop-blur-sm',
      hover: 'hover:from-sky-500 hover:to-blue-600',
      text: 'text-white',
      shadow: 'shadow-lg shadow-sky-500/25',
      ring: 'focus:ring-sky-500/50 focus:ring-2',
      iconBg: 'bg-white/30 backdrop-blur-sm',
      border: 'border border-sky-300/20',
    },
    orange: {
      bg: 'bg-gradient-to-br from-slate-400 to-blue-500 backdrop-blur-sm',
      hover: 'hover:from-slate-500 hover:to-blue-600',
      text: 'text-white',
      shadow: 'shadow-lg shadow-blue-500/25',
      ring: 'focus:ring-blue-500/50 focus:ring-2',
      iconBg: 'bg-white/30 backdrop-blur-sm',
      border: 'border border-blue-300/20',
    },
    teal: {
      bg: 'bg-gradient-to-br from-indigo-400 to-blue-500 backdrop-blur-sm',
      hover: 'hover:from-indigo-500 hover:to-blue-600',
      text: 'text-white',
      shadow: 'shadow-lg shadow-blue-500/25',
      ring: 'focus:ring-blue-500/50 focus:ring-2',
      iconBg: 'bg-white/30 backdrop-blur-sm',
      border: 'border border-blue-300/20',
    },
  };

  const config = sizeConfig[size];
  const colors = variantConfig[variant];

  return (
    <TransitionLink
      to={to}
      className={cn(
        'block group rounded-2xl transition-all duration-300 ease-out relative overflow-hidden',
        'focus:outline-none focus:ring-2 focus:ring-offset-1',
        'active:scale-95 hover:scale-102',
        'transform-gpu will-change-transform',
        config.container,
        colors.bg,
        colors.hover,
        colors.shadow,
        colors.ring,
        colors.border
      )}
      aria-label={title}
      role="button"
    >
      <div className="flex flex-col items-center justify-center h-full relative p-1">
        {/* Icon Container */}
        <div className="relative flex-shrink-0">
          <div
            className={cn(
              'flex items-center justify-center rounded-2xl transition-all duration-300',
              'ring-1 ring-white/30 group-hover:ring-white/50',
              'group-hover:scale-105 transform-gpu',
              config.iconContainer,
              colors.iconBg
            )}
          >
            <img
              src={icon}
              className={cn(
                'transition-all duration-300 group-hover:scale-110 transform-gpu',
                config.icon,
                'text-white drop-shadow-sm'
              )}
              alt={title}
              style={{ filter: 'brightness(0) invert(1) drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
            />
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="flex flex-col items-center text-center mt-1 min-h-[1.8rem] justify-center">
          <span
            className={cn(
              'text-xs font-semibold leading-tight text-center tracking-wide',
              'drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300',
              colors.text
            )}
          >
            {title}
          </span>
          {subtitle && (
            <span
              className={cn(
                'text-xs font-normal text-center opacity-90 tracking-wide',
                'drop-shadow-sm transition-all duration-300',
                colors.text
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </TransitionLink>
  );
};

interface QuickActionsProps {
  className?: string;
}

const QuickActions = ({ className }: QuickActionsProps) => {
  return (
    <section className={cn('max-w-7xl mx-auto px-3 md:px-4', className)} aria-label="Quick Actions" role="navigation">
      <div className="space-y-2 py-1">
        {/* First Row - Critical & Primary Actions */}
        <div className="grid grid-cols-3 gap-2">
          <QuickAction
            to="/emergency"
            icon={emergencyIcon}
            title="CẤP CỨU"
            priority="primary"
            size="medium"
            variant="primary"
          />
          <QuickAction
            to="/booking"
            icon={calendarIcon}
            title="Đặt lịch"
            priority="primary"
            size="medium"
            variant="primary"
          />
          <QuickAction
            to="/schedule"
            icon={historyIcon}
            title="Lịch sử"
            priority="primary"
            size="medium"
            variant="primary"
          />
        </div>

        {/* Second Row - Secondary & Support Actions */}
        <div className="grid grid-cols-3 gap-2">
          <QuickAction
            to="/consultation"
            icon={chatIcon}
            title="Tư vấn"
            priority="tertiary"
            size="medium"
            variant="tertiary"
          />
          <QuickAction
            to="/lab-results"
            icon={labIcon}
            title="Xét nghiệm"
            priority="tertiary"
            size="medium"
            variant="tertiary"
          />
          <QuickAction
            to="/services"
            icon={gridIcon}
            title="Dịch vụ"
            priority="tertiary"
            size="medium"
            variant="tertiary"
          />
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
