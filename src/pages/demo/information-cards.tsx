import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  InformationCard, 
  DoctorInfoCard, 
  AppointmentInfoCard, 
  VitalInfoCard, 
  EmergencyInfoCard,
  MedicalIcons 
} from '@/components/information-card';
import { 
  MedicalCrossIcon, 
  StethoscopeIcon, 
  HeartIcon, 
  CertificateIcon,
  MedicalShieldIcon,
  ExperienceIcon,
  LanguageIcon,
  MedicalFeeIcon,
  OnlineStatusIcon,
  StarIcon,
  AppointmentIcon
} from '@/components/medical-icons';

const InformationCardsDemo: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardClick = (cardId: string) => {
    setSelectedCard(selectedCard === cardId ? null : cardId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-surface-medical p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Medical Information Cards
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive information display components designed for healthcare applications
          </p>
        </motion.div>

        {/* Doctor Information Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
            <StethoscopeIcon className="text-primary mr-3" size="lg" />
            Doctor Information Cards
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DoctorInfoCard
              title="Chuyên khoa"
              subtitle="Lĩnh vực chuyên môn"
              value="Tim mạch, Nội khoa"
              icon={MedicalIcons.specialization}
              additionalInfo="15+ năm kinh nghiệm"
              interactive
              onClick={() => handleCardClick('specialization')}
              className={selectedCard === 'specialization' ? 'ring-2 ring-primary' : ''}
            />

            <DoctorInfoCard
              title="Bằng cấp"
              subtitle="Trình độ học vấn"
              value="Tiến sĩ Y khoa"
              icon={MedicalIcons.qualification}
              additionalInfo="Đại học Y Hà Nội"
              variant="secondary"
              interactive
              onClick={() => handleCardClick('qualification')}
              className={selectedCard === 'qualification' ? 'ring-2 ring-secondary' : ''}
            />

            <DoctorInfoCard
              title="Kinh nghiệm"
              subtitle="Thời gian hành nghề"
              value="20 năm"
              icon={MedicalIcons.experience}
              additionalInfo="Từ năm 2004"
              variant="accent"
              interactive
              onClick={() => handleCardClick('experience')}
              className={selectedCard === 'experience' ? 'ring-2 ring-accent' : ''}
            />

            <InformationCard
              title="Ngôn ngữ"
              subtitle="Khả năng giao tiếp"
              value="Tiếng Việt, English"
              icon={MedicalIcons.language}
              variant="info"
              size="md"
              additionalInfo="Thành thạo cả hai ngôn ngữ"
            />

            <InformationCard
              title="Phí khám"
              subtitle="Chi phí tư vấn"
              value="500,000 VNĐ"
              icon={MedicalIcons.fee}
              variant="success"
              size="md"
              additionalInfo="Bao gồm tư vấn và kê đơn"
            />

            <InformationCard
              title="Trạng thái"
              subtitle="Tình trạng hoạt động"
              value="Đang hoạt động"
              icon={MedicalIcons.status}
              variant="success"
              size="md"
              additionalInfo="Sẵn sàng tiếp nhận bệnh nhân"
              badge={
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Online
                </div>
              }
            />
          </div>
        </motion.section>

        {/* Appointment Information Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
            <AppointmentIcon className="text-accent mr-3" size="lg" />
            Appointment Information Cards
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AppointmentInfoCard
              title="Ngày khám"
              value="25/07/2024"
              icon={MedicalIcons.appointment}
              additionalInfo="Thứ Năm"
              size="sm"
            />

            <AppointmentInfoCard
              title="Giờ khám"
              value="14:30 - 15:00"
              icon={<MedicalCrossIcon size="md" />}
              additionalInfo="30 phút"
              size="sm"
            />

            <AppointmentInfoCard
              title="Phòng khám"
              value="P.205"
              icon={<MedicalShieldIcon size="md" />}
              additionalInfo="Tầng 2, Tòa A"
              size="sm"
            />

            <AppointmentInfoCard
              title="Loại khám"
              value="Tái khám"
              icon={<HeartIcon size="md" />}
              additionalInfo="Theo dõi điều trị"
              size="sm"
            />
          </div>
        </motion.section>

        {/* Vital Signs Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
            <HeartIcon className="text-red-500 mr-3" size="lg" />
            Vital Signs Cards
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <VitalInfoCard
              title="Huyết áp"
              subtitle="Blood Pressure"
              value="120/80 mmHg"
              icon={<HeartIcon size="md" />}
              additionalInfo="Bình thường"
              priority="medium"
            />

            <VitalInfoCard
              title="Nhịp tim"
              subtitle="Heart Rate"
              value="72 bpm"
              icon={<HeartIcon size="md" />}
              additionalInfo="Ổn định"
              priority="medium"
            />

            <VitalInfoCard
              title="Nhiệt độ"
              subtitle="Temperature"
              value="36.5°C"
              icon={<MedicalCrossIcon size="md" />}
              additionalInfo="Bình thường"
              priority="low"
            />

            <VitalInfoCard
              title="SpO2"
              subtitle="Oxygen Saturation"
              value="98%"
              icon={<MedicalCrossIcon size="md" />}
              additionalInfo="Tốt"
              priority="low"
            />
          </div>
        </motion.section>

        {/* Emergency Information Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
            <MedicalCrossIcon className="text-red-600 mr-3" size="lg" />
            Emergency Information Cards
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EmergencyInfoCard
              title="Cấp cứu"
              subtitle="Emergency Contact"
              value="115"
              icon={<MedicalCrossIcon size="md" />}
              additionalInfo="Hotline 24/7"
              size="lg"
            />

            <InformationCard
              title="Dị ứng"
              subtitle="Allergies"
              value="Penicillin"
              icon={<MedicalShieldIcon size="md" />}
              variant="warning"
              additionalInfo="Nghiêm trọng"
              priority="high"
              size="lg"
            />

            <InformationCard
              title="Nhóm máu"
              subtitle="Blood Type"
              value="O+"
              icon={<HeartIcon size="md" />}
              variant="info"
              additionalInfo="Rh dương tính"
              size="lg"
            />
          </div>
        </motion.section>

        {/* Interactive Features Demo */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-8">
            Interactive Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-700">Loading States</h3>
              <InformationCard
                title="Đang tải dữ liệu"
                value="Loading..."
                icon={MedicalIcons.general}
                loading={true}
                variant="default"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-700">Priority Levels</h3>
              <InformationCard
                title="Ưu tiên cao"
                value="Cần xử lý ngay"
                icon={<MedicalCrossIcon size="md" />}
                variant="error"
                priority="critical"
                additionalInfo="Khẩn cấp"
              />
            </div>
          </div>
        </motion.section>

        {/* Usage Instructions */}
        <motion.section
          className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Usage Instructions</h2>
          <div className="prose prose-lg max-w-none text-slate-600">
            <p>
              These information cards are designed specifically for healthcare applications with:
            </p>
            <ul>
              <li><strong>Medical theming:</strong> Hospital-appropriate colors and iconography</li>
              <li><strong>Accessibility:</strong> ARIA labels, keyboard navigation, and screen reader support</li>
              <li><strong>Responsive design:</strong> Works seamlessly across all device sizes</li>
              <li><strong>Interactive states:</strong> Hover effects, loading states, and priority indicators</li>
              <li><strong>Customizable:</strong> Multiple variants, sizes, and medical contexts</li>
            </ul>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default InformationCardsDemo;
