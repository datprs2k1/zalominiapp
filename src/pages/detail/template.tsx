import { useEffect, useState } from 'react';
import Tabs from '@/components/tabs';
import Tab1 from './tab1';
import Tab2 from './tab2';
import Tab3 from './tab3';
import { useSearchParams } from 'react-router-dom';
import { DetailPageContext, DetailPageTemplateProps } from './context';
import { useAtom } from 'jotai';
import { customTitleState } from '@/state';
import { motion } from 'framer-motion';
import { MedicalIcon, MedicalStatusIndicator } from '@/components/medical/MedicalServiceComponents';
import ModernBreadcrumb from '@/components/modern-breadcrumb';

function DetailPageTemplate(props: DetailPageTemplateProps) {
  const [query] = useSearchParams();
  const tab = query.get('tab');
  const [activeTab, setActiveTab] = useState(Number(tab) || 0);
  const [customTitle, setCustomTitle] = useAtom(customTitleState);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const oldTitle = customTitle;
    setCustomTitle(props.title);
    return () => {
      setCustomTitle(oldTitle);
    };
  }, []);

  return (
    <motion.div
      className="flex flex-col w-full min-h-screen bg-gradient-to-br from-white via-blue-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Enhanced Hero Banner with Modern Design - Mobile Optimized */}
      <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px] overflow-hidden">
        {/* Background with enhanced gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-600 to-primary-dark"></div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full animate-pulse">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="2" fill="white" fillOpacity="0.1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
        </div>

        {/* Image with enhanced loading and effects */}
        {props.imageUrl && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10"></div>
            <motion.div
              className="absolute inset-0 z-5"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{
                scale: isImageLoaded ? 1 : 1.1,
                opacity: isImageLoaded ? 0.85 : 0,
              }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <img
                src={props.imageUrl}
                alt={props.title}
                className="w-full h-full object-cover"
                onLoad={() => setIsImageLoaded(true)}
                loading="lazy"
              />
            </motion.div>

            {/* Shimmer effect while loading */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer z-5"></div>
            )}
          </>
        )}

        {/* Enhanced content overlay with glass morphism - Mobile Optimized */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end">
          <div className="bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 sm:p-4 md:p-6">
            {/* Status and category badges - Mobile Optimized */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              {props.category && (
                <motion.span
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <MedicalIcon type="stethoscope" size="sm" className="text-white" />
                  <span>{props.category.length > 12 ? `${props.category.slice(0, 12)}...` : props.category}</span>
                </motion.span>
              )}
              {props.status && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <MedicalStatusIndicator
                    status={props.status === 'emergency' ? 'emergency' : 'available'}
                    showLabel={true}
                    className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30 text-xs"
                  />
                </motion.div>
              )}
            </div>

            {/* Enhanced title with better typography - Mobile Optimized */}
            <motion.h1
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 leading-tight"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {props.title}
            </motion.h1>

            {props.subtitle && (
              <motion.p
                className="text-white/90 text-xs sm:text-sm md:text-base font-medium max-w-2xl line-clamp-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {props.subtitle}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* Stats section removed for mobile optimization */}

      {/* Breadcrumb Navigation - Mobile Optimized */}
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-2">
        <ModernBreadcrumb
          items={[
            { label: 'Trang chủ', href: '/', icon: 'home' },
            { label: 'Dịch vụ', href: '/services', icon: 'stethoscope' },
            { label: props.title.length > 12 ? `${props.title.slice(0, 12)}...` : props.title },
          ]}
          className="text-xs"
        />
      </div>

      {/* Enhanced Tabs Content - Mobile Optimized */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-4">
        <DetailPageContext.Provider value={props}>
          {props.hideTabs ? (
            // Show only Tab1 content without tabs - Mobile optimized
            <motion.div
              className="mt-2 sm:mt-3 mb-16 sm:mb-20 rounded-lg sm:rounded-xl shadow-md overflow-hidden bg-white border border-gray-100"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Tab1 />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Tabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={[
                  {
                    name: 'Giới thiệu',
                    content: Tab1,
                    icon: 'stethoscope',
                    ariaLabel: 'Tab giới thiệu về dịch vụ y tế',
                  },
                  {
                    name: 'Bác sĩ',
                    content: Tab2,
                    icon: 'heartbeat',
                    ariaLabel: 'Tab thông tin bác sĩ',
                  },
                  {
                    name: 'Tư vấn',
                    content: Tab3,
                    icon: 'pill',
                    ariaLabel: 'Tab tư vấn y tế',
                  },
                ]}
                className="mt-2 sm:mt-3 mb-16 sm:mb-20 rounded-lg sm:rounded-xl shadow-md overflow-hidden border border-gray-100"
                ariaLabel="Thông tin chi tiết về dịch vụ y tế"
              />
            </motion.div>
          )}
        </DetailPageContext.Provider>
      </div>
    </motion.div>
  );
}

export default DetailPageTemplate;
