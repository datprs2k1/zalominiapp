/**
 * Medical Tab Navigation Component
 * Tab navigation for hospital application sections
 */

import React, { useState } from 'react';
import { cn } from '@/utils/cn';

interface TabItem {
  id: string;
  label: string;
  content?: React.ReactNode;
  disabled?: boolean;
  badge?: number;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  testId?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
  testId,
  ...props
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '');
  
  const activeTab = controlledActiveTab || internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: {
      tab: 'px-3 py-2 text-sm',
      badge: 'text-xs min-w-[16px] h-[16px]',
    },
    md: {
      tab: 'px-4 py-3 text-base',
      badge: 'text-xs min-w-[18px] h-[18px]',
    },
    lg: {
      tab: 'px-6 py-4 text-lg',
      badge: 'text-sm min-w-[20px] h-[20px]',
    },
  };

  // Variant classes
  const variantClasses = {
    default: {
      container: 'border-b border-neutral-200',
      tab: 'border-b-2 border-transparent hover:border-medical-300 transition-colors',
      active: 'border-medical-500 text-medical-600',
      inactive: 'text-neutral-600 hover:text-medical-600',
    },
    pills: {
      container: 'bg-neutral-100 rounded-medical p-1',
      tab: 'rounded-medical transition-all',
      active: 'bg-white text-medical-600 shadow-sm',
      inactive: 'text-neutral-600 hover:text-medical-600 hover:bg-white/50',
    },
    underline: {
      container: '',
      tab: 'border-b-2 border-transparent transition-colors',
      active: 'border-medical-500 text-medical-600 bg-medical-50',
      inactive: 'text-neutral-600 hover:text-medical-600 hover:border-medical-300',
    },
  };

  const containerClasses = cn(
    'flex',
    fullWidth ? 'w-full' : '',
    variantClasses[variant].container,
    className
  );

  const getTabClasses = (tab: TabItem, isActive: boolean) => {
    return cn(
      'relative flex items-center gap-2 font-medium cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'min-h-[44px]', // Accessibility: minimum touch target
      sizeClasses[size].tab,
      variantClasses[variant].tab,
      isActive 
        ? variantClasses[variant].active 
        : variantClasses[variant].inactive,
      fullWidth && 'flex-1 justify-center',
      tab.disabled && 'opacity-50 cursor-not-allowed'
    );
  };

  return (
    <div
      className={containerClasses}
      role="tablist"
      data-testid={testId}
      {...props}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            className={getTabClasses(tab, isActive)}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            disabled={tab.disabled}
          >
            <span>{tab.label}</span>
            
            {tab.badge && tab.badge > 0 && (
              <span className={cn(
                'bg-danger-500 text-white rounded-full flex items-center justify-center font-medium',
                sizeClasses[size].badge
              )}>
                {tab.badge > 99 ? '99+' : tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// Tab Panel Component
interface TabPanelProps {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  tabId,
  activeTab,
  children,
  className,
}) => {
  const isActive = activeTab === tabId;

  if (!isActive) return null;

  return (
    <div
      id={`tabpanel-${tabId}`}
      role="tabpanel"
      aria-labelledby={`tab-${tabId}`}
      className={cn('focus:outline-none', className)}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export default TabNavigation;
