import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { MedicalCard } from './medical-card';
import { MedicalIcons } from './icons/medical-icons';
import { 
  applyHighContrastMode, 
  applyFontSize, 
  applyReducedMotion,
  AccessibilityOptions 
} from '@/utils/accessibility';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const AccessibilitySettings = ({ 
  isOpen, 
  onClose, 
  className = '' 
}: AccessibilitySettingsProps) => {
  const [settings, setSettings] = useState<AccessibilityOptions>({
    highContrast: false,
    fontSize: 'medium',
    reducedMotion: false,
    screenReader: false,
    language: 'vi'
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('medical-accessibility-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  // Apply settings to the application
  const applySettings = (newSettings: AccessibilityOptions) => {
    if (newSettings.highContrast !== undefined) {
      applyHighContrastMode(newSettings.highContrast);
    }
    
    if (newSettings.fontSize) {
      applyFontSize(newSettings.fontSize);
    }
    
    if (newSettings.reducedMotion !== undefined) {
      applyReducedMotion(newSettings.reducedMotion);
    }
  };

  // Update a specific setting
  const updateSetting = <K extends keyof AccessibilityOptions>(
    key: K, 
    value: AccessibilityOptions[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('medical-accessibility-settings', JSON.stringify(newSettings));
  };

  // Reset all settings to default
  const resetSettings = () => {
    const defaultSettings: AccessibilityOptions = {
      highContrast: false,
      fontSize: 'medium',
      reducedMotion: false,
      screenReader: false,
      language: 'vi'
    };
    
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.removeItem('medical-accessibility-settings');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Settings Panel */}
          <motion.div
            className={`fixed right-0 top-0 h-full w-full max-w-md bg-surface shadow-xl z-50 overflow-y-auto ${className}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="p-lg">
              {/* Header */}
              <div className="flex items-center justify-between mb-lg">
                <h2 className="text-xl font-semibold text-text-primary">
                  Cài đặt trợ năng
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  aria-label="Đóng cài đặt trợ năng"
                  className="p-2"
                >
                  <MedicalIcons.X size="md" />
                </Button>
              </div>

              {/* Settings Content */}
              <div className="space-y-lg">
                {/* High Contrast Mode */}
                <MedicalCard variant="outlined" size="sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-sm">
                      <MedicalIcons.Eye size="md" className="text-primary" />
                      <div>
                        <h3 className="font-medium text-text-primary">
                          Chế độ tương phản cao
                        </h3>
                        <p className="text-sm text-text-muted">
                          Tăng độ tương phản để dễ đọc hơn
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.highContrast}
                        onChange={(e) => updateSetting('highContrast', e.target.checked)}
                        className="sr-only peer"
                        aria-label="Bật/tắt chế độ tương phản cao"
                      />
                      <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </MedicalCard>

                {/* Font Size */}
                <MedicalCard variant="outlined" size="sm">
                  <div>
                    <div className="flex items-center space-x-sm mb-sm">
                      <MedicalIcons.Info size="md" className="text-primary" />
                      <div>
                        <h3 className="font-medium text-text-primary">
                          Kích thước chữ
                        </h3>
                        <p className="text-sm text-text-muted">
                          Điều chỉnh kích thước chữ cho dễ đọc
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-sm">
                      {[
                        { value: 'small', label: 'Nhỏ' },
                        { value: 'medium', label: 'Vừa' },
                        { value: 'large', label: 'Lớn' },
                        { value: 'extra-large', label: 'Rất lớn' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateSetting('fontSize', option.value as any)}
                          className={`p-sm rounded-lg border-2 transition-all duration-200 ${
                            settings.fontSize === option.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                          aria-label={`Chọn kích thước chữ ${option.label}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </MedicalCard>

                {/* Reduced Motion */}
                <MedicalCard variant="outlined" size="sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-sm">
                      <MedicalIcons.Heart size="md" className="text-primary" />
                      <div>
                        <h3 className="font-medium text-text-primary">
                          Giảm hiệu ứng chuyển động
                        </h3>
                        <p className="text-sm text-text-muted">
                          Tắt hoạt ảnh để giảm khó chịu
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.reducedMotion}
                        onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                        className="sr-only peer"
                        aria-label="Bật/tắt giảm hiệu ứng chuyển động"
                      />
                      <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </MedicalCard>

                {/* Language Selection */}
                <MedicalCard variant="outlined" size="sm">
                  <div>
                    <div className="flex items-center space-x-sm mb-sm">
                      <MedicalIcons.Info size="md" className="text-primary" />
                      <div>
                        <h3 className="font-medium text-text-primary">
                          Ngôn ngữ
                        </h3>
                        <p className="text-sm text-text-muted">
                          Chọn ngôn ngữ hiển thị
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-sm">
                      {[
                        { value: 'vi', label: 'Tiếng Việt' },
                        { value: 'en', label: 'English' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateSetting('language', option.value as any)}
                          className={`p-sm rounded-lg border-2 transition-all duration-200 ${
                            settings.language === option.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                          aria-label={`Chọn ngôn ngữ ${option.label}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </MedicalCard>

                {/* Screen Reader Info */}
                <MedicalCard variant="info" size="sm">
                  <div className="flex items-start space-x-sm">
                    <MedicalIcons.Info size="md" className="text-info mt-1" />
                    <div>
                      <h3 className="font-medium text-text-primary mb-xs">
                        Hỗ trợ đọc màn hình
                      </h3>
                      <p className="text-sm text-text-muted">
                        Ứng dụng này hỗ trợ đầy đủ các công cụ đọc màn hình như NVDA, JAWS, và VoiceOver.
                        Tất cả nội dung đều có nhãn ARIA phù hợp.
                      </p>
                    </div>
                  </div>
                </MedicalCard>

                {/* Reset Button */}
                <div className="pt-md border-t border-border">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={resetSettings}
                    className="w-full"
                    aria-label="Đặt lại tất cả cài đặt trợ năng về mặc định"
                  >
                    <MedicalIcons.X size="sm" className="mr-2" />
                    Đặt lại cài đặt
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AccessibilitySettings;
