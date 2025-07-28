import { useRouteHandle } from '@/hooks';
import TransitionLink from './transition-link';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MedicalIcons } from './icons/medical-icons';

// Enhanced medical navigation items with healthcare icons and accessibility
const NAV_ITEMS = [
  {
    name: 'Trang chủ',
    path: '/',
    ariaLabel: 'Trang chủ ứng dụng y tế',
    icon: ({ active }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all duration-300 ${active ? 'text-primary' : 'text-text-muted'}`}
        aria-hidden="true"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  },
  {
    name: 'Dịch vụ',
    path: '/service-prices',
    ariaLabel: 'Dịch vụ y tế và khám chữa bệnh',
    icon: ({ active }) => (
      <MedicalIcons.Stethoscope
        className={`transition-all duration-300 ${active ? 'text-primary' : 'text-text-muted'}`}
        aria-hidden="true"
      />
    ),
  },
  {
    name: 'Đặt lịch',
    path: '/booking',
    ariaLabel: 'Đặt lịch khám bệnh và hẹn tái khám',
    isSpecial: true,
    icon: ({ active }) => (
      <div className="relative">
        <motion.div
          initial={{ opacity: 0.2, scale: 0.9 }}
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-primary blur-md"
        ></motion.div>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center justify-center h-14 w-14 rounded-full ${
            active ? 'bg-gradient-to-r from-primary-dark to-primary' : 'bg-gradient-to-r from-primary to-primary-light'
          } -mt-7 shadow-medical`}
        >
          <MedicalIcons.MedicalCross size="lg" className="text-text-inverse" aria-hidden="true" />
        </motion.div>
      </div>
    ),
  },
  {
    name: 'Bác sĩ',
    path: '/doctor',
    ariaLabel: 'Thông tin bác sĩ và chuyên khoa',
    icon: ({ active }) => (
      <MedicalIcons.User
        className={`transition-all duration-300 ${active ? 'text-primary' : 'text-text-muted'}`}
        aria-hidden="true"
      />
    ),
  },
  {
    name: 'Giới thiệu',
    path: '/about',
    ariaLabel: 'Thông tin giới thiệu và liên hệ',
    icon: ({ active }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all duration-300 ${active ? 'text-primary' : 'text-text-muted'}`}
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="5"></circle>
        <path d="M20 21a8 8 0 1 0-16 0"></path>
      </svg>
    ),
  },
];

export default function Footer() {
  const [handle] = useRouteHandle();
  const location = useLocation();

  if (handle.back) {
    return null;
  }

  return (
    <motion.div
      role="contentinfo"
      aria-label="Điều hướng chính của ứng dụng y tế"
      className="relative w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Modern Medical Footer Background */}
      <div className="absolute bottom-0 left-0 right-0 h-20">
        {/* Glass morphism background */}
        <div className="absolute inset-0 bg-surface/95 backdrop-blur-xl border-t border-border shadow-footer"></div>

        {/* Medical gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent"></div>

        {/* Subtle medical pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 60 60" className="w-full h-full">
            <defs>
              <pattern id="footer-medical" patternUnits="userSpaceOnUse" width="30" height="30">
                <circle cx="15" cy="15" r="1" fill="currentColor" className="text-primary" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-medical)" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full pb-safe" role="navigation" aria-label="Điều hướng chính">
        <div className="mx-auto grid" style={{ gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)` }}>
          {NAV_ITEMS.map((item, index) => (
            <TransitionLink
              to={item.path}
              key={item.path}
              aria-label={item.ariaLabel || item.name}
              className={`flex flex-col items-center justify-center py-sm min-w-touch min-h-touch ${item.isSpecial ? 'pt-0' : 'pt-sm'} medical-focus`}
            >
              {({ isActive }) => (
                <motion.div
                  className="relative flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Icon Container */}
                  <motion.div
                    className="relative"
                    animate={
                      isActive && !item.isSpecial
                        ? {
                            scale: [1, 1.1, 1],
                            transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                          }
                        : {}
                    }
                  >
                    <item.icon active={isActive || item.path === location.pathname} />

                    {/* Active indicator */}
                    {isActive && !item.isSpecial && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.div>

                  {/* Label */}
                  <motion.div
                    className={`text-xs font-medium mt-1.5 transition-colors duration-200 ${
                      isActive || item.path === location.pathname ? 'text-primary font-semibold' : 'text-text-muted'
                    }`}
                    animate={{
                      y: isActive && !item.isSpecial ? [0, -2, 0] : 0,
                      transition: { duration: 0.3 },
                    }}
                  >
                    {item.name}
                  </motion.div>
                </motion.div>
              )}
            </TransitionLink>
          ))}
        </div>
      </nav>
    </motion.div>
  );
}
