import doctor from '@/static/icon/doctor.png';
import equipment from '@/static/icon/equipment.png';
import service from '@/static/icon/service.png';
import process from '@/static/icon/process.png';
import { useState, useEffect } from 'react';
import TransitionLink from '@/components/transition-link';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  return (
    <div
      className="flex flex-row items-center p-4 bg-white rounded-xl shadow-md border-l-4 border-[#1E88E5] w-full md:flex-col md:items-center md:py-8 md:px-6 hover:shadow-lg transform hover:translate-y-[-5px] transition-all duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-12 h-12 mr-4 flex-shrink-0 md:w-20 md:h-20 md:mr-0 md:mb-5 bg-gradient-to-br from-[#1E88E5] to-[#42A5F5] rounded-full flex items-center justify-center p-2 shadow-md">
        <img src={icon} alt={title} className="w-3/4 h-3/4 object-contain filter brightness-0 invert" />
      </div>
      <div className="flex-1 md:flex-none md:text-center">
        <h3 className="text-sm font-bold text-[#1E88E5] leading-tight md:text-xl">{title}</h3>
        <p className="text-xs text-gray-600 leading-tight mt-1 md:text-sm md:mt-3">{description}</p>
      </div>
    </div>
  );
};

interface HeroSectionProps {
  className?: string;
}

const HeroSection = ({ className }: HeroSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: doctor,
      title: 'Đội ngũ chuyên gia bác sĩ',
      description: 'có trình độ chuyên môn cao, tận tâm với bệnh nhân',
    },
    {
      icon: service,
      title: 'Dịch vụ chất lượng tốt',
      description: 'an toàn – hiệu quả – đạt chuẩn quốc tế',
    },
    {
      icon: equipment,
      title: 'Hệ thống máy móc nhập khẩu',
      description: 'công nghệ hiện đại từ Châu Âu, Nhật, Hàn Quốc',
    },
    {
      icon: process,
      title: 'Quy trình điều trị khép kín',
      description: 'phù hợp với từng khách hàng, đảm bảo kết quả tối ưu',
    },
  ];

  return (
    <section className={`relative pt-0 pb-4 md:py-0 ${className ?? ''}`}>
      <div className="w-full mx-auto max-w-[1440px] md:px-6 lg:px-8">
        {/* Hospital Name Banner - Improved Gradient */}
        <div className="text-white py-3 px-3 md:py-5 md:px-8 text-center mb-0 shadow-lg bg-gradient-to-r from-[#1565C0] to-[#42A5F5]">
          <h1 className="text-lg font-bold tracking-tight leading-tight md:text-2xl lg:text-3xl relative">
            <span className="relative inline-block">
              BỆNH VIỆN ĐA KHOA
              <div className="absolute bottom-0 left-0 h-1 bg-white w-0 group-hover:w-full transition-all duration-300"></div>
            </span>
            <span className="block mt-1 text-blue-100 font-extrabold text-xl md:text-3xl lg:text-4xl">
              HÒA BÌNH - HẢI PHÒNG
            </span>
          </h1>
        </div>

        {/* Hero Banner with Content */}
        <div className="relative w-full mb-4 md:mb-16">
          {/* Main Banner */}
          <div className="relative w-full h-[280px] overflow-hidden shadow-2xl md:h-[450px] lg:h-[550px]">
            <img
              src="https://benhvienhoabinh.vn/wp-content/uploads/2024/11/HB6.jpg"
              alt="Banner Bệnh Viện Đa Khoa Hòa Bình"
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-10000 md:object-[center_35%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D47A1]/30 via-[#0D47A1]/20 to-transparent"></div>

            {/* Hero Content */}
            <div className="absolute top-0 left-0 right-0 p-4 md:p-10 lg:p-16 flex flex-col h-full justify-between">
              <div className="mt-2 md:mt-6 lg:mt-10 md:max-w-2xl">
                <div className="backdrop-blur-md bg-[#0D47A1]/40 p-4 md:p-8 rounded-xl inline-block border-l-4 border-[#4FC3F7] animate-fadeIn">
                  <h2 className="text-xl font-bold text-white leading-tight md:text-4xl lg:text-5xl drop-shadow-lg">
                    <span className="text-[#4FC3F7] font-extrabold">"Trị bệnh bằng khối óc</span>
                    <br />
                    <span className="text-white">Chăm sóc bằng trái tim"</span>
                  </h2>
                </div>
                <p className="text-sm text-white mt-3 max-w-md md:text-xl lg:text-2xl md:mt-5 drop-shadow-md bg-[#0D47A1]/40 backdrop-blur-sm p-2 px-4 md:p-4 md:px-6 rounded-lg inline-block animate-slideIn">
                  Đặt lịch khám với các chuyên gia y tế hàng đầu
                </p>
              </div>

              <TransitionLink to="/booking" className="md:self-start">
                <button className="self-center mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-xl hover:bg-blue-700 hover:shadow-[#009688]/30 hover:shadow-2xl active:scale-[0.97] md:self-start md:mt-0 md:px-10 md:py-4 md:text-lg flex items-center transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 md:h-6 md:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  ĐĂNG KÝ KHÁM
                </button>
              </TransitionLink>
            </div>
          </div>
        </div>

        {/* Feature Cards Mobile Carousel */}
        <div className="px-4 md:px-0 mb-6 md:mb-12">
          <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 py-2 flex gap-3 md:gap-6 md:grid md:grid-cols-4 lg:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="w-[85vw] flex-shrink-0 md:w-full">
                <FeatureCard {...feature} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.8s ease-out forwards;
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
