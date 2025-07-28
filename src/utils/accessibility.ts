// Medical Accessibility Utilities for Vietnamese Healthcare Context

export interface AccessibilityOptions {
  highContrast?: boolean;
  fontSize?: 'small' | 'medium' | 'large' | 'extra-large';
  reducedMotion?: boolean;
  screenReader?: boolean;
  language?: 'vi' | 'en';
}

// Vietnamese medical accessibility labels
export const medicalAriaLabels = {
  vi: {
    // Navigation
    mainNavigation: 'Điều hướng chính của ứng dụng y tế',
    backButton: 'Quay lại trang trước',
    homeButton: 'Về trang chủ',
    searchButton: 'Tìm kiếm dịch vụ y tế',
    menuButton: 'Mở menu điều hướng',
    closeButton: 'Đóng',
    
    // Medical contexts
    emergencySection: 'Khu vực cấp cứu - ưu tiên cao',
    appointmentSection: 'Đặt lịch khám bệnh',
    doctorSection: 'Thông tin bác sĩ và chuyên khoa',
    serviceSection: 'Dịch vụ y tế',
    patientInfo: 'Thông tin bệnh nhân',
    medicalRecord: 'Hồ sơ bệnh án',
    
    // Form elements
    requiredField: 'Trường bắt buộc',
    optionalField: 'Trường tùy chọn',
    errorMessage: 'Thông báo lỗi',
    successMessage: 'Thông báo thành công',
    warningMessage: 'Thông báo cảnh báo',
    infoMessage: 'Thông tin',
    
    // Medical priorities
    criticalPriority: 'Mức độ nghiêm trọng',
    highPriority: 'Ưu tiên cao',
    mediumPriority: 'Ưu tiên trung bình',
    lowPriority: 'Ưu tiên thấp',
    
    // Loading states
    loading: 'Đang tải dữ liệu y tế',
    loadingComplete: 'Tải dữ liệu hoàn tất',
    processing: 'Đang xử lý yêu cầu',
    
    // Medical status
    emergency: 'Cấp cứu',
    urgent: 'Khẩn cấp',
    routine: 'Thường quy',
    consultation: 'Tư vấn',
    
    // Actions
    book: 'Đặt lịch',
    cancel: 'Hủy bỏ',
    confirm: 'Xác nhận',
    edit: 'Chỉnh sửa',
    save: 'Lưu',
    delete: 'Xóa',
    view: 'Xem chi tiết',
    download: 'Tải xuống',
    print: 'In',
    share: 'Chia sẻ',
  },
  en: {
    // Navigation
    mainNavigation: 'Main medical app navigation',
    backButton: 'Go back to previous page',
    homeButton: 'Go to homepage',
    searchButton: 'Search medical services',
    menuButton: 'Open navigation menu',
    closeButton: 'Close',
    
    // Medical contexts
    emergencySection: 'Emergency section - high priority',
    appointmentSection: 'Medical appointment booking',
    doctorSection: 'Doctor and specialty information',
    serviceSection: 'Medical services',
    patientInfo: 'Patient information',
    medicalRecord: 'Medical record',
    
    // Form elements
    requiredField: 'Required field',
    optionalField: 'Optional field',
    errorMessage: 'Error message',
    successMessage: 'Success message',
    warningMessage: 'Warning message',
    infoMessage: 'Information',
    
    // Medical priorities
    criticalPriority: 'Critical priority',
    highPriority: 'High priority',
    mediumPriority: 'Medium priority',
    lowPriority: 'Low priority',
    
    // Loading states
    loading: 'Loading medical data',
    loadingComplete: 'Data loading complete',
    processing: 'Processing request',
    
    // Medical status
    emergency: 'Emergency',
    urgent: 'Urgent',
    routine: 'Routine',
    consultation: 'Consultation',
    
    // Actions
    book: 'Book appointment',
    cancel: 'Cancel',
    confirm: 'Confirm',
    edit: 'Edit',
    save: 'Save',
    delete: 'Delete',
    view: 'View details',
    download: 'Download',
    print: 'Print',
    share: 'Share',
  }
};

