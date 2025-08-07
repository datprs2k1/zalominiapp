import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';
import { TouchButton } from '@/components/mobile-enhancements';
import { MEDICAL_COLORS } from '@/styles/medical-design-system';
import { getColorToken } from '@/styles/unified-color-system';

interface ContactInfo {
  type: 'phone' | 'emergency' | 'address' | 'hours';
  icon: string;
  title: string;
  value: string;
  action?: () => void;
  urgent?: boolean;
}

interface MobileContactSectionProps {
  className?: string;
}

const contactData: ContactInfo[] = [
  {
    type: 'emergency',
    icon: '🚨',
    title: 'Cấp Cứu 24/7',
    value: '0868.115.666',
    action: () => window.location.href = 'tel:0868115666',
    urgent: true,
  },
  {
    type: 'phone',
    icon: '📞',
    title: 'Hotline Tổng Đài',
    value: '0976.091.115',
    action: () => window.location.href = 'tel:0976091115',
  },
  {
    type: 'address',
    icon: '📍',
    title: 'Địa Chỉ',
    value: 'Số 123, Đường ABC, Quận XYZ, Hải Phòng',
    action: () => {
      // Open maps application
      const address = encodeURIComponent('Bệnh viện Đa khoa Hòa Bình Hải Phòng');
      window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
    },
  },
  {
    type: 'hours',
    icon: '🕐',
    title: 'Giờ Làm Việc',
    value: 'Thứ 2-7: 7:00-17:00\nCấp cứu: 24/7',
  },
];

