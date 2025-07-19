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
      <div
        className="flex-none flex items-start justify-start px-4 sm:px-6 gap-4 sm:gap-8 bg-white overflow-x-auto scrollbar-hide border-b border-gray-100"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {tabs.map(({ name }, index) => (
          <div
            key={index}
            className={`flex-none flex flex-col items-center cursor-pointer py-3 sm:py-4 relative transition-colors duration-200 group select-none`}
            onClick={() => onTabChange(index)}
          >
            <div
              className={`truncate px-2 sm:px-4 py-1 rounded-md transition-colors duration-200 ${
                activeTab === index ? 'text-blue-600 font-semibold' : 'text-gray-500 group-hover:text-gray-700'
              }`}
            >
              {name}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[3px]">
              <div
                className={`h-full bg-blue-500 rounded-t transition-all duration-300 ${
                  activeTab === index ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto bg-white">
        <Suspense
          fallback={
            <div className="flex justify-center items-center p-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
        >
          {createElement(tabs[activeTab].content)}
        </Suspense>
      </div>
    </div>
  );
}

export default Tabs;
