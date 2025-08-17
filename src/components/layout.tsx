import Header from './header';
import Footer from './footer';
import { Toaster } from 'react-hot-toast';
import { ScrollRestoration } from './scroll-restoration';
import Page from './page';
import { useEffect } from 'react';
import QuickAccessButton from './quick-access-button';

export default function Layout() {
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
    <div
      className="w-screen h-screen flex flex-col text-foreground overflow-hidden"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <Header />
      <main className="flex-1 overflow-x-hidden overflow-y-auto overscroll-none datprs pb-2">
        <Page />
      </main>
      <Footer />
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
    </div>
  );
}
