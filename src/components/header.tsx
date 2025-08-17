import { useAtomValue } from 'jotai';
import { To, useLocation, useNavigate } from 'react-router-dom';
import { useRouteHandle } from '@/hooks';
import { BackIcon } from './icons/back';
import { BackModern } from './icons/back-modern';
import { MedicalLogo } from './icons/medical-logo';
import { getConfig } from '@/utils/miscellaneous';
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
        'flex-none w-full transition-all duration-300 ease-out',
        'px-4 sm:px-6 py-3 sm:py-4 pt-st min-h-[64px] sm:min-h-[72px]',
        showMainHeader
          ? scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-gray-200/50 sticky top-0 z-50'
            : 'bg-white relative z-30'
          : 'bg-white shadow-lg shadow-gray-200/30 sticky top-0 z-50',
        scrolled && showMainHeader ? 'border-b border-medical-200/60' : '',
        !showMainHeader ? 'border-b border-medical-200/60' : ''
      )}
    >
      <div className="flex items-center justify-between w-full">
        {showMainHeader ? (
          <div className="flex items-center justify-between w-full">
            {handle.profile ? (
              <ProfileHeader />
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-medical-500 via-medical-600 to-medical-500 rounded-2xl shadow-lg shadow-medical-300/50 ring-2 ring-white/50">
                    <MedicalLogo className="text-white drop-shadow-sm" size={26} />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-800 leading-tight tracking-tight">
                      {getConfig((c) => c.app.title)}
                    </h1>
                    <p className="text-sm text-medical-600/80 font-medium">Chăm sóc sức khỏe toàn diện</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center text-sm text-medical-600/70 font-medium">
                  <span className="bg-white/60 px-3 py-1.5 rounded-full shadow-sm">Xin chào!</span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center w-full gap-3">
            {showBack && (
              <button
                className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/70 hover:bg-white/90 active:bg-white/95 shadow-md shadow-medical-200/50 hover:shadow-lg hover:shadow-medical-300/50 transition-all duration-200 touch-manipulation ring-1 ring-medical-200/50 min-w-[44px] min-h-[44px]"
                onClick={() =>
                  navigate(-1 as To, {
                    viewTransition: true,
                  })
                }
                aria-label="Go back"
              >
                <BackModern className="text-medical-600" size={20} />
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-lg font-bold text-slate-800 truncate tracking-tight">
                {handle.title === 'custom' ? <CustomTitle /> : handle.title}
              </h1>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
