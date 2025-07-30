import { useState, useEffect, useRef, useCallback } from 'react';
import TransitionLink from '@/components/transition-link';
import { announceToScreenReader } from '@/utils/accessibility';

interface HeroSectionProps {
  className?: string;
}

const HeroSection = ({ className }: HeroSectionProps) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const heroSectionRef = useRef<HTMLElement>(null);

  // Effect for scroll detection and accessibility setup
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    window.addEventListener('scroll', handleScroll);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Accessibility: Announce tab changes to screen readers
  const handleTabChange = useCallback((tabId: string, tabLabel: string) => {
    setActiveTab(tabId);
    announceToScreenReader(`Đã chọn tab ${tabLabel}`, 'polite');
  }, []);

  // Enhanced Banner images with optimization attributes
  const bannerImages = [
    {
      url: 'https://benhvienhoabinh.vn/wp-content/uploads/2024/11/HB6.jpg',
      alt: 'Bệnh Viện Hòa Bình - Cơ sở vật chất hiện đại',
      priority: true, // First image loads with priority
    },
  ];

  // Quick access features with medical-themed icons - Enhanced for accessibility
  const quickFeatures = [
    {
      id: 'appointments',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z M9 11h6 M9 15h6',
      label: 'Đặt lịch',
      bgColor: 'from-[#2563EB] to-[#1E40AF]',
      textColor: 'text-[#2563EB]',
      hoverColor: 'hover:text-[#1E40AF]',
      shadowColor: 'hover:shadow-[#2563EB]/25',
      ariaLabel: 'Đặt lịch khám bệnh - Nhấn để mở form đặt lịch',
      description: 'Đặt lịch khám bệnh trực tuyến nhanh chóng và tiện lợi',
      keyboardShortcut: '1',
    },
    {
      id: 'doctors',
      icon: 'M11 2a2 2 0 0 0-2 2v6.5a0.5 0.5 0 0 1-1 0V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6.5a6.5 6.5 0 0 0 13 0V4a2 2 0 0 0-2-2h-2z M16 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
      label: 'Bác sĩ',
      bgColor: 'from-[#10B981] to-[#059669]',
      textColor: 'text-[#10B981]',
      hoverColor: 'hover:text-[#059669]',
      shadowColor: 'hover:shadow-[#10B981]/25',
      ariaLabel: 'Tìm bác sĩ chuyên khoa - Nhấn để xem danh sách bác sĩ',
      description: 'Tìm kiếm bác sĩ chuyên khoa giàu kinh nghiệm',
      keyboardShortcut: '2',
    },
    {
      id: 'services',
      icon: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
      label: 'Dịch vụ',
      bgColor: 'from-[#0891B2] to-[#0E7490]',
      textColor: 'text-[#0891B2]',
      hoverColor: 'hover:text-[#0E7490]',
      shadowColor: 'hover:shadow-[#0891B2]/25',
      ariaLabel: 'Dịch vụ y tế - Nhấn để xem các dịch vụ khám chữa bệnh',
      description: 'Khám phá đa dạng dịch vụ y tế chất lượng cao',
      keyboardShortcut: '3',
    },
    {
      id: 'results',
      icon: 'M22 12h-4l-3 9L9 3l-3 9H2 M12 6v6l4 2',
      label: 'Kết quả',
      bgColor: 'from-[#2563EB] to-[#0891B2]',
      textColor: 'text-[#2563EB]',
      hoverColor: 'hover:text-[#0891B2]',
      shadowColor: 'hover:shadow-[#2563EB]/25',
      ariaLabel: 'Kết quả xét nghiệm - Nhấn để tra cứu kết quả',
      description: 'Tra cứu kết quả xét nghiệm và chẩn đoán trực tuyến',
      keyboardShortcut: '4',
    },
  ];

  // Ultra-compact service benefits with streamlined medical messaging
  const serviceBenefits = [
    {
      title: 'Y bác sĩ',
      description: 'Chuyên môn cao',
      icon: 'M11 2a2 2 0 0 0-2 2v6.5a0.5 0.5 0 0 1-1 0V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6.5a6.5 6.5 0 0 0 13 0V4a2 2 0 0 0-2-2h-2z M16 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z', // Stethoscope
      bgColor: 'bg-[#EFF6FF]', // Medical blue background
      iconColor: 'text-[#2563EB]', // Medical blue
      gradientFrom: 'from-[#2563EB]',
      gradientTo: 'to-[#1E40AF]',
      animationDelay: '0ms',
      ariaLabel: 'Đội ngũ y bác sĩ chuyên nghiệp',
    },
    {
      title: 'Chất lượng',
      description: 'Tiêu chuẩn quốc tế',
      icon: 'M22 12h-4l-3 9L9 3l-3 9H2 M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', // Heartbeat with quality star
      bgColor: 'bg-[#ECFDF5]', // Healing green background
      iconColor: 'text-[#10B981]', // Healing green
      gradientFrom: 'from-[#10B981]',
      gradientTo: 'to-[#059669]',
      animationDelay: '100ms',
      ariaLabel: 'Chất lượng điều trị cao cấp',
    },
    {
      title: 'Công nghệ',
      description: 'Thiết bị tiên tiến',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z M12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6z M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z', // Medical scanner/imaging device
      bgColor: 'bg-[#ECFEFF]', // Trust cyan background
      iconColor: 'text-[#0891B2]', // Trust cyan
      gradientFrom: 'from-[#0891B2]',
      gradientTo: 'to-[#0E7490]',
      animationDelay: '200ms',
      ariaLabel: 'Công nghệ y tế hiện đại',
    },
    {
      title: 'Dịch vụ',
      description: 'Chăm sóc toàn diện',
      icon: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z M3 3h18v18H3V3z M7 7h10v10H7V7z', // Medical cross with comprehensive care grid
      bgColor: 'bg-[#F0FDFA]', // Soft medical white with green tint
      iconColor: 'text-[#059669]', // Deep healing green
      gradientFrom: 'from-[#10B981]',
      gradientTo: 'to-[#059669]',
      animationDelay: '300ms',
      ariaLabel: 'Dịch vụ chăm sóc sức khỏe toàn diện',
    },
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Auto-cycle through images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <section
      ref={heroSectionRef}
      className={`relative pt-0 pb-0 ${className ?? ''}`}
      role="banner"
      aria-label="Bệnh viện Hòa Bình - Dịch vụ y tế chuyên nghiệp"
    >
      {/* Skip to content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-[#2563EB] text-white px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:ring-offset-2"
      >
        Chuyển đến nội dung chính
      </a>

      <div className="relative w-full overflow-hidden bg-[#FAFBFC] rounded-2xl border border-[#E5E9ED]/30 shadow-[0_6px_20px_rgba(37,99,235,0.05)]">
        {/* Compact Medical Content Area - Optimized Spacing */}
        <div className="pb-4 mx-auto w-full max-w-7xl px-3 lg:px-4">
          <div className="lg:flex lg:flex-row lg:items-start lg:gap-4 lg:mt-4">
            {/* Compact Medical Banner - Enhanced Accessibility */}
            <div className="rounded-xl overflow-hidden mt-2 mb-4 relative shadow-md lg:w-3/5 lg:mb-0">
              {/* Compact Image Display with Loading State */}
              <div className="relative h-[220px] lg:h-[320px] overflow-hidden bg-[#F8FAFC]">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#F8FAFC]">
                    <div className="animate-pulse flex space-x-2">
                      <div className="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#10B981] rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#0891B2] rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                )}

                {bannerImages.map((img, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity ${
                      reducedMotion ? 'duration-0' : 'duration-1000'
                    } ${activeImageIndex === index ? 'opacity-100' : 'opacity-0'}`}
                  >
                    {/* Enhanced Image Display with Better Accessibility */}
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      loading={img.priority ? 'eager' : 'lazy'}
                      decoding="async"
                      onLoad={() => setIsLoading(false)}
                      onError={() => setIsLoading(false)}
                      style={{
                        filter: 'brightness(1.05) contrast(1.02)',
                        imageRendering: 'auto',
                      }}
                    />

                    {/* Enhanced overlays for better text readability */}
                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent"></div>

                    {/* Semi-transparent background panels for text */}
                    <div className="absolute top-3 left-3 right-3 bottom-3 pointer-events-none">
                      <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md max-w-fit"></div>
                      <div className="absolute bottom-0 right-0 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md max-w-fit"></div>
                    </div>
                  </div>
                ))}

                {/* Hospital Name - Enhanced Accessibility */}
                <div className="absolute top-0 left-0 p-3 z-20 lg:p-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-white/20">
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 text-[#2563EB] mr-2 lg:h-5 lg:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                        role="img"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-sm font-bold text-[#1E40AF] lg:text-base" role="heading" aria-level={1}>
                        Bệnh Viện Hòa Bình
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced CTA Button - Better Touch Target */}
                <div className="absolute bottom-0 right-0 p-3 z-20 lg:p-4">
                  <TransitionLink to="/booking">
                    <button
                      className="bg-[#2563EB] hover:bg-[#1E40AF] text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center text-sm lg:py-3 lg:px-5 lg:text-base min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-[#FAFBFC] focus:ring-offset-2 focus:ring-offset-[#2563EB]"
                      aria-label="Đặt lịch khám bệnh - Nhấn để mở form đặt lịch"
                      type="button"
                    >
                      <svg
                        className="h-4 w-4 mr-2 lg:h-5 lg:w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>ĐẶT LỊCH</span>
                      <span className="sr-only">- Mở form đặt lịch khám bệnh</span>
                    </button>
                  </TransitionLink>
                </div>
              </div>
            </div>

            {/* Compact Medical Right Column - Enhanced Accessibility */}
            <div className="lg:w-2/5 lg:pt-2">
              {/* Compact Medical Quick Access - WCAG Compliant */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold text-[#1E40AF] text-sm lg:text-base" id="quick-access-heading">
                    Truy cập nhanh
                  </h2>
                  <div className="flex items-center">
                    <div
                      className={`w-1.5 h-1.5 bg-[#0891B2] rounded-full mr-1.5 shadow-sm ${reducedMotion ? '' : 'animate-pulse'}`}
                    ></div>
                    <span className="text-xs text-[#059669] font-semibold">Dễ dàng tiếp cận</span>
                  </div>
                </div>

                <div
                  className="grid grid-cols-4 gap-2 lg:gap-3"
                  role="tablist"
                  aria-labelledby="quick-access-heading"
                  aria-describedby="quick-access-description"
                >
                  <div id="quick-access-description" className="sr-only">
                    Sử dụng phím mũi tên để điều hướng giữa các tab, phím Enter hoặc Space để chọn
                  </div>

                  {quickFeatures.map((feature, index) => (
                    <button
                      key={feature.id}
                      onClick={() => handleTabChange(feature.id, feature.label)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowRight') {
                          e.preventDefault();
                          const nextIndex = (index + 1) % quickFeatures.length;
                          const nextButton = e.currentTarget.parentElement?.children[nextIndex] as HTMLButtonElement;
                          nextButton?.focus();
                        } else if (e.key === 'ArrowLeft') {
                          e.preventDefault();
                          const prevIndex = index === 0 ? quickFeatures.length - 1 : index - 1;
                          const prevButton = e.currentTarget.parentElement?.children[prevIndex] as HTMLButtonElement;
                          prevButton?.focus();
                        } else if (e.key === feature.keyboardShortcut) {
                          e.preventDefault();
                          handleTabChange(feature.id, feature.label);
                        }
                      }}
                      className="flex flex-col items-center group relative focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 rounded-lg p-1"
                      role="tab"
                      aria-selected={activeTab === feature.id}
                      aria-controls={`panel-${feature.id}`}
                      aria-label={feature.ariaLabel}
                      tabIndex={activeTab === feature.id ? 0 : -1}
                      type="button"
                    >
                      <div
                        className={`w-[56px] h-[56px] lg:w-[68px] lg:h-[68px] bg-gradient-to-br ${feature.bgColor} rounded-xl flex items-center justify-center mb-1.5 shadow-md transform transition-all ${reducedMotion ? 'duration-0' : 'duration-300'} group-hover:scale-105 group-active:scale-95 relative overflow-hidden ${feature.shadowColor} border border-white/20`}
                      >
                        {/* Enhanced animated background effect - respects reduced motion */}
                        <div
                          className={`absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity ${reducedMotion ? 'duration-0' : 'duration-300'} rounded-xl`}
                        ></div>
                        {!reducedMotion && (
                          <div className="absolute -inset-full h-[500%] w-[200%] opacity-0 group-hover:opacity-40 group-active:opacity-60 bg-gradient-to-tr from-white via-white to-transparent -z-10 transform -rotate-45 group-hover:animate-shine"></div>
                        )}

                        <svg
                          className="h-6 w-6 text-white relative z-10 lg:h-7 lg:w-7 drop-shadow-sm"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                          role="img"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                        </svg>

                        {/* Enhanced ring indicator for active tab */}
                        {activeTab === feature.id && (
                          <span
                            className={`absolute inset-0 border-2 border-[#FAFBFC] rounded-2xl shadow-lg ${reducedMotion ? '' : 'animate-pulse'}`}
                          ></span>
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold transition-colors ${reducedMotion ? 'duration-0' : 'duration-300'} lg:text-sm ${activeTab === feature.id ? feature.textColor : 'text-[#4A5568]'} ${feature.hoverColor}`}
                      >
                        {feature.label}
                      </span>
                      {/* Keyboard shortcut indicator */}
                      <span className="sr-only">
                        Phím tắt: {feature.keyboardShortcut}. {feature.description}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Enhanced Medical Tab Content - WCAG Compliant */}
                <div
                  className={`mt-5 overflow-hidden rounded-2xl bg-[#FAFBFC] p-4 border border-[#E5E9ED]/50 shadow-[inset_0_2px_4px_rgba(37,99,235,0.05)] lg:p-6 ${reducedMotion ? '' : 'animate-fadeIn'}`}
                  role="tabpanel"
                  id={`panel-${activeTab}`}
                  aria-labelledby={`tab-${activeTab}`}
                >
                  {activeTab === 'appointments' && (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <h3 className="text-sm font-bold text-[#1E40AF] lg:text-base mb-1">Đặt lịch khám</h3>
                        <p className="text-xs text-[#6B7785] lg:text-sm leading-relaxed">
                          Đặt lịch trực tuyến nhanh chóng với bác sĩ chuyên khoa
                        </p>
                      </div>
                      <TransitionLink to="/booking">
                        <button
                          className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-[#2563EB]/25 transition-all duration-200 flex items-center lg:text-sm lg:py-3 lg:px-5 border border-white/20 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FAFBFC] focus:ring-offset-2 focus:ring-offset-[#2563EB]"
                          aria-label="Đặt lịch khám bệnh ngay - Chuyển đến trang đặt lịch"
                          type="button"
                        >
                          <span>Đặt ngay</span>
                          <svg
                            className="w-4 h-4 ml-2 lg:w-5 lg:h-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </TransitionLink>
                    </div>
                  )}
                  {activeTab === 'doctors' && (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <h3 className="text-sm font-bold text-[#1E40AF] lg:text-base mb-1">Đội ngũ bác sĩ</h3>
                        <p className="text-xs text-[#6B7785] lg:text-sm leading-relaxed">
                          Bác sĩ chuyên môn cao, giàu kinh nghiệm và tận tâm
                        </p>
                      </div>
                      <TransitionLink to="/doctor">
                        <button
                          className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-[#10B981]/25 transition-all duration-200 flex items-center lg:text-sm lg:py-3 lg:px-5 border border-white/20 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FAFBFC] focus:ring-offset-2 focus:ring-offset-[#10B981]"
                          aria-label="Xem danh sách bác sĩ chuyên khoa - Chuyển đến trang bác sĩ"
                          type="button"
                        >
                          <span>Xem bác sĩ</span>
                          <svg
                            className="w-4 h-4 ml-2 lg:w-5 lg:h-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </TransitionLink>
                    </div>
                  )}
                  {activeTab === 'services' && (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <h3 className="text-sm font-bold text-[#1E40AF] lg:text-base mb-1">Dịch vụ y tế</h3>
                        <p className="text-xs text-[#6B7785] lg:text-sm leading-relaxed">
                          Đa dạng dịch vụ y tế chất lượng cao và hiện đại
                        </p>
                      </div>
                      <TransitionLink to="/services">
                        <button
                          className="bg-gradient-to-r from-[#0891B2] to-[#0E7490] text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-[#0891B2]/25 transition-all duration-200 flex items-center lg:text-sm lg:py-3 lg:px-5 border border-white/20 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FAFBFC] focus:ring-offset-2 focus:ring-offset-[#0891B2]"
                          aria-label="Xem danh sách dịch vụ y tế - Chuyển đến trang dịch vụ"
                          type="button"
                        >
                          <span>Xem dịch vụ</span>
                          <svg
                            className="w-4 h-4 ml-2 lg:w-5 lg:h-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </TransitionLink>
                    </div>
                  )}
                  {activeTab === 'results' && (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <h3 className="text-sm font-bold text-[#1E40AF] lg:text-base mb-1">Kết quả xét nghiệm</h3>
                        <p className="text-xs text-[#6B7785] lg:text-sm leading-relaxed">
                          Tra cứu kết quả xét nghiệm và chẩn đoán trực tuyến
                        </p>
                      </div>
                      <TransitionLink to="/schedule/test-result">
                        <button
                          className="bg-gradient-to-r from-[#2563EB] to-[#0891B2] text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-[#2563EB]/25 transition-all duration-200 flex items-center lg:text-sm lg:py-3 lg:px-5 border border-white/20 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FAFBFC] focus:ring-offset-2 focus:ring-offset-[#2563EB]"
                          aria-label="Xem kết quả xét nghiệm - Chuyển đến trang tra cứu kết quả"
                          type="button"
                        >
                          <span>Xem kết quả</span>
                          <svg
                            className="w-4 h-4 ml-2 lg:w-5 lg:h-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </TransitionLink>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Medical Benefits Section - WCAG Compliant */}
              <div>
                {/* Compact Header with Integrated Trust Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-1 h-3 bg-gradient-to-b from-[#2563EB] to-[#0891B2] rounded-full mr-1.5 shadow-sm lg:h-4"></div>
                    <h2 className="font-bold text-[#1E40AF] text-xs lg:text-sm" id="benefits-heading">
                      Tại sao chọn chúng tôi
                    </h2>
                  </div>
                  {/* Compact Trust Badge with Accessibility */}
                  <div
                    className="flex items-center bg-gradient-to-r from-[#10B981]/10 to-[#059669]/10 px-1.5 py-0.5 rounded-full border border-[#10B981]/20"
                    role="img"
                    aria-label="Chứng nhận chất lượng cao cấp"
                  >
                    <svg
                      className="w-2 h-2 text-[#10B981] mr-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-[9px] font-semibold text-[#059669] lg:text-[10px]">Cao cấp</span>
                  </div>
                </div>

                {/* Compact Medical Benefits Container - Accessible */}
                <div className="bg-gradient-to-br from-[#FAFBFC] via-[#FAFBFC] to-[#F8FAFC] rounded-lg shadow-md border border-[#E5E9ED]/40 p-2.5 lg:p-3 relative overflow-hidden">
                  {/* Subtle Medical Background Pattern */}
                  <div className="absolute inset-0 opacity-[0.02]" aria-hidden="true">
                    {/* Medical Cross Watermark */}
                    <div className="absolute bottom-0 right-0 w-10 h-10 lg:w-14 lg:h-14 opacity-30">
                      <svg width="100%" height="100%" viewBox="0 0 24 24" className="text-[#0891B2]">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>

                  {/* Compact Benefits Grid with Accessibility */}
                  <div className="grid grid-cols-2 gap-2 relative z-10" role="list" aria-labelledby="benefits-heading">
                    {serviceBenefits.map((benefit, index) => (
                      <div
                        key={index}
                        className={`benefit-card-ultra group flex flex-col items-center text-center p-2 rounded-lg transition-all ${reducedMotion ? 'duration-0' : 'duration-300'} hover:bg-white/80 hover:shadow-md hover:scale-[1.02] border border-transparent hover:border-[#E5E9ED]/60 cursor-pointer min-h-[72px] lg:min-h-[80px]`}
                        style={{ animationDelay: reducedMotion ? '0ms' : benefit.animationDelay }}
                        role="listitem"
                        tabIndex={0}
                        aria-label={benefit.ariaLabel}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            // Could trigger benefit detail modal or action
                          }
                        }}
                      >
                        {/* Compact Medical Icon with Better Touch Target */}
                        <div className="icon-container-ultra relative mb-1.5">
                          <div
                            className={`w-7 h-7 ${benefit.bgColor} rounded-lg flex items-center justify-center shrink-0 relative z-10 transition-all ${reducedMotion ? 'duration-0' : 'duration-500'} group-hover:scale-110 group-hover:rotate-3 lg:w-8 lg:h-8 shadow-md border border-white/60 group-hover:shadow-lg`}
                          >
                            <svg
                              className={`w-4 h-4 ${benefit.iconColor} lg:w-5 lg:h-5 drop-shadow-sm transition-transform ${reducedMotion ? 'duration-0' : 'duration-300'} group-hover:scale-110`}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d={benefit.icon} />
                            </svg>
                          </div>
                          {/* Pulse Effect - Respects Reduced Motion */}
                          {!reducedMotion && (
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${benefit.gradientFrom} ${benefit.gradientTo} rounded-lg opacity-15 icon-pulse-ultra scale-110`}
                            ></div>
                          )}
                        </div>

                        {/* Enhanced Content with Better Typography */}
                        <div className="flex-1 min-h-0">
                          <h3
                            className={`font-bold text-xs text-[#1E40AF] lg:text-sm leading-tight mb-1 group-hover:text-[#2563EB] transition-colors ${reducedMotion ? 'duration-0' : 'duration-300'}`}
                          >
                            {benefit.title}
                          </h3>
                          <p
                            className={`text-[10px] text-[#6B7785] leading-relaxed lg:text-xs group-hover:text-[#4A5568] transition-colors ${reducedMotion ? 'duration-0' : 'duration-300'}`}
                          >
                            {benefit.description}
                          </p>
                        </div>

                        {/* Enhanced Interaction Indicator */}
                        <div
                          className={`w-0 h-px bg-gradient-to-r from-[#2563EB] to-[#0891B2] rounded-full mt-2 group-hover:w-8 transition-all ${reducedMotion ? 'duration-0' : 'duration-300'} lg:group-hover:w-10`}
                        ></div>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Medical Credibility Footer */}
                  <div className="flex items-center justify-center mt-3 pt-2.5 border-t border-[#E5E9ED]/30 lg:mt-3.5 lg:pt-3">
                    <div
                      className="flex items-center space-x-4 text-[10px] text-[#6B7785] lg:text-xs"
                      role="list"
                      aria-label="Chứng nhận và tiêu chuẩn chất lượng"
                    >
                      <div className="flex items-center" role="listitem">
                        <div
                          className={`w-1.5 h-1.5 bg-[#10B981] rounded-full mr-1.5 ${reducedMotion ? '' : 'animate-pulse'}`}
                        ></div>
                        <span className="font-medium">JCI</span>
                        <span className="sr-only">- Chứng nhận chất lượng quốc tế</span>
                      </div>
                      <div className="w-px h-3 bg-[#E5E9ED]" aria-hidden="true"></div>
                      <div className="flex items-center" role="listitem">
                        <div
                          className={`w-1.5 h-1.5 bg-[#2563EB] rounded-full mr-1.5 ${reducedMotion ? '' : 'animate-pulse'}`}
                          style={{ animationDelay: reducedMotion ? '0s' : '0.5s' }}
                        ></div>
                        <span className="font-medium">ISO</span>
                        <span className="sr-only">- Tiêu chuẩn ISO quốc tế</span>
                      </div>
                      <div className="w-px h-3 bg-[#E5E9ED]" aria-hidden="true"></div>
                      <div className="flex items-center" role="listitem">
                        <div
                          className={`w-1.5 h-1.5 bg-[#0891B2] rounded-full mr-1.5 ${reducedMotion ? '' : 'animate-pulse'}`}
                          style={{ animationDelay: reducedMotion ? '0s' : '1s' }}
                        ></div>
                        <span className="font-medium">24/7</span>
                        <span className="sr-only">- Dịch vụ 24 giờ mỗi ngày</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Region for Screen Reader Announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" role="status" id="hero-announcements"></div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.1); }
          40% { transform: scale(1); }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes pulse-fade {
          0% { opacity: 0.2; }
          50% { opacity: 0.8; }
          100% { opacity: 0.2; }
        }
        
        .heartbeat {
          animation: heartbeat 2s infinite ease-in-out;
        }
        
        .pulse-fade {
          animation: pulse-fade 3s infinite ease-in-out;
        }
        
        .ecg-line {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 300%;
          background-image: url("data:image/svg+xml,%3Csvg width='300' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L 8 20 L 12 5 L 16 35 L 20 2 L 24 20 L 30 20 L 35 12 L 40 20 L 80 20 L 85 12 L 92 28 L 96 20 L 105 20 L 110 5 L 115 35 L 122 8 L 128 20 L 135 20 L 150 20 L 155 10 L 162 20 L 200 20 L 205 15 L 210 25 L 215 20 L 250 20 L 255 8 L 260 32 L 265 20 L 300 20' stroke='%23ffffff' stroke-width='2' fill='none' stroke-linecap='round' /%3E%3C/svg%3E");
          background-repeat: repeat-x;
          animation: slide 15s linear infinite;
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.3));
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes shine {
          from {
            transform: translateX(-100%) rotate(-45deg);
          }
          to {
            transform: translateX(100%) rotate(-45deg);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes imageZoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }

        @keyframes shimmerButton {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes medicalPulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        .animate-shine {
          animation: shine 1.5s infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-imageZoom {
          animation: imageZoom 20s ease-in-out infinite;
        }

        .animate-floatSlow {
          animation: floatSlow 6s ease-in-out infinite;
        }

        .animate-medicalPulse {
          animation: medicalPulse 3s ease-in-out infinite;
        }
        
        /* Enhanced animations for optimized benefits section */
        @keyframes iconPulse {
          0% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.7); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.2; }
        }

        @keyframes iconPulseCompact {
          0% { transform: scale(1.1); opacity: 0.15; }
          50% { transform: scale(1.4); opacity: 0.08; }
          100% { transform: scale(1.1); opacity: 0.15; }
        }

        @keyframes iconPulseUltra {
          0% { transform: scale(1.05); opacity: 0.12; }
          50% { transform: scale(1.25); opacity: 0.06; }
          100% { transform: scale(1.05); opacity: 0.12; }
        }

        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes compactSlideIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes ultraSlideIn {
          0% { opacity: 0; transform: translateY(6px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes subtleGlow {
          0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
          50% { box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
          100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }

        @keyframes microGlow {
          0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
          50% { box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.08); }
          100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }

        .icon-pulse {
          animation: iconPulse 3s infinite ease-in-out;
        }

        .icon-pulse-compact {
          animation: iconPulseCompact 4s infinite ease-in-out;
        }

        .icon-pulse-ultra {
          animation: iconPulseUltra 5s infinite ease-in-out;
        }

        .benefit-card {
          animation: floatUp 0.5s ease-out forwards;
          opacity: 0;
        }

        .benefit-card-compact {
          animation: compactSlideIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .benefit-card-ultra {
          animation: ultraSlideIn 0.4s ease-out forwards;
          opacity: 0;
        }

        .benefit-card-compact:hover .icon-container-compact > div:first-child {
          animation: subtleGlow 2s infinite ease-in-out;
        }

        .benefit-card-ultra:hover .icon-container-ultra > div:first-child {
          animation: microGlow 2s infinite ease-in-out;
        }
        
        /* Zalo Mini App specific transitions */
        @keyframes miniAppSlideIn {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @media (max-width: 768px) {
          .benefit-card:nth-child(1) { animation-delay: 100ms; }
          .benefit-card:nth-child(2) { animation-delay: 200ms; }
          .benefit-card:nth-child(3) { animation-delay: 300ms; }
          .benefit-card:nth-child(4) { animation-delay: 400ms; }

          .benefit-card-compact:nth-child(1) { animation-delay: 0ms; }
          .benefit-card-compact:nth-child(2) { animation-delay: 150ms; }
          .benefit-card-compact:nth-child(3) { animation-delay: 300ms; }
          .benefit-card-compact:nth-child(4) { animation-delay: 450ms; }

          .benefit-card-ultra:nth-child(1) { animation-delay: 0ms; }
          .benefit-card-ultra:nth-child(2) { animation-delay: 100ms; }
          .benefit-card-ultra:nth-child(3) { animation-delay: 200ms; }
          .benefit-card-ultra:nth-child(4) { animation-delay: 300ms; }
        }

        /* Enhanced accessibility and reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .benefit-card-ultra,
          .benefit-card-compact,
          .benefit-card,
          .icon-pulse,
          .icon-pulse-compact,
          .icon-pulse-ultra,
          .animate-imageZoom,
          .animate-floatSlow,
          .animate-medicalPulse,
          .heartbeat,
          .pulse-fade,
          .ecg-line {
            animation: none;
            opacity: 1;
            transform: none;
          }

          .benefit-card-compact:hover .icon-container-compact > div:first-child,
          .benefit-card-ultra:hover .icon-container-ultra > div:first-child {
            animation: none;
          }
        }

        /* Enhanced responsive image optimizations */
        @media (max-width: 640px) {
          .ecg-line {
            background-size: 150px 20px;
            animation-duration: 8s;
          }
        }

        @media (min-width: 1024px) {
          .ecg-line {
            background-size: 400px 40px;
            animation-duration: 20s;
          }
        }

        /* Image quality optimizations */
        img[loading="lazy"] {
          transition: opacity 0.3s ease-in-out;
        }

        img[loading="lazy"]:not([src]) {
          opacity: 0;
        }

        /* Enhanced medical visual effects */
        .medical-glow {
          box-shadow:
            0 0 20px rgba(37, 99, 235, 0.3),
            0 0 40px rgba(37, 99, 235, 0.2),
            0 0 60px rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