export const MobileContactSection: React.FC<MobileContactSectionProps> = ({ className = '' }) => {
  const { deviceInfo, platformStyles, getPlatformClasses } = useEnhancedMobile();
  const shouldReduceMotion = useReducedMotion();
  const [showMap, setShowMap] = useState(false);

  const platformClasses = getPlatformClasses('mobile-contact-section');
  const isIOS = deviceInfo.platform === 'ios';

  const cardStyles = {
    backgroundColor: MEDICAL_COLORS.white.pure,
    borderRadius: isIOS ? platformStyles.borderRadius.large : platformStyles.borderRadius.medium,
    border: `1px solid ${getColorToken('border')}`,
    boxShadow: isIOS 
      ? '0 4px 12px rgba(0, 0, 0, 0.08)' 
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const urgentCardStyles = {
    ...cardStyles,
    backgroundColor: getColorToken('error-light'),
    border: `2px solid ${getColorToken('error')}`,
  };

  return (
    <section 
      className={`${platformClasses} ${className} py-8 px-4`}
      style={{ backgroundColor: getColorToken('background') }}
      aria-labelledby="contact-title"
    >
      <div className="container mx-auto max-w-md">
        {/* Section Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
        >
          <h2
            id="contact-title"
            className="font-bold mb-2"
            style={{
              fontSize: isIOS ? '24px' : '28sp',
              lineHeight: isIOS ? '30px' : '36sp',
              color: getColorToken('primary'),
              fontFamily: platformStyles.typography.fontFamily.primary,
            }}
          >
            Liên Hệ & Địa Chỉ
          </h2>
          <p
            style={{
              fontSize: isIOS ? '16px' : '14sp',
              color: getColorToken('text-secondary'),
            }}
          >
            Thông tin liên hệ và vị trí bệnh viện
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="space-y-3 mb-6">
          {contactData.map((contact, index) => (
            <motion.div
              key={contact.type}
              style={contact.urgent ? urgentCardStyles : cardStyles}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ 
                duration: shouldReduceMotion ? 0.1 : 0.5, 
                delay: shouldReduceMotion ? 0 : index * 0.1 
              }}
              className="p-4"
            >
              <div className="flex items-start space-x-3">
                <div 
                  className="text-2xl mt-1"
                  role="img" 
                  aria-label={contact.title}
                >
                  {contact.icon}
                </div>
                <div className="flex-1">
                  <h3
                    className="font-semibold mb-1"
                    style={{
                      fontSize: isIOS ? '17px' : '16sp',
                      color: contact.urgent ? getColorToken('error') : getColorToken('text-primary'),
                    }}
                  >
                    {contact.title}
                  </h3>
                  <p
                    className="whitespace-pre-line"
                    style={{
                      fontSize: isIOS ? '15px' : '14sp',
                      color: contact.urgent ? getColorToken('error-dark') : getColorToken('text-secondary'),
                      lineHeight: '1.4',
                    }}
                  >
                    {contact.value}
                  </p>
                  
                  {contact.action && (
                    <TouchButton
                      variant={contact.urgent ? 'emergency' : 'primary'}
                      size="sm"
                      className="mt-2"
                      onClick={contact.action}
                      hapticFeedback={true}
                    >
                      {contact.type === 'phone' || contact.type === 'emergency' ? 'Gọi Ngay' :
                       contact.type === 'address' ? 'Xem Bản Đồ' : 'Xem Chi Tiết'}
                    </TouchButton>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Map Section */}
        <motion.div
          style={cardStyles}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.4 }}
          className="overflow-hidden"
        >
          <div className="p-4">
            <h3
              className="font-semibold mb-3"
              style={{
                fontSize: isIOS ? '18px' : '16sp',
                color: getColorToken('text-primary'),
              }}
            >
              🗺️ Vị Trí Bệnh Viện
            </h3>
            
            {!showMap ? (
              <div 
                className="relative h-48 rounded-lg overflow-hidden cursor-pointer"
                style={{ backgroundColor: getColorToken('background-secondary') }}
                onClick={() => setShowMap(true)}
              >
                {/* Map Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p
                      style={{
                        fontSize: isIOS ? '16px' : '14sp',
                        color: getColorToken('text-secondary'),
                      }}
                    >
                      Nhấn để xem bản đồ
                    </p>
                  </div>
                </div>
                
                {/* Overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, 
                      ${getColorToken('primary')}20 0%, 
                      ${getColorToken('secondary')}20 100%)`,
                  }}
                />
              </div>
            ) : (
              <div className="h-48 rounded-lg overflow-hidden">
                {/* Embedded Map or Map Component */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3728.123456789!2d106.123456789!3d20.123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zQsOqbmggdmnhu4duIMSQYSBraG9hIEjDsmEgQsOsbmggLSBI4bqjaSBQaMOybmc!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vị trí Bệnh viện Đa khoa Hòa Bình - Hải Phòng"
                />
              </div>
            )}
          </div>
          
          {/* Map Actions */}
          <div 
            className="px-4 pb-4 pt-2 flex space-x-2"
            style={{ borderTop: `1px solid ${getColorToken('border')}` }}
          >
            <TouchButton
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => {
                const address = encodeURIComponent('Bệnh viện Đa khoa Hòa Bình Hải Phòng');
                window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
              }}
            >
              Mở Google Maps
            </TouchButton>
            <TouchButton
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => {
                const address = encodeURIComponent('Bệnh viện Đa khoa Hòa Bình Hải Phòng');
                if (deviceInfo.platform === 'ios') {
                  window.open(`maps://maps.google.com/maps?q=${address}`, '_blank');
                } else {
                  window.open(`geo:0,0?q=${address}`, '_blank');
                }
              }}
            >
              Chỉ Đường
            </TouchButton>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mt-6 grid grid-cols-2 gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.6 }}
        >
          <TouchButton
            variant="medical"
            size="md"
            className="w-full"
            onClick={() => {/* Navigate to appointment booking */}}
          >
            📅 Đặt Lịch Khám
          </TouchButton>
          <TouchButton
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => {/* Navigate to patient portal */}}
          >
            👤 Cổng Bệnh Nhân
          </TouchButton>
        </motion.div>
      </div>
    </section>
  );
};
