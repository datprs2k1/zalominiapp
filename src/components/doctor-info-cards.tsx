import React from 'react';
import { motion } from 'framer-motion';
import { 
  InformationCard, 
  DoctorInfoCard, 
  MedicalIcons 
} from '@/components/information-card';
import { 
  StethoscopeIcon, 
  CertificateIcon,
  ExperienceIcon,
  LanguageIcon,
  MedicalFeeIcon,
  OnlineStatusIcon,
  MedicalShieldIcon
} from '@/components/medical-icons';

interface DoctorInfoCardsProps {
  doctor: {
    specializations?: string;
    qualifications?: string;
    experience?: string;
    languages?: string;
    consultationFee?: number;
    department?: string;
    position?: string;
    isOnline?: boolean;
  };
  className?: string;
}

export const DoctorInfoCards: React.FC<DoctorInfoCardsProps> = ({ 
  doctor, 
  className = '' 
}) => {
  const {
    specializations,
    qualifications,
    experience,
    languages,
    consultationFee,
    department,
    position,
    isOnline = true
  } = doctor;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  const cards = [
    {
      show: specializations,
      component: (
        <DoctorInfoCard
          title="Chuyên khoa"
          subtitle="Lĩnh vực chuyên môn"
          value={specializations || ''}
          icon={<StethoscopeIcon size="md" />}
          additionalInfo="Chuyên môn chính"
          showHoverEffect={true}
        />
      )
    },
    {
      show: qualifications,
      component: (
        <DoctorInfoCard
          title="Bằng cấp"
          subtitle="Trình độ học vấn"
          value={qualifications || ''}
          icon={<CertificateIcon size="md" />}
          variant="secondary"
          additionalInfo="Chứng chỉ hành nghề"
          showHoverEffect={true}
        />
      )
    },
    {
      show: experience,
      component: (
        <DoctorInfoCard
          title="Kinh nghiệm"
          subtitle="Thời gian hành nghề"
          value={experience || ''}
          icon={<ExperienceIcon size="md" />}
          variant="accent"
          additionalInfo="Năm kinh nghiệm"
          showHoverEffect={true}
        />
      )
    },
    {
      show: languages,
      component: (
        <InformationCard
          title="Ngôn ngữ"
          subtitle="Khả năng giao tiếp"
          value={languages || ''}
          icon={<LanguageIcon size="md" />}
          variant="info"
          additionalInfo="Ngôn ngữ hỗ trợ"
          showHoverEffect={true}
        />
      )
    },
    {
      show: consultationFee,
      component: (
        <InformationCard
          title="Phí khám"
          subtitle="Chi phí tư vấn"
          value={consultationFee ? `${consultationFee.toLocaleString('vi-VN')} VNĐ` : ''}
          icon={<MedicalFeeIcon size="md" />}
          variant="success"
          additionalInfo="Phí tư vấn cơ bản"
          showHoverEffect={true}
        />
      )
    },
    {
      show: department,
      component: (
        <InformationCard
          title="Khoa/Phòng"
          subtitle="Đơn vị công tác"
          value={department || ''}
          icon={<MedicalShieldIcon size="md" />}
          variant="default"
          additionalInfo="Nơi làm việc"
          showHoverEffect={true}
        />
      )
    },
    {
      show: position,
      component: (
        <InformationCard
          title="Chức danh"
          subtitle="Vị trí công tác"
          value={position || ''}
          icon={<CertificateIcon size="md" />}
          variant="primary"
          additionalInfo="Chức vụ hiện tại"
          showHoverEffect={true}
        />
      )
    },
    {
      show: true, // Always show status
      component: (
        <InformationCard
          title="Trạng thái"
          subtitle="Tình trạng hoạt động"
          value={isOnline ? "Đang hoạt động" : "Không hoạt động"}
          icon={<OnlineStatusIcon size="md" />}
          variant={isOnline ? "success" : "default"}
          additionalInfo={isOnline ? "Sẵn sàng tiếp nhận" : "Tạm thời nghỉ"}
          showHoverEffect={true}
          badge={
            isOnline ? (
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                Online
              </div>
            ) : (
              <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                Offline
              </div>
            )
          }
        />
      )
    }
  ];

  const visibleCards = cards.filter(card => card.show);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Thông tin bác sĩ
        </h2>
        <p className="text-slate-600">
          Chi tiết về chuyên môn và kinh nghiệm
        </p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
      >
        {visibleCards.map((card, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            className="medical-card-stagger"
          >
            {card.component}
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Information Note */}
      {visibleCards.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-slate-400 text-lg">
            Thông tin bác sĩ đang được cập nhật
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Compact version for smaller spaces
export const DoctorInfoCardsCompact: React.FC<DoctorInfoCardsProps> = ({ 
  doctor, 
  className = '' 
}) => {
  const {
    specializations,
    consultationFee,
    isOnline = true
  } = doctor;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {specializations && (
        <InformationCard
          title="Chuyên khoa"
          value={specializations}
          icon={<StethoscopeIcon size="sm" />}
          size="sm"
          variant="primary"
        />
      )}
      
      {consultationFee && (
        <InformationCard
          title="Phí khám"
          value={`${consultationFee.toLocaleString('vi-VN')} VNĐ`}
          icon={<MedicalFeeIcon size="sm" />}
          size="sm"
          variant="success"
        />
      )}
      
      <InformationCard
        title="Trạng thái"
        value={isOnline ? "Online" : "Offline"}
        icon={<OnlineStatusIcon size="sm" />}
        size="sm"
        variant={isOnline ? "success" : "default"}
        badge={
          isOnline ? (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          ) : undefined
        }
      />
    </div>
  );
};

export default DoctorInfoCards;
