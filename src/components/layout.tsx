import Header from './header';
import SimplifiedFooter from './simplified-footer';
import { Toaster } from 'react-hot-toast';
import { ScrollRestoration } from './scroll-restoration';
import Page from './page';
import { useEffect } from 'react';
import QuickAccessButton from './quick-access-button';
import { SafeAreaProvider, SafeAreaView } from './safe-area-view';
import { PlatformStatusBar } from './platform-status-bar';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';

export default function Layout() {
  const { deviceInfo, getPlatformClasses } = useEnhancedMobile();

  // Handle viewport height for mobile browsers
  useEffect(() => {
    const setVHVariable = () => {
      // Set a CSS variable equal to 1% of viewport height
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };

    // Set initially
    setVHVariable();

    // Update on resize and orientation change
    window.addEventListener('resize', setVHVariable);
    window.addEventListener('orientationchange', setVHVariable);

    return () => {
      window.removeEventListener('resize', setVHVariable);
      window.removeEventListener('orientationchange', setVHVariable);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <PlatformStatusBar style="dark-content" backgroundColor="#FFFFFF" translucent={true} />
      <SafeAreaView
        edges={['left', 'right']}
        className={getPlatformClasses('w-screen h-screen flex flex-col bg-background text-foreground overflow-hidden')}
        style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
      >
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto overscroll-none datprs">
          <Page />
        </main>
        <SimplifiedFooter />
        {/* <QuickAccessButton /> */}
        <Toaster
          containerClassName="toast-container"
          position="bottom-center"
          toastOptions={{
            className: 'mobile-toast',
            duration: 3000,
            style: {
              maxWidth: '90vw',
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />
        <ScrollRestoration />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
