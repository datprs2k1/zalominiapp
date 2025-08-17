/**
 * Medical Bottom Navigation Component
 * Accessible bottom navigation for hospital mobile application
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigationProps } from './types';
import { cn } from '@/utils/cn';

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  activeItem,
  onItemSelect,
  className,
  testId,
  ...props
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (item: typeof items[0]) => {
    if (onItemSelect) {
      onItemSelect(item);
    } else {
      navigate(item.path);
    }
  };

  const isItemActive = (item: typeof items[0]) => {
    if (activeItem) {
      return activeItem === item.id;
    }
    // Auto-detect active item based on current path
    return location.pathname === item.path || 
           (item.path !== '/' && location.pathname.startsWith(item.path));
  };

  return (
    <nav
      className={cn(
        'nav-medical-bottom',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
      data-testid={testId}
      {...props}
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-full">
        {items.map((item) => {
          const isActive = isItemActive(item);
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={cn(
                'nav-medical-item',
                isActive ? 'nav-medical-item-active' : 'nav-medical-item-inactive'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-medium">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
