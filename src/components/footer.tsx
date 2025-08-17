import TransitionLink from './transition-link';
import HomeIcon from './icons/home';
import VoucherIcon from './icons/voucher';
import GiftIcon from './icons/gift';
import ProfileIcon from './icons/profile';
import DealIcon from './icons/deal';
import { useRouteHandle } from '@/hooks';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

const NAV_ITEMS = [
  {
    name: 'Trang chủ',
    path: '/',
    icon: HomeIcon,
  },
  {
    name: 'Dich vu',
    path: '/service-price',
    icon: VoucherIcon,
  },
  {
    name: 'Dat lich',
    path: '/booking',
    icon: DealIcon,
  },
  {
    name: 'Bac si',
    path: '/doctor',
    icon: GiftIcon,
  },
  {
    name: 'Thong tin',
    path: '/about',
    icon: ProfileIcon,
  },
];

export default function Footer() {
  const [handle] = useRouteHandle();
  const { triggerSelectionFeedback } = useHapticFeedback();

  if (handle.back) {
    return <></>;
  }

  const handleNavClick = () => {
    triggerSelectionFeedback();
  };

  return (
    <div className="w-full relative">
      {/* White background for mobile performance */}
      <div
        className="absolute inset-0 bg-white backdrop-blur-sm"
        style={{
          contain: 'layout style paint',
          transform: 'translate3d(0, 0, 0)', // GPU acceleration
        }}
      ></div>

      <nav
        className="w-full relative z-10 grid justify-center border-t border-gray-200 shadow-lg backdrop-blur-sm"
        style={{
          gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)`,
          paddingTop: 'clamp(0.5rem, 2vw, 1rem)', // Responsive padding
          paddingLeft: 'clamp(0.25rem, 1vw, 0.75rem)',
          paddingRight: 'clamp(0.25rem, 1vw, 0.75rem)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 1.25rem)', // Enhanced safe area
          contain: 'layout style paint',
          backgroundColor: 'rgba(255, 255, 255, 0.95)', // White background with slight transparency
          transform: 'translate3d(0, 0, 0)', // GPU acceleration
        }}
        role="navigation"
        aria-label="Điều hướng chính"
      >
        {NAV_ITEMS.map((item, index) => (
          <TransitionLink
            to={item.path}
            key={item.path}
            className="flex flex-col items-center justify-center rounded-xl transition-all duration-300 ease-out active:scale-95 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-2 focus:ring-offset-white"
            onClick={handleNavClick}
            style={{
              willChange: 'transform',
              minHeight: '56px', // Optimized touch target (exceeds iOS 44px & Android 48dp)
              minWidth: '56px', // Optimized touch target
              padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.25rem, 1vw, 0.5rem)', // Responsive padding
              gap: 'clamp(0.125rem, 0.5vw, 0.25rem)', // Responsive gap between icon and text
              contain: 'layout style paint',
              transform: 'translate3d(0, 0, 0)', // GPU acceleration
            }}
            aria-label={`Điều hướng đến ${item.name}`}
            role="tab"
            aria-selected={false}
            tabIndex={0}
          >
            {({ isActive }) => (
              <>
                {/* Mobile-optimized icon container with responsive sizing */}
                <div
                  className={`
                    flex justify-center items-center rounded-lg transition-all duration-300 ease-out
                    ${
                      isActive
                        ? 'bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-300/30 scale-105'
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200'
                    }
                  `}
                  style={{
                    width: 'clamp(28px, 7vw, 36px)', // Responsive icon container size
                    height: 'clamp(28px, 7vw, 36px)',
                    willChange: 'transform',
                    transform: 'translate3d(0, 0, 0)', // GPU acceleration
                    contain: 'layout style paint',
                    backgroundColor: isActive ? '#64B5F6' : '#F3F4F6', // Active: Serene Blue, Inactive: Light Gray
                  }}
                  aria-hidden="true"
                >
                  <div
                    className={`${isActive ? 'text-white' : 'text-gray-600'} transition-colors duration-300`}
                    style={{
                      width: 'clamp(18px, 4.5vw, 24px)', // Responsive icon size
                      height: 'clamp(18px, 4.5vw, 24px)',
                    }}
                  >
                    <item.icon active={isActive} />
                  </div>
                </div>

                {/* Mobile-optimized label with responsive typography */}
                <span
                  className={`
                    font-medium leading-tight text-center transition-all duration-300 max-w-full
                    ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-600 hover:text-gray-800'}
                  `}
                  style={{
                    fontSize: 'clamp(10px, 2.5vw, 12px)', // Responsive font size
                    lineHeight: '1.3', // Better readability
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontWeight: isActive ? '600' : '500',
                    maxWidth: '100%',
                    // Ensure text doesn't break on small screens
                    wordBreak: 'keep-all',
                    hyphens: 'none',
                  }}
                >
                  {item.name}
                </span>
              </>
            )}
          </TransitionLink>
        ))}
      </nav>
    </div>
  );
}
