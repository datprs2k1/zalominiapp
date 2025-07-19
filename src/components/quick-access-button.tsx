import React, { useState } from 'react';
import QuickAccessIcon from './icons/quick-access';
import TransitionLink from './transition-link';
import book from '@/static/book.svg';
import history from '@/static/history.svg';
import all from '@/static/services/all.svg';
import hospital from '@/static/services/hospital.svg';

interface QuickAccessItem {
  to: string;
  icon: string;
  title: string;
}

const QuickAccessButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const quickAccessItems: QuickAccessItem[] = [
    { to: '/booking', icon: book, title: 'Đặt lịch khám' },
    { to: '/schedule', icon: history, title: 'Lịch sử khám' },
    { to: '/services', icon: all, title: 'Dịch vụ y tế' },
    { to: '/departments', icon: hospital, title: 'Khoa chuyên môn' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed right-4 bottom-[calc(64px+var(--safe-bottom))] z-50">
      {/* Quick Access Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 w-56 border border-gray-100">
            {quickAccessItems.map((item, index) => (
              <TransitionLink
                key={index}
                to={item.to}
                className="flex items-center gap-3 p-2.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 rounded-md transition-all"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-blue-100 to-green-100 rounded-full">
                  <img src={item.icon} className="h-5 w-5" alt={item.title} />
                </div>
                <span className="text-sm font-medium text-gray-800">{item.title}</span>
              </TransitionLink>
            ))}
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={toggleMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary-gradient text-white shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary active:scale-95 border border-white/20`}
        style={{
          boxShadow: isHovered ? '0 6px 12px rgba(0, 186, 173, 0.3)' : '0 4px 10px rgba(21, 97, 173, 0.25)',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
        aria-label="Truy cập nhanh"
      >
        <QuickAccessIcon className="w-7 h-7" />
      </button>
    </div>
  );
};

export default QuickAccessButton;
