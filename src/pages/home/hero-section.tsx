import { useState, useEffect } from 'react';
import TransitionLink from '@/components/transition-link';

interface HeroSectionProps {
  className?: string;
}

const HeroSection = ({ className }: HeroSectionProps) => {
  return (
    <section className={`relative pt-0 pb-4 md:py-0 ${className ?? ''}`}>
      <div className="w-full mx-auto max-w-[1440px] md:px-6 lg:px-8">
        {/* Hero Banner with Content */}
        <div className="relative w-full mb-6">
          {/* Main Banner */}
          <div className="relative w-full h-[280px] overflow-hidden shadow-lg rounded-b-3xl md:rounded-b-[40px] md:h-[420px] lg:h-[500px]">
            <img
              src="https://benhvienhoabinh.vn/wp-content/uploads/2024/11/HB6.jpg"
              alt="Banner Bệnh Viện Đa Khoa Hòa Bình"
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-10000 md:object-[center_35%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-800/50 via-blue-700/30 to-transparent"></div>

            {/* Hero Content */}
            <div className="absolute top-0 left-0 right-0 p-5 md:p-10 lg:p-16 flex flex-col h-full justify-between">
              <div className="mt-2 md:mt-6 lg:mt-10 md:max-w-2xl">
                <div className="backdrop-blur-sm bg-blue-800/30 p-4 md:p-6 rounded-xl inline-block border-l-4 border-cyan-400 animate-fadeIn shadow-lg">
                  <h2 className="text-xl font-bold text-white leading-tight md:text-3xl lg:text-4xl drop-shadow-lg">
                    <span className="text-cyan-300 font-extrabold">"Trị bệnh bằng khối óc</span>
                    <br />
                    <span className="text-white">Chăm sóc bằng trái tim"</span>
                  </h2>
                </div>
                <p className="text-sm text-white mt-3 max-w-md md:text-lg lg:text-xl md:mt-5 drop-shadow-md bg-blue-800/30 backdrop-blur-sm p-2 px-4 md:p-3 md:px-6 rounded-lg inline-block animate-slideIn">
                  Đặt lịch khám với các chuyên gia y tế hàng đầu
                </p>
              </div>

              <TransitionLink to="/booking" className="md:self-start">
                <button className="self-center mt-4 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold rounded-full shadow-xl hover:from-cyan-700 hover:to-cyan-600 hover:shadow-cyan-500/30 hover:shadow-2xl active:scale-[0.97] md:self-start md:mt-0 md:px-10 md:py-4 md:text-lg flex items-center transition-all duration-300">
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
                  ĐẶT LỊCH KHÁM
                </button>
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
