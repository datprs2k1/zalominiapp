import { useEffect, useState } from 'react';
import Tabs from '@/components/tabs';
import Tab1 from './tab1';
import Tab2 from './tab2';
import Tab3 from './tab3';
import { useSearchParams } from 'react-router-dom';
import { DetailPageContext, DetailPageTemplateProps } from './context';
import { useAtom } from 'jotai';
import { customTitleState } from '@/state';

function DetailPageTemplate(props: DetailPageTemplateProps) {
  const [query] = useSearchParams();
  const tab = query.get('tab');
  const [activeTab, setActiveTab] = useState(Number(tab) || 0);
  const [customTitle, setCustomTitle] = useAtom(customTitleState);

  useEffect(() => {
    const oldTitle = customTitle;
    setCustomTitle(props.title);
    return () => {
      setCustomTitle(oldTitle);
    };
  }, []);

  return (
    <div className="flex w-full flex-col min-h-screen bg-medical-50">
      {/* Modern Hospital Header */}
      <div className="bg-gradient-to-r from-medical-500 to-medical-600 px-4 py-6 shadow-header">
        <div className="max-w-md mx-auto">
          <h1 className="text-medical-title text-white font-bold text-center mb-2">{props.title}</h1>
          <div className="flex items-center justify-center">
            <div className="w-12 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 bg-white rounded-t-medical-xl -mt-4 relative z-10 shadow-card-medical">
        <DetailPageContext.Provider value={props}>
          <Tabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              {
                name: 'Giới thiệu',
                content: Tab1,
              },
              // {
              //   name: 'Bác sĩ',
              //   content: Tab2,
              // },
              // {
              //   name: "Tư vấn",
              //   content: Tab3,
              // },
            ]}
          />
        </DetailPageContext.Provider>
      </div>
    </div>
  );
}

export default DetailPageTemplate;
