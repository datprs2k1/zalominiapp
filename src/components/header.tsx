import { useAtomValue } from 'jotai';
import { To, useLocation, useNavigate } from 'react-router-dom';
import { useRouteHandle } from '@/hooks';
import { BackIcon } from './icons/back';
import { getConfig } from '@/utils/miscellaneous';
import UserProfile from './user-profile';
import { useEffect, useState } from 'react';
import { customTitleState } from '@/state';
import { decodeHTML } from '@/utils/decodeHTML';
import { motion } from 'framer-motion';
import { MedicalIcons } from './icons/medical-icons';
import { getColorToken, COLOR_TOKENS } from '@/styles/unified-color-system';

function ProfileHeader() {
  return <UserProfile />;
}

function CustomTitle() {
  const title = useAtomValue(customTitleState);
  return decodeHTML(title);
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [handle] = useRouteHandle();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showMainHeader = !handle?.back;
  const showBack = location.key !== 'default' && handle?.back !== false;

  // Enhanced accessibility and medical context
  const headerRole = showMainHeader ? 'banner' : 'navigation';
  const headerAriaLabel = showMainHeader
    ? 'Trang chủ ứng dụng y tế'
    : `Điều hướng: ${handle.title === 'custom' ? 'Trang tùy chỉnh' : handle.title}`;

  return (
    <motion.header
      role={headerRole}
      aria-label={headerAriaLabel}
      className={`flex-none w-full min-h-touch transition-all duration-300 ${
        showMainHeader ? 'bg-transparent' : 'bg-surface border-b border-border'
      } ${
        scrolled
          ? 'sticky top-0 z-50 shadow-medical bg-surface/95 backdrop-blur-md border-b border-border'
          : 'relative z-30'
      } px-md sm:px-lg pt-safe-enhanced pb-sm sm:pb-md`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Medical Header Background */}
      {showMainHeader && (
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Enhanced Medical Gradient */}
          <div
            className="absolute h-[180px] sm:h-[230px] w-full"
            style={{
              background: `linear-gradient(135deg, ${getColorToken('primary')}08 0%, ${getColorToken('background')} 50%, ${getColorToken('secondary')}05 100%)`,
            }}
          />

          {/* Medical Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <pattern id="medical-cross" patternUnits="userSpaceOnUse" width="20" height="20">
                  <path d="M8 0v20M0 8h20" stroke={getColorToken('primary')} strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#medical-cross)" />
            </svg>
          </div>

          {/* Floating Medical Icons */}
          <div className="absolute top-4 right-4 opacity-10">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </motion.div>
          </div>

          <div className="absolute top-8 left-8 opacity-10">
            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
              <svg className="w-6 h-6 text-secondary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.595a5.904 5.904 0 00-3.996-1.558 5.942 5.942 0 00-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 00.792-.409l7.415-7.415c2.354-2.353 2.355-6.049-.002-8.416a5.938 5.938 0 00-4.209-1.754A5.906 5.906 0 0012 4.595z" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Header Content */}
      <div className="flex items-center justify-between min-h-[48px] relative z-20">
        {showMainHeader ? (
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {handle.profile ? (
              <ProfileHeader />
            ) : (
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center">
                  {/* Enhanced Medical Logo with unified color system */}
                  <motion.div
                    className="rounded-xl p-2 mr-3 shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                    style={{
                      background: `linear-gradient(to right, ${getColorToken('primary')}, ${getColorToken('primary-dark')})`,
                      boxShadow: `0 2px 8px ${getColorToken('primary')}25`,
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: `0 4px 12px ${getColorToken('primary')}40`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    role="img"
                    aria-label="Logo ứng dụng y tế"
                  >
                    <MedicalIcons.MedicalCross className="h-6 w-6 text-text-on-primary" aria-hidden="true" />
                  </motion.div>

                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-primary">{getConfig((c) => c.app.title)}</span>
                    <span className="text-xs font-medium text-secondary">Chăm sóc sức khỏe toàn diện</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="flex items-center w-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {showBack && (
              <motion.button
                className="p-2 mr-2 -ml-2 rounded-full cursor-pointer medical-focus hover:bg-primary/10 transition-colors min-w-touch min-h-touch flex items-center justify-center"
                onClick={() =>
                  navigate(-1 as To, {
                    viewTransition: true,
                  })
                }
                aria-label="Quay lại trang trước"
                title="Quay lại trang trước"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
              >
                <BackIcon aria-hidden="true" />
              </motion.button>
            )}
            <div className="text-lg sm:text-xl font-semibold truncate flex-1 text-text-primary">
              {handle.title === 'custom' ? <CustomTitle /> : handle.title}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
