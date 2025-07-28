import { useState, useEffect, useRef } from 'react';
import TransitionLink from '@/components/transition-link';

interface HeroSectionProps {
  className?: string;
}

const HeroSection = ({ className }: HeroSectionProps) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Effect for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Popular search suggestions
  const popularSearches = ['Khám tổng quát', 'Bác sĩ da liễu', 'Xét nghiệm máu', 'Nhi khoa'];

  // Banner images - use multiple for carousel effect
  const bannerImages = [
    'https://benhvienhoabinh.vn/wp-content/uploads/2024/11/HB6.jpg',
    'https://benhvienhoabinh.vn/wp-content/uploads/2024/11/HB3.jpg',
  ];

  // Quick access features with medical-themed icons - Updated with preferred medical colors
  const quickFeatures = [
    {
      id: 'appointments',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z M9 11h6 M9 15h6', // Medical appointment calendar with cross
      label: 'Đặt lịch',
      bgColor: 'from-[#2563EB] to-[#1E40AF]', // Medical blues
      textColor: 'text-[#2563EB]',
      hoverColor: 'hover:text-[#1E40AF]',
      shadowColor: 'hover:shadow-[#2563EB]/25',
      ariaLabel: 'Đặt lịch khám bệnh',
    },
    {
      id: 'doctors',
      icon: 'M11 2a2 2 0 0 0-2 2v6.5a0.5 0.5 0 0 1-1 0V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6.5a6.5 6.5 0 0 0 13 0V4a2 2 0 0 0-2-2h-2z M16 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z', // Stethoscope icon
      label: 'Bác sĩ',
      bgColor: 'from-[#10B981] to-[#059669]', // Healing greens
      textColor: 'text-[#10B981]',
      hoverColor: 'hover:text-[#059669]',
      shadowColor: 'hover:shadow-[#10B981]/25',
      ariaLabel: 'Tìm bác sĩ chuyên khoa',
    },
    {
      id: 'services',
      icon: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', // Medical cross in circle
      label: 'Dịch vụ',
      bgColor: 'from-[#0891B2] to-[#0E7490]', // Trust-building cyan
      textColor: 'text-[#0891B2]',
      hoverColor: 'hover:text-[#0E7490]',
      shadowColor: 'hover:shadow-[#0891B2]/25',
      ariaLabel: 'Dịch vụ y tế và khám chữa bệnh',
    },
    {
      id: 'results',
      icon: 'M22 12h-4l-3 9L9 3l-3 9H2 M12 6v6l4 2', // Heartbeat/vital signs with clock
      label: 'Kết quả',
      bgColor: 'from-[#2563EB] to-[#0891B2]', // Medical blue to cyan gradient
      textColor: 'text-[#2563EB]',
      hoverColor: 'hover:text-[#0891B2]',
      shadowColor: 'hover:shadow-[#2563EB]/25',
      ariaLabel: 'Xem kết quả xét nghiệm và chẩn đoán',
    },
  ];

  // Service benefits with medical-themed icons - Updated with preferred medical colors
  const serviceBenefits = [
    {
      title: 'Đội ngũ y bác sĩ',
      description: 'Chuyên môn cao, tận tâm với người bệnh',
      icon: 'M11 2a2 2 0 0 0-2 2v6.5a0.5 0.5 0 0 1-1 0V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6.5a6.5 6.5 0 0 0 13 0V4a2 2 0 0 0-2-2h-2z M16 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z', // Stethoscope
      bgColor: 'bg-[#EFF6FF]', // Medical blue background
      iconColor: 'text-[#2563EB]', // Medical blue
      gradientFrom: 'from-[#2563EB]',
      gradientTo: 'to-[#1E40AF]',
      animationDelay: '0ms',
      ariaLabel: 'Đội ngũ y bác sĩ chuyên nghiệp',
    },
    {
      title: 'Chất lượng điều trị',
      description: 'Tiêu chuẩn quốc tế, hiệu quả cao',
      icon: 'M22 12h-4l-3 9L9 3l-3 9H2 M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', // Heartbeat with quality star
      bgColor: 'bg-[#ECFDF5]', // Healing green background
      iconColor: 'text-[#10B981]', // Healing green
      gradientFrom: 'from-[#10B981]',
      gradientTo: 'to-[#059669]',
      animationDelay: '100ms',
      ariaLabel: 'Chất lượng điều trị cao cấp',
    },
    {
      title: 'Công nghệ hiện đại',
      description: 'Trang thiết bị y tế tiên tiến',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z M12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6z M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z', // Medical scanner/imaging device
      bgColor: 'bg-[#ECFEFF]', // Trust cyan background
      iconColor: 'text-[#0891B2]', // Trust cyan
      gradientFrom: 'from-[#0891B2]',
      gradientTo: 'to-[#0E7490]',
      animationDelay: '200ms',
      ariaLabel: 'Công nghệ y tế hiện đại',
    },
    {
      title: 'Dịch vụ toàn diện',
      description: 'Chăm sóc chu đáo, theo dõi liên tục',
      icon: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z M3 3h18v18H3V3z M7 7h10v10H7V7z', // Medical cross with comprehensive care grid
      bgColor: 'bg-[#F0FDFA]', // Soft medical white with green tint
      iconColor: 'text-[#059669]', // Deep healing green
      gradientFrom: 'from-[#10B981]',
      gradientTo: 'to-[#059669]',
      animationDelay: '300ms',
      ariaLabel: 'Dịch vụ chăm sóc sức khỏe toàn diện',
    },
  ];

  // Animated slogans
  const slogans = [
    {
      line1: 'Trị bệnh bằng khối óc',
      line2: 'Chăm sóc bằng trái tim',
    },
    {
      line1: 'Sức khỏe là vàng',
      line2: 'Chăm sóc là trách nhiệm',
    },
  ];

  const [activeSloganIndex, setActiveSloganIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Handle search focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  // Handle search blur
  const handleSearchBlur = () => {
    // Small delay to allow clicking on suggestions
    setTimeout(() => {
      if (document.activeElement !== searchInputRef.current) {
        setIsSearchFocused(false);
      }
    }, 150);
  };

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    // Focus the input after selecting a suggestion
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Cycle through slogans
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveSloganIndex((prev) => (prev + 1) % slogans.length);
        setActiveImageIndex((prev) => (prev + 1) % bannerImages.length);
        setAnimating(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`relative pt-0 pb-0 ${className ?? ''}`}>
      <div className="relative w-full overflow-hidden bg-[#FAFBFC] rounded-3xl border border-[#E5E9ED]/30 shadow-[0_8px_24px_rgba(37,99,235,0.06)]">
        {/* Premium Medical Content Area - Enhanced Spacing */}
        <div className="pb-8 mx-auto w-full max-w-7xl px-4 lg:px-6">
          <div className="lg:flex lg:flex-row lg:items-start lg:gap-8 lg:mt-8">
            {/* Premium Medical Banner with Enhanced Visual Hierarchy */}
            <div className="rounded-3xl overflow-hidden mt-4 mb-8 relative shadow-xl border border-[#E5E9ED]/20 lg:w-3/5 lg:mb-0">
              {/* Enhanced Image Carousel with Medical Proportions */}
              <div className="relative h-[250px] lg:h-[420px]">
                {bannerImages.map((img, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${activeImageIndex === index ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <img
                      src={img}
                      alt={`Bệnh Viện Hòa Bình - Slide ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Medical overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1E40AF]/90 via-[#2563EB]/75 to-[#0891B2]/20"></div>
                  </div>
                ))}

                {/* Enhanced Medical Visual Elements */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Enhanced ECG Line with Medical Styling */}
                  <div className="absolute bottom-8 left-0 w-full overflow-hidden h-8 opacity-25">
                    <div className="ecg-line-medical"></div>
                  </div>

                  {/* Medical Cross Pattern Overlay */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
                    <svg width="120" height="120" viewBox="0 0 120 120" className="text-[#0891B2]">
                      <path d="M60 20v80M20 60h80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                      <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="3" fill="none" />
                    </svg>
                  </div>

                  {/* Enhanced Medical Icons with Medical Colors */}
                  <div className="absolute top-4 right-4">
                    <svg
                      className="h-6 w-6 text-[#0891B2]/40 heartbeat lg:h-8 lg:w-8 drop-shadow-sm"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-label="Nhịp tim - Sức khỏe tim mạch"
                      role="img"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div className="absolute top-4 left-4">
                    <svg
                      className="h-6 w-6 text-[#10B981]/30 pulse-fade lg:h-8 lg:w-8 drop-shadow-sm"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-label="Ống nghe - Chăm sóc y tế"
                      role="img"
                    >
                      <path
                        d="M11 2a2 2 0 0 0-2 2v6.5a0.5 0.5 0 0 1-1 0V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6.5a6.5 6.5 0 0 0 13 0V4a2 2 0 0 0-2-2h-2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="16" cy="18" r="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Premium Medical Slogan with Enhanced Typography */}
                <div className="absolute inset-0 flex flex-col justify-center items-start p-6 z-10 lg:p-12">
                  <div
                    className={`max-w-[280px] lg:max-w-lg transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
                  >
                    {/* Premium Hospital Badge */}
                    <div className="inline-flex items-center bg-[#FAFBFC]/20 backdrop-blur-md px-3 py-1.5 rounded-full mb-4 border border-[#0891B2]/30 shadow-lg lg:px-4 lg:py-2">
                      <svg
                        className="h-4 w-4 text-[#0891B2] mr-1.5 lg:h-5 lg:w-5 drop-shadow-sm"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-label="Chất lượng y tế cao cấp"
                        role="img"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-xs font-semibold text-white drop-shadow-sm lg:text-sm">
                        Chất lượng cao cấp
                      </span>
                    </div>

                    {/* Premium Medical Slogan Layout */}
                    <h2 className="font-bold text-white leading-tight mb-5 lg:mb-8 drop-shadow-lg">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center mb-1">
                          <div className="w-1 h-6 bg-[#0891B2] mr-2 rounded-full lg:h-10 lg:w-1.5 shadow-lg"></div>
                          <span className="text-[#0891B2] font-extrabold text-xl lg:text-3xl drop-shadow-md">
                            {slogans[activeSloganIndex].line1}
                          </span>
                        </div>
                        <span className="text-white text-lg ml-3 lg:text-2xl lg:ml-4 drop-shadow-md">
                          {slogans[activeSloganIndex].line2}
                        </span>
                      </div>
                    </h2>

                    {/* Premium Medical CTA Button */}
                    <TransitionLink to="/booking">
                      <button className="bg-gradient-to-r from-[#0891B2] to-[#2563EB] text-white font-semibold py-3 px-5 rounded-xl shadow-xl hover:shadow-[#0891B2]/30 active:scale-95 transition-all duration-200 flex items-center justify-center w-full lg:text-lg lg:py-4 border border-white/20 backdrop-blur-sm">
                        <svg
                          className="h-5 w-5 mr-2 lg:h-6 lg:w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          aria-label="Đặt lịch khám bệnh"
                          role="img"
                        >
                          <path
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path d="M9 11h6M9 15h6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="tracking-wide">ĐẶT LỊCH NGAY</span>
                      </button>
                    </TransitionLink>
                  </div>
                </div>

                {/* Image carousel indicators */}
                <div className="absolute bottom-3 right-3 flex gap-1.5 lg:bottom-6 lg:right-6">
                  {bannerImages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all lg:w-2 lg:h-2 ${activeImageIndex === index ? 'bg-white w-4 lg:w-6' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Medical Right Column - Enhanced Visual Hierarchy */}
            <div className="lg:w-2/5 lg:pt-4">
              {/* Premium Medical Quick Access with Enhanced Spacing */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#1E40AF] text-base lg:text-xl">Truy cập nhanh</h3>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-[#0891B2] rounded-full mr-1.5 animate-pulse lg:w-2 lg:h-2 shadow-sm"></div>
                    <span className="text-xs text-[#059669] font-semibold lg:text-sm">Dễ dàng tiếp cận</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 lg:gap-5">
                  {quickFeatures.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => setActiveTab(feature.id)}
                      className="flex flex-col items-center group relative focus:outline-none"
                    >
                      <div
                        className={`w-[65px] h-[65px] lg:w-[80px] lg:h-[80px] bg-gradient-to-br ${feature.bgColor} rounded-2xl flex items-center justify-center mb-3 shadow-lg transform transition-all duration-300 group-hover:scale-105 group-active:scale-95 relative overflow-hidden focus:outline-none ${feature.shadowColor} border border-white/20`}
                      >
                        {/* Enhanced animated background effect */}
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300 rounded-2xl"></div>
                        <div className="absolute -inset-full h-[500%] w-[200%] opacity-0 group-hover:opacity-40 group-active:opacity-60 bg-gradient-to-tr from-white via-white to-transparent -z-10 transform -rotate-45 group-hover:animate-shine"></div>

                        <svg
                          className="h-7 w-7 text-white relative z-10 lg:h-9 lg:w-9 drop-shadow-sm"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-label={feature.ariaLabel}
                          role="img"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                        </svg>

                        {/* Enhanced ring indicator for active tab */}
                        {activeTab === feature.id && (
                          <span className="absolute inset-0 border-2 border-[#FAFBFC] rounded-2xl animate-pulse shadow-lg"></span>
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold transition-colors duration-300 lg:text-sm ${activeTab === feature.id ? feature.textColor : 'text-[#4A5568]'} ${feature.hoverColor}`}
                      >
                        {feature.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Premium Medical Tab Content */}
                <div className="mt-6 overflow-hidden rounded-2xl bg-[#FAFBFC] p-5 border border-[#E5E9ED]/50 shadow-[inset_0_2px_4px_rgba(37,99,235,0.05)] animate-fadeIn lg:p-7">
                  {activeTab === 'appointments' && (
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1E40AF] lg:text-base">Đặt lịch khám</h4>
                        <p className="text-xs text-[#6B7785] mt-1 lg:text-sm">Đặt lịch trực tuyến nhanh chóng</p>
                      </div>
                      <TransitionLink to="/booking">
                        <button className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-[#2563EB]/25 transition-all duration-200 flex items-center lg:text-sm lg:py-2.5 lg:px-5 border border-white/20">
                          <span>Đặt ngay</span>
                          <svg className="w-4 h-4 ml-1.5 lg:w-5 lg:h-5" viewBox="0 0 20 20" fill="currentColor">
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
                      <div>
                        <h4 className="text-sm font-bold text-[#1E40AF] lg:text-base">Đội ngũ bác sĩ</h4>
                        <p className="text-xs text-[#6B7785] mt-1 lg:text-sm">
                          Bác sĩ chuyên môn cao, giàu kinh nghiệm
                        </p>
                      </div>
                      <TransitionLink to="/doctor">
                        <button className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-[#10B981]/25 transition-all duration-200 flex items-center lg:text-sm lg:py-2.5 lg:px-5 border border-white/20">
                          <span>Xem bác sĩ</span>
                          <svg className="w-4 h-4 ml-1.5 lg:w-5 lg:h-5" viewBox="0 0 20 20" fill="currentColor">
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
                      <div>
                        <h4 className="text-sm font-bold text-[#1E40AF] lg:text-base">Dịch vụ y tế</h4>
                        <p className="text-xs text-[#6B7785] mt-1 lg:text-sm">Đa dạng dịch vụ y tế chất lượng cao</p>
                      </div>
                      <TransitionLink to="/services">
                        <button className="bg-gradient-to-r from-[#0891B2] to-[#0E7490] text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-[#0891B2]/25 transition-all duration-200 flex items-center lg:text-sm lg:py-2.5 lg:px-5 border border-white/20">
                          <span>Xem dịch vụ</span>
                          <svg className="w-4 h-4 ml-1.5 lg:w-5 lg:h-5" viewBox="0 0 20 20" fill="currentColor">
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
                      <div>
                        <h4 className="text-sm font-bold text-[#1E40AF] lg:text-base">Kết quả xét nghiệm</h4>
                        <p className="text-xs text-[#6B7785] mt-1 lg:text-sm">Tra cứu kết quả xét nghiệm trực tuyến</p>
                      </div>
                      <TransitionLink to="/schedule/test-result">
                        <button className="bg-gradient-to-r from-[#2563EB] to-[#0891B2] text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-[#2563EB]/25 transition-all duration-200 flex items-center lg:text-sm lg:py-2.5 lg:px-5 border border-white/20">
                          <span>Xem kết quả</span>
                          <svg className="w-4 h-4 ml-1.5 lg:w-5 lg:h-5" viewBox="0 0 20 20" fill="currentColor">
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

              {/* Premium Medical Benefits Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-2 h-8 bg-gradient-to-b from-[#2563EB] to-[#0891B2] rounded-full mr-3 shadow-sm"></div>
                    <h3 className="font-bold text-[#1E40AF] text-lg lg:text-xl">Tại sao chọn chúng tôi</h3>
                  </div>
                </div>

                {/* Premium Medical Benefits Cards */}
                <div className="bg-[#FAFBFC] rounded-3xl shadow-lg border border-[#E5E9ED]/30 p-5 lg:p-6 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rotate-45">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                      <path d="M0 0H100V100H0V0Z" fill="url(#pattern0)" />
                      <defs>
                        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="0.2" height="0.2">
                          <use href="#image0_101_345" transform="scale(0.01)" />
                        </pattern>
                        <image
                          id="image0_101_345"
                          width="20"
                          height="20"
                          href="data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%230066FF'/%3E%3C/svg%3E"
                        />
                      </defs>
                    </svg>
                  </div>

                  {/* Premium Medical Benefits Grid with Enhanced Spacing */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
                    {serviceBenefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="benefit-card flex gap-4 items-start p-4 rounded-2xl transition-all duration-300 hover:bg-white/60 hover:shadow-md lg:p-5 border border-transparent hover:border-[#E5E9ED]/50"
                        style={{ animationDelay: benefit.animationDelay }}
                      >
                        {/* Premium Medical Icon with Enhanced Animation */}
                        <div className="icon-container relative">
                          <div
                            className={`w-12 h-12 ${benefit.bgColor} rounded-full flex items-center justify-center shrink-0 relative z-10 transition-transform duration-500 hover:scale-110 lg:w-14 lg:h-14 shadow-sm border border-white/50`}
                          >
                            <svg
                              className={`w-6 h-6 ${benefit.iconColor} lg:w-7 lg:h-7 drop-shadow-sm`}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              aria-label={benefit.ariaLabel}
                              role="img"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d={benefit.icon} />
                            </svg>
                          </div>
                          {/* Enhanced Animated Pulse Effect */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${benefit.gradientFrom} ${benefit.gradientTo} rounded-full opacity-15 icon-pulse`}
                          ></div>
                        </div>

                        {/* Content with Premium Medical Typography */}
                        <div className="flex-1">
                          <h3 className="font-bold text-base text-[#1E40AF] lg:text-lg leading-tight">
                            {benefit.title}
                          </h3>
                          <p className="text-sm text-[#6B7785] mt-1 line-clamp-2 lg:text-base leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
          width: 200%;
          background-image: url("data:image/svg+xml,%3Csvg width='200' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 L 5 10 L 7 2 L 10 18 L 13 0 L 16 10 L 20 10 L 23 6 L 26 10 L 100 10 L 102 6 L 106 14 L 108 10 L 112 10 L 115 2 L 118 18 L 123 3 L 126 10 L 130 10 L 140 10 L 142 4 L 145 10 L 200 10' stroke='white' fill='none' /%3E%3C/svg%3E");
          background-repeat: repeat-x;
          animation: slide 10s linear infinite;
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

        .animate-shine {
          animation: shine 1.5s infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* New animations for benefits section */
        @keyframes iconPulse {
          0% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.7); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.2; }
        }
        
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .icon-pulse {
          animation: iconPulse 3s infinite ease-in-out;
        }
        
        .benefit-card {
          animation: floatUp 0.5s ease-out forwards;
          opacity: 0;
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
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
