// Internationalization support for About page
// Provides structure for multi-language content management

export type SupportedLanguage = 'vi' | 'en';

export interface I18nContent {
  about: {
    banner: string;
    title: string;
    brandName: string;
    slogan: string;
    subtitle: string;
    paragraphs: string[];
    buttonText: string;
    imageAlt: string;
    features: Array<{
      title: string;
      description: string;
    }>;
  };
  stats: {
    title: string;
    subtitle: string;
    items: Array<{
      label: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    phoneText: string;
    contactText: string;
    emergencyText: string;
    features: string[];
  };
  sections: {
    general: string;
    subtitle: string;
  };
  accessibility: {
    skipToContent: string;
    loading: string;
    error: string;
    imageDescription: string;
    phoneAriaLabel: string;
    emergencyAriaLabel: string;
    statAriaLabel: string;
    featureAriaLabel: string;
  };
}

// Vietnamese content (default)
export const VI_CONTENT: I18nContent = {
  about: {
    banner: 'Về chúng tôi',
    title: 'BỆNH VIỆN ĐA KHOA',
    brandName: 'HÒA BÌNH - HẢI PHÒNG',
    slogan: 'Trị bệnh bằng khối óc – Chăm sóc bằng trái tim',
    subtitle: 'Đơn vị y tế hàng đầu tại Hải Phòng với hơn 15 năm kinh nghiệm',
    paragraphs: [
      'Bệnh viện Đa khoa Hòa Bình – Hải Phòng chính thức đi vào hoạt động từ ngày 23 tháng 5 năm 2008 theo Quyết định số 1805/QĐ-BYT và Giấy chứng nhận số 20/GCNĐĐKHN-Y của Bộ Y tế.',
      'Với đội ngũ y bác sĩ giàu kinh nghiệm và trang thiết bị y tế hiện đại, chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe chất lượng cao. Bệnh viện hợp tác với nhiều doanh nghiệp lớn như Sumidenso Việt Nam, Ford Việt Nam, và các ngân hàng tại Hải Phòng để cung cấp dịch vụ khám sức khỏe toàn diện.',
      'Chúng tôi không ngừng nâng cao chất lượng dịch vụ, đầu tư công nghệ y tế tiên tiến và đào tạo đội ngũ nhân viên chuyên nghiệp để đáp ứng nhu cầu chăm sóc sức khỏe ngày càng cao của cộng đồng.',
    ],
    buttonText: 'Khám phá dịch vụ',
    imageAlt: 'Bệnh viện Đa khoa Hòa Bình - Hải Phòng - Cơ sở vật chất hiện đại',
    features: [
      { title: 'Chăm sóc 24/7', description: 'Dịch vụ y tế không ngừng nghỉ' },
      { title: 'Đội ngũ chuyên gia', description: 'Bác sĩ giàu kinh nghiệm' },
      { title: 'Công nghệ hiện đại', description: 'Trang thiết bị y tế tiên tiến' },
      { title: 'Điều trị toàn diện', description: 'Đa dạng chuyên khoa' },
    ],
  },
  stats: {
    title: 'Thành Tựu Y Khoa',
    subtitle: 'Những con số ấn tượng phản ánh cam kết chất lượng dịch vụ y tế hàng đầu và niềm tin tuyệt đối từ cộng đồng',
    items: [
      { label: 'Năm hình thành & phát triển' },
      { label: 'Tiến sĩ, bác sĩ chuyên khoa' },
      { label: 'Đội ngũ cán bộ y tế' },
      { label: 'Bệnh nhân tin tưởng mỗi ngày' },
    ],
  },
  cta: {
    title: 'Cần Tư Vấn Y Tế Ngay?',
    description: 'Đội ngũ chuyên gia y tế của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7',
    phoneText: 'Hotline: 0976.091.115',
    contactText: 'Đặt lịch khám',
    emergencyText: 'Cấp cứu 24/7 - Luôn sẵn sàng phục vụ',
    features: [
      'Tư vấn miễn phí',
      'Đặt lịch nhanh chóng',
      'Hỗ trợ 24/7',
      'Chuyên gia giàu kinh nghiệm',
    ],
  },
  sections: {
    general: 'Dịch Vụ Y Tế Chuyên Nghiệp',
    subtitle: 'Khám phá các dịch vụ y tế chuyên nghiệp và toàn diện của chúng tôi',
  },
  accessibility: {
    skipToContent: 'Bỏ qua đến nội dung chính',
    loading: 'Đang tải...',
    error: 'Không thể tải nội dung',
    imageDescription: 'Hình ảnh bệnh viện thể hiện cơ sở vật chất hiện đại và đội ngũ y bác sĩ chuyên nghiệp',
    phoneAriaLabel: 'Gọi điện thoại đến bệnh viện',
    emergencyAriaLabel: 'Số cấp cứu 24/7',
    statAriaLabel: 'Thống kê y khoa',
    featureAriaLabel: 'Dịch vụ y tế',
  },
};

// English content (for future expansion)
export const EN_CONTENT: I18nContent = {
  about: {
    banner: 'About Us',
    title: 'GENERAL HOSPITAL',
    brandName: 'HOA BINH - HAI PHONG',
    slogan: 'Healing with Mind – Caring with Heart',
    subtitle: 'Leading healthcare provider in Hai Phong with over 15 years of experience',
    paragraphs: [
      'Hoa Binh General Hospital - Hai Phong officially began operations on May 23, 2008, under Decision No. 1805/QD-BYT and Certificate No. 20/GCNDDKHN-Y from the Ministry of Health.',
      'With an experienced team of doctors and modern medical equipment, we are committed to providing high-quality healthcare services. The hospital collaborates with major enterprises such as Sumidenso Vietnam, Ford Vietnam, and banks in Hai Phong to provide comprehensive health examination services.',
      'We continuously improve service quality, invest in advanced medical technology, and train professional staff to meet the growing healthcare needs of the community.',
    ],
    buttonText: 'Explore Services',
    imageAlt: 'Hoa Binh General Hospital - Hai Phong - Modern medical facilities',
    features: [
      { title: '24/7 Care', description: 'Non-stop medical services' },
      { title: 'Expert Team', description: 'Experienced doctors' },
      { title: 'Modern Technology', description: 'Advanced medical equipment' },
      { title: 'Comprehensive Treatment', description: 'Diverse specialties' },
    ],
  },
  stats: {
    title: 'Medical Achievements',
    subtitle: 'Impressive numbers reflecting our commitment to top-quality healthcare services and absolute trust from the community',
    items: [
      { label: 'Years of establishment & development' },
      { label: 'Doctors & specialists' },
      { label: 'Medical staff team' },
      { label: 'Patients trust us daily' },
    ],
  },
  cta: {
    title: 'Need Medical Consultation Now?',
    description: 'Our team of medical experts is ready to consult and support you 24/7',
    phoneText: 'Hotline: 0976.091.115',
    contactText: 'Book Appointment',
    emergencyText: '24/7 Emergency - Always ready to serve',
    features: [
      'Free consultation',
      'Quick appointment',
      '24/7 support',
      'Experienced specialists',
    ],
  },
  sections: {
    general: 'Professional Medical Services',
    subtitle: 'Discover our professional and comprehensive medical services',
  },
  accessibility: {
    skipToContent: 'Skip to main content',
    loading: 'Loading...',
    error: 'Unable to load content',
    imageDescription: 'Hospital image showing modern facilities and professional medical staff',
    phoneAriaLabel: 'Call hospital',
    emergencyAriaLabel: '24/7 emergency number',
    statAriaLabel: 'Medical statistics',
    featureAriaLabel: 'Medical service',
  },
};

// Content management utilities
export const getContent = (language: SupportedLanguage = 'vi'): I18nContent => {
  switch (language) {
    case 'en':
      return EN_CONTENT;
    case 'vi':
    default:
      return VI_CONTENT;
  }
};

export const getCurrentLanguage = (): SupportedLanguage => {
  // In a real application, this would check browser language, user preferences, etc.
  return 'vi';
};

export const formatPhoneNumber = (phone: string, language: SupportedLanguage = 'vi'): string => {
  // Format phone number based on language/locale
  if (language === 'en') {
    return phone.replace(/\./g, '-');
  }
  return phone; // Keep Vietnamese format
};

export const getLocalizedAriaLabel = (
  key: keyof I18nContent['accessibility'],
  language: SupportedLanguage = 'vi'
): string => {
  const content = getContent(language);
  return content.accessibility[key];
};
