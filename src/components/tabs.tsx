import { createElement, FunctionComponent, Suspense } from 'react';

interface Tab {
  name: string;
  content: FunctionComponent;
}

interface TabsProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  tabs: Tab[];
}

function Tabs({ activeTab, onTabChange, tabs }: TabsProps) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Modern Hospital Tab Navigation */}
      <div
        className="flex-none flex items-center justify-center px-4 py-2 bg-gradient-to-b from-white to-medical-50 border-b border-medical-200/50 overflow-x-auto scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex gap-2 bg-medical-100/50 rounded-medical p-1 backdrop-blur-sm">
          {tabs.map(({ name }, index) => (
            <button
              key={index}
              className={`
                flex-none px-6 py-3 rounded-medical-lg font-medium text-sm transition-all duration-300
                min-h-[44px] min-w-[120px] flex items-center justify-center
                transform active:scale-98 select-none
                ${
                  activeTab === index
                    ? 'bg-medical-500 text-white shadow-button-medical scale-102'
                    : 'text-medical-600 hover:bg-medical-200/70 hover:text-medical-700 active:bg-medical-300/50'
                }
              `}
              onClick={() => onTabChange(index)}
              type="button"
              role="tab"
              aria-selected={activeTab === index}
              aria-controls={`tabpanel-${index}`}
            >
              <span className="truncate">{name}</span>
              {activeTab === index && <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse" />}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-medical-50/30">
        <Suspense
          fallback={
            <div className="flex flex-col justify-center items-center p-8 min-h-[200px]">
              {/* Medical Loading Animation */}
              <div className="relative">
                <div className="w-8 h-8 border-3 border-medical-200 border-t-medical-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-8 h-8 border-3 border-transparent border-r-medical-300 rounded-full animate-spin animate-reverse"></div>
              </div>
              <p className="text-medical-600 text-sm mt-4 font-medium">Đang tải nội dung...</p>
            </div>
          }
        >
          <div
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="animate-fade-in-mobile"
          >
            {createElement(tabs[activeTab].content)}
          </div>
        </Suspense>
      </div>
    </div>
  );
}

export default Tabs;