// Generate comprehensive ARIA label for medical contexts
export const generateMedicalAriaLabel = (
  context: string,
  options: {
    priority?: 'low' | 'medium' | 'high' | 'critical';
    status?: 'emergency' | 'urgent' | 'routine' | 'consultation';
    patientId?: string;
    required?: boolean;
    language?: 'vi' | 'en';
    customLabel?: string;
  } = {}
): string => {
  const { priority, status, patientId, required, language = 'vi', customLabel } = options;
  const labels = medicalAriaLabels[language];
  
  let ariaLabel = customLabel || context;
  
  if (status) {
    ariaLabel += `, ${labels[status]}`;
  }
  
  if (priority) {
    ariaLabel += `, ${labels[`${priority}Priority` as keyof typeof labels]}`;
  }
  
  if (patientId) {
    ariaLabel += `, ${language === 'vi' ? 'bệnh nhân' : 'patient'} ${patientId}`;
  }
  
  if (required) {
    ariaLabel += `, ${labels.requiredField}`;
  }
  
  return ariaLabel;
};

// High contrast mode utilities
export const applyHighContrastMode = (enable: boolean) => {
  const root = document.documentElement;
  
  if (enable) {
    root.classList.add('high-contrast');
    root.style.setProperty('--primary', '#000000');
    root.style.setProperty('--secondary', '#ffffff');
    root.style.setProperty('--background', '#ffffff');
    root.style.setProperty('--surface', '#ffffff');
    root.style.setProperty('--text-primary', '#000000');
    root.style.setProperty('--text-secondary', '#000000');
    root.style.setProperty('--border', '#000000');
    root.style.setProperty('--medical-emergency', '#000000');
  } else {
    root.classList.remove('high-contrast');
    // Reset to default CSS variables
    root.style.removeProperty('--primary');
    root.style.removeProperty('--secondary');
    root.style.removeProperty('--background');
    root.style.removeProperty('--surface');
    root.style.removeProperty('--text-primary');
    root.style.removeProperty('--text-secondary');
    root.style.removeProperty('--border');
    root.style.removeProperty('--medical-emergency');
  }
};

// Font size utilities for medical accessibility
export const applyFontSize = (size: 'small' | 'medium' | 'large' | 'extra-large') => {
  const root = document.documentElement;
  const sizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px',
    'extra-large': '20px'
  };
  
  root.style.setProperty('--base-font-size', sizeMap[size]);
  root.style.fontSize = sizeMap[size];
};

// Reduced motion utilities
export const applyReducedMotion = (enable: boolean) => {
  const root = document.documentElement;
  
  if (enable) {
    root.classList.add('reduce-motion');
    root.style.setProperty('--transition-fast', '0ms');
    root.style.setProperty('--transition-normal', '0ms');
    root.style.setProperty('--transition-slow', '0ms');
    root.style.setProperty('--transition-gentle', '0ms');
  } else {
    root.classList.remove('reduce-motion');
    root.style.removeProperty('--transition-fast');
    root.style.removeProperty('--transition-normal');
    root.style.removeProperty('--transition-slow');
    root.style.removeProperty('--transition-gentle');
  }
};

// Screen reader utilities
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management for medical workflows
export const manageFocus = {
  // Trap focus within a container (for modals, dialogs)
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => container.removeEventListener('keydown', handleTabKey);
  },
  
  // Return focus to previous element
  returnFocus: (element: HTMLElement) => {
    element.focus();
  },
  
  // Focus first error in form
  focusFirstError: (container: HTMLElement) => {
    const errorElement = container.querySelector('[aria-invalid="true"]') as HTMLElement;
    errorElement?.focus();
  }
};

// Keyboard navigation helpers
export const keyboardNavigation = {
  // Handle arrow key navigation in lists
  handleArrowKeys: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void
  ) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        onIndexChange(nextIndex);
        items[nextIndex]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        onIndexChange(prevIndex);
        items[prevIndex]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        onIndexChange(0);
        items[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        const lastIndex = items.length - 1;
        onIndexChange(lastIndex);
        items[lastIndex]?.focus();
        break;
    }
  }
};

// Medical context validation for accessibility
export const validateMedicalAccessibility = (element: HTMLElement): string[] => {
  const issues: string[] = [];
  
  // Check for ARIA labels
  if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    issues.push('Missing ARIA label');
  }
  
  // Check touch target size
  const rect = element.getBoundingClientRect();
  if (rect.width < 44 || rect.height < 44) {
    issues.push('Touch target too small (minimum 44px)');
  }
  
  // Check color contrast (basic check)
  const styles = getComputedStyle(element);
  const backgroundColor = styles.backgroundColor;
  const color = styles.color;
  
  if (backgroundColor === color) {
    issues.push('Insufficient color contrast');
  }
  
  return issues;
};
