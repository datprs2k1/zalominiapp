interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
    <div className="w-16 h-16 mb-4">
      <img src={icon} alt={title} width={64} height={64} />
    </div>
    <h3 className="text-lg font-semibold text-emerald-700 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const HeroSection = () => {
  const features = [
    {
      icon: '/icons/doctor.svg',
      title: 'Đội ngũ chuyên gia bác sĩ',
      description: 'có trình độ chuyên môn',
    },
    {
      icon: '/icons/quality.svg',
      title: 'Dịch vụ chất lượng tốt',
      description: 'an toàn – hiệu quả',
    },
    {
      icon: '/icons/equipment.svg',
      title: 'Hệ thống máy móc nhập khẩu',
      description: 'từ Châu Âu, Nhật, Hàn',
    },
    {
      icon: '/icons/treatment.svg',
      title: 'Quy trình điều trị khép kín',
      description: 'phù hợp với từng khách hàng',
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-emerald-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">Chăm sóc sức khỏe chuyên nghiệp</h1>
          <p className="text-lg text-gray-600">Đặt lịch khám với các chuyên gia y tế hàng đầu</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
