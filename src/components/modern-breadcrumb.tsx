import { motion } from 'framer-motion';
import { MedicalIcon } from './medical/MedicalServiceComponents';
import TransitionLink from './transition-link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: 'home' | 'stethoscope' | 'heart' | 'pill';
}

interface ModernBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function ModernBreadcrumb({ items, className = '' }: ModernBreadcrumbProps) {
  return (
    <motion.nav
      className={`flex items-center space-x-2 text-sm ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Breadcrumb navigation"
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {index > 0 && (
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          
          {item.href ? (
            <TransitionLink
              to={item.href}
              className="flex items-center space-x-1 text-primary hover:text-primary-dark transition-colors duration-200 group"
            >
              {item.icon && (
                <MedicalIcon
                  type={item.icon}
                  size="sm"
                  className="text-primary group-hover:text-primary-dark transition-colors duration-200"
                />
              )}
              <span className="hover:underline">{item.label}</span>
            </TransitionLink>
          ) : (
            <div className="flex items-center space-x-1 text-gray-600">
              {item.icon && (
                <MedicalIcon
                  type={item.icon}
                  size="sm"
                  className="text-gray-500"
                />
              )}
              <span className="font-medium">{item.label}</span>
            </div>
          )}
        </motion.div>
      ))}
    </motion.nav>
  );
}

// Quick action buttons component
interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'emergency';
  className?: string;
}

export function QuickActionButton({
  icon,
  label,
  onClick,
  variant = 'primary',
  className = '',
}: QuickActionButtonProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white',
    secondary: 'bg-gradient-to-r from-secondary to-secondary-dark hover:from-secondary-dark hover:to-secondary text-white',
    emergency: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
  };

  return (
    <motion.button
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}

// Floating notification component
interface FloatingNotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
  onClose: () => void;
}

export function FloatingNotification({
  message,
  type = 'info',
  isVisible,
  onClose,
}: FloatingNotificationProps) {
  const typeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black',
  };

  const typeIcons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <motion.div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${typeClasses[type]}`}
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        x: isVisible ? 0 : 100,
        scale: isVisible ? 1 : 0.8,
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <span className="text-lg">{typeIcons[type]}</span>
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-lg hover:opacity-70 transition-opacity"
      >
        ×
      </button>
    </motion.div>
  );
}

// Progress indicator component
interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function ProgressIndicator({
  steps,
  currentStep,
  className = '',
}: ProgressIndicatorProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              index <= currentStep
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-200 text-gray-500'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {index < currentStep ? '✓' : index + 1}
          </motion.div>
          
          {index < steps.length - 1 && (
            <motion.div
              className={`h-1 w-16 mx-2 rounded-full transition-all duration-500 ${
                index < currentStep ? 'bg-primary' : 'bg-gray-200'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
