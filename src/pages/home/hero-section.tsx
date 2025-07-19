import doctor from '@/static/icon/doctor.png';
import equipment from '@/static/icon/equipment.png';
import service from '@/static/icon/service.png';
import process from '@/static/icon/process.png';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="flex flex-row items-center p-4 bg-white rounded-xl shadow-md border-l-4 border-emerald-500 w-full md:flex-col md:items-center md:py-5 md:px-4 hover:shadow-lg hover:scale-[1.02]">
      <div className="w-12 h-12 mr-4 flex-shrink-0 md:w-16 md:h-16 md:mr-0 md:mb-4 bg-emerald-50 rounded-full flex items-center justify-center p-2">
        <img src={icon} alt={title} className="w-full h-full object-contain" />
      </div>
      <div className="flex-1 md:flex-none md:text-center">
        <h3 className="text-sm font-bold text-emerald-700 leading-tight md:text-lg">{title}</h3>
        <p className="text-xs text-gray-600 leading-tight mt-1 md:text-sm md:mt-2">{description}</p>
      </div>
    </div>
  );
};

interface HeroSectionProps {
  className?: string;
}

const HeroSection = ({ className }: HeroSectionProps) => {
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
    <section className={`relative pt-4 pb-8 md:py-8 ${className ?? ''}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Hero Banner with Content */}
        <div className="relative w-full mb-8 md:mb-16">
          {/* Main Banner */}
          <div className="relative w-full h-[220px] rounded-2xl overflow-hidden shadow-xl md:h-[360px] lg:h-[480px]">
            <img
              src="https://tamthienduc.vn/wp-content/uploads/2025/03/MAN05999.png"
              alt="Banner Tâm Thiện Đức"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-transparent to-black/60"></div>

            {/* Hero Content */}
            <div className="absolute top-0 left-0 right-0 p-6 md:p-8 lg:p-10 flex flex-col h-full justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white leading-tight md:text-4xl lg:text-5xl drop-shadow-md">
                  Chăm sóc sức khỏe
                  <br />
                  <span className="text-emerald-300">chuyên nghiệp</span>
                </h2>
                <p className="text-sm text-white/90 mt-2 max-w-md md:text-xl md:mt-4 drop-shadow-md">
                  Đặt lịch khám với các chuyên gia y tế hàng đầu ngay hôm nay
                </p>
              </div>

              <button className="self-start mt-4 px-6 py-2.5 bg-emerald-500 text-white font-medium rounded-full shadow-lg hover:bg-emerald-600 active:scale-[0.98] md:mt-0 md:px-8 md:py-3 md:text-lg">
                Đặt lịch ngay
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-6 md:mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 md:text-xl lg:text-2xl md:text-center">
              Tại sao chọn <span className="text-emerald-600">Tâm Thiện Đức</span>?
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-5">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="#10b981"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="#10b981"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="#10b981"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
