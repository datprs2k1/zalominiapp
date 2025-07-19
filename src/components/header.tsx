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
      className={`flex-none w-full min-h-[56px] ${showMainHeader ? '' : 'bg-white'} 
        ${scrolled ? 'sticky top-0 z-50 shadow-sm bg-white/95 backdrop-blur-sm transition-all duration-200' : 'relative z-30'}
        px-3 sm:px-4 pt-st pb-1 sm:pb-2`}
      style={{ position: showMainHeader && !scrolled ? 'relative' : undefined }}
    >
      {showMainHeader && (
        <>
          <div className="absolute h-[180px] sm:h-[230px] z-0 bg-gradient-to-br from-highlight from-[1.36%] to-background to-[61.49%]" />
          {/* <HeaderShieldIcon className="absolute top-0 right-0 z-10" /> */}
        </>
      )}
      <div className="flex items-center justify-between min-h-[48px] relative z-20">
        {showMainHeader ? (
          <div className="w-full">
            <div className="w-full">
              {handle.profile ? (
                <ProfileHeader />
              ) : (
                <div className="flex items-center text-primary space-x-1.5">
                  <h1 className="text-lg sm:text-xl font-bold">{getConfig((c) => c.app.title)}</h1>
                  <span className="hidden sm:block">|</span>
                  <span className="text-sm sm:text-base hidden sm:block">Chào bạn</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center w-full">
            {showBack && (
              <div
                className="py-2 px-2 mr-2 -ml-2 rounded-full cursor-pointer touch-manipulation active:bg-gray-100 transition-colors"
                onClick={() =>
                  navigate(-1 as To, {
                    viewTransition: true,
                  })
                }
                aria-label="Go back"
              >
                <BackIcon />
              </div>
            )}
            <div className="text-lg sm:text-xl font-medium truncate flex-1">
              {handle.title === 'custom' ? <CustomTitle /> : handle.title}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
