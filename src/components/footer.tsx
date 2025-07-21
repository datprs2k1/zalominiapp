import HorizontalDivider from './horizontal-divider';
import { useAtomValue } from 'jotai';
import TransitionLink from './transition-link';
import HomeIcon from './icons/home';
import ExploreIcon from './icons/explore';
import ChatIcon from './icons/cart';
import ProfileIcon from './icons/profile';
import BigPlusIcon from './icons/big-plus';
import { useRouteHandle } from '@/hooks';
import FooterWave from './icons/footer-wave';
import { useEffect, useRef, useState } from 'react';
import book from '@/static/book.svg';
import history from '@/static/history.svg';
import all from '@/static/services/all.svg';
import hospital from '@/static/services/hospital.svg';
import QuickAccessIcon from './icons/quick-access';

interface QuickAccessItem {
  to: string;
  icon: string;
  title: string;
}

function QuickAccessButton({ active }: { active?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    // Add a pulsing animation every 10 seconds when menu is closed
    let pulseInterval: number | undefined;
    if (!isOpen) {
      pulseInterval = window.setInterval(() => {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 1500);
      }, 10000);
    }
    return () => {
      if (pulseInterval) clearInterval(pulseInterval);
    };
  }, [isOpen]);

  const quickAccessItems: QuickAccessItem[] = [
    { to: '/booking', icon: book, title: 'Đặt lịch khám' },
    { to: '/schedule', icon: history, title: 'Lịch sử khám' },
    { to: '/services', icon: all, title: 'Dịch vụ y tế' },
    { to: '/departments', icon: hospital, title: 'Khoa chuyên môn' },
  ];

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <>
      {isOpen && (
        <div ref={menuRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
          <div className="absolute inset-0" onClick={closeMenu} aria-hidden="true"></div>
          <div
            className="mx-6 w-full max-w-xs bg-white rounded-3xl shadow-2xl py-5 px-4 animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-1 mb-3">
              <h3 className="text-lg font-bold text-gray-900">Truy cập nhanh</h3>
              <button onClick={closeMenu} className="text-gray-500 p-1 hover:bg-gray-100 rounded-full">
                <span className="sr-only">Đóng</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {quickAccessItems.map((item, index) => (
                <TransitionLink
                  key={index}
                  to={item.to}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all duration-200"
                  onClick={closeMenu}
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${
                      index === 0
                        ? 'bg-teal-500/15'
                        : index === 1
                          ? 'bg-orange-400/15'
                          : index === 2
                            ? 'bg-blue-500/15'
                            : 'bg-purple-500/15'
                    }`}
                  >
                    <img src={item.icon} className="h-6 w-6" alt={item.title} />
                  </div>
                  <span className="text-sm font-medium text-center text-gray-800">{item.title}</span>
                </TransitionLink>
              ))}
            </div>
          </div>
        </div>
      )}
      <div
        ref={buttonRef}
        onClick={toggleMenu}
        className={`
          w-12 h-12 
          bg-gradient-to-r from-blue-600 to-blue-500
          rounded-full flex items-center justify-center -mt-4 
          shadow-lg ${isOpen ? 'shadow-highlight/40' : 'shadow-highlight/30'} 
          hover:shadow-highlight/50
          active:scale-95 
          transition-all duration-300
          cursor-pointer
          ${isPulsing ? 'animate-pulse' : ''}
          relative
          overflow-hidden
        `}
        aria-label="Quick access menu"
      >
        <span
          className={`
          absolute inset-0 bg-white/20 scale-0 rounded-full
          ${isOpen ? '' : 'hover:scale-100'} 
          transition-transform duration-300 ease-out
        `}
        ></span>
        <QuickAccessIcon
          className={`
            w-7 h-7 text-white 
            transition-all duration-300 
            ${isOpen ? 'rotate-45 scale-110' : 'scale-100'} 
            drop-shadow-md
          `}
        />
      </div>
    </>
  );
}

const NAV_ITEMS = [
  {
    name: 'Trang chủ',
    path: '/',
    icon: HomeIcon,
  },
  {
    name: 'Bảng giá',
    path: '/service-prices',
    icon: ExploreIcon,
  },
  {
    path: '/quick-access',
    icon: QuickAccessButton,
    isSpecial: true,
  },
  {
    name: 'Bác sĩ',
    path: '/doctor',
    icon: ChatIcon,
  },
  {
    name: 'Thông tin',
    path: '/about',
    icon: ProfileIcon,
  },
];

export default function Footer() {
  const [handle] = useRouteHandle();
  if (handle.back) {
    return <></>;
  }

  return (
    <div className="w-full relative">
      <FooterWave
        className="absolute inset-x-0 bottom-sb z-10 h-24 -mb-6"
        style={{
          filter: 'drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.08))',
        }}
      />
      <div
        className="w-full px-4 pt-2 grid text-3xs relative z-20 justify-center pb-sb bg-white"
        style={{
          gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)`,
        }}
      >
        {NAV_ITEMS.map((item) => {
          return item.isSpecial ? (
            <div key={item.path} className="flex justify-center relative">
              <item.icon />
            </div>
          ) : (
            <TransitionLink
              to={item.path}
              key={item.path}
              className="flex flex-col items-center space-y-0.5 p-1 active:scale-105 transition-transform duration-150"
            >
              {({ isActive }) =>
                item.name ? (
                  <>
                    <div
                      className={`w-6 h-6 flex justify-center items-center ${isActive ? 'scale-110' : ''} transition-transform duration-200`}
                    >
                      <item.icon active={isActive} />
                    </div>
                    <div
                      className={`text-2xs truncate font-medium ${isActive ? 'text-blue-600' : 'text-disabled hover:text-gray-500 transition-colors'}`}
                    >
                      {item.name}
                    </div>
                  </>
                ) : (
                  <item.icon active={isActive} />
                )
              }
            </TransitionLink>
          );
        })}
      </div>
    </div>
  );
}
