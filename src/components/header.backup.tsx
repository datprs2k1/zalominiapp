import { useAtomValue } from 'jotai';
import { To, useLocation, useNavigate } from 'react-router-dom';
import { useRouteHandle } from '@/hooks';
import { BackIcon } from './icons/back';
import { getConfig } from '@/utils/miscellaneous';
import HeaderShieldIcon from './icons/header-shield';
import UserProfile from './user-profile';
import { useEffect, useState } from 'react';
import { customTitleState } from '@/state';
import { decodeHTML } from '@/utils/decodeHTML';
import { cn } from '@/utils/cn';

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
  const [handle, match] = useRouteHandle();
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

  return (
    <header
      className={cn(
        'flex-none w-full min-h-[56px] transition-all duration-200',
        'px-3 sm:px-4 pt-st pb-1 sm:pb-2',
        showMainHeader ? '' : 'bg-white shadow-card-medical',
        scrolled ? 'sticky top-0 z-50 shadow-card-hover bg-white/95 backdrop-blur-medical' : 'relative z-30'
      )}
      style={{ position: showMainHeader && !scrolled ? 'relative' : undefined }}
    >
      {showMainHeader && (
        <>
          <div className="absolute h-[180px] sm:h-[230px] z-0 bg-gradient-to-br from-medical-50 from-[1.36%] to-background to-[61.49%]" />
          {/* Medical-themed decorative element */}
          <div className="absolute top-4 right-4 z-10 opacity-10">
            <svg className="w-16 h-16 text-medical-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </>
      )}
      <div className="flex items-center justify-between min-h-[48px] relative z-20">
        {showMainHeader ? (
          <div className="w-full">
            <div className="w-full">
              {handle.profile ? (
                <ProfileHeader />
              ) : (
                <div className="flex items-center text-medical-700 space-x-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-medical-500 rounded-medical flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 2L3 7v11a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V7l-7-5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h1 className="text-medical-title font-bold">{getConfig((c) => c.app.title)}</h1>
                  </div>
                  <span className="hidden sm:block text-medical-500">|</span>
                  <span className="text-medical-body hidden sm:block font-medium">Chào bạn</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center w-full">
            {showBack && (
              <button
                className="p-2 mr-2 -ml-2 rounded-medical cursor-pointer touch-manipulation hover:bg-medical-50 active:bg-medical-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                onClick={() =>
                  navigate(-1 as To, {
                    viewTransition: true,
                  })
                }
                aria-label="Go back"
              >
                <BackIcon />
              </button>
            )}
            <div className="text-medical-heading font-semibold truncate flex-1 text-neutral-900">
              {handle.title === 'custom' ? <CustomTitle /> : handle.title}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
