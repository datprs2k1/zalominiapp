import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getColorToken } from '@/styles/unified-color-system';

export interface UserPreferences {
  // Display preferences
  theme: 'light' | 'dark' | 'auto';
  language: 'vi' | 'en';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  
  // Medical preferences
  preferredSpecialties: string[];
  preferredDoctors: string[];
  preferredHospitals: string[];
  emergencyContacts: EmergencyContact[];
  
  // Notification preferences
  appointmentReminders: boolean;
  medicationReminders: boolean;
  testResultNotifications: boolean;
  promotionalNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  
  // Privacy preferences
  shareDataForResearch: boolean;
  allowLocationTracking: boolean;
  showProfileToOthers: boolean;
  
  // Booking preferences
  preferredTimeSlots: string[];
  preferredConsultationType: 'in-person' | 'online' | 'both';
  autoBookingEnabled: boolean;
  
  // Accessibility preferences
  highContrast: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigationOnly: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

interface UserPreferencesProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
  onSave: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

const UserPreferences: React.FC<UserPreferencesProps> = ({
  preferences,
  onPreferencesChange,
  onSave,
  onReset,
  isLoading = false
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState('display');
  const [hasChanges, setHasChanges] = useState(false);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    onPreferencesChange({
      ...preferences,
      [key]: value
    });
    setHasChanges(true);
  };

  const tabs = [
    { id: 'display', label: 'Hiển thị', icon: '🎨' },
    { id: 'medical', label: 'Y tế', icon: '🏥' },
    { id: 'notifications', label: 'Thông báo', icon: '🔔' },
    { id: 'privacy', label: 'Riêng tư', icon: '🔒' },
    { id: 'booking', label: 'Đặt lịch', icon: '📅' },
    { id: 'accessibility', label: 'Trợ năng', icon: '♿' }
  ];

  const specialtyOptions = [
    { value: 'cardiology', label: 'Tim mạch' },
    { value: 'neurology', label: 'Thần kinh' },
    { value: 'orthopedics', label: 'Chỉnh hình' },
    { value: 'pediatrics', label: 'Nhi khoa' },
    { value: 'dermatology', label: 'Da liễu' },
    { value: 'ophthalmology', label: 'Mắt' },
    { value: 'ent', label: 'Tai mũi họng' },
    { value: 'gynecology', label: 'Phụ khoa' }
  ];

  const timeSlotOptions = [
    { value: 'morning', label: 'Buổi sáng (7:00 - 12:00)' },
    { value: 'afternoon', label: 'Buổi chiều (12:00 - 17:00)' },
    { value: 'evening', label: 'Buổi tối (17:00 - 21:00)' }
  ];

  const renderDisplayTab = () => (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Giao diện</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light', label: 'Sáng', icon: '☀️' },
            { value: 'dark', label: 'Tối', icon: '🌙' },
            { value: 'auto', label: 'Tự động', icon: '🔄' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => updatePreference('theme', option.value as any)}
              className={`p-3 rounded-xl border-2 transition-all ${
                preferences.theme === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-sm font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Language Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Ngôn ngữ</label>
        <select
          value={preferences.language}
          onChange={(e) => updatePreference('language', e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Kích thước chữ</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'small', label: 'Nhỏ' },
            { value: 'medium', label: 'Vừa' },
            { value: 'large', label: 'Lớn' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => updatePreference('fontSize', option.value as any)}
              className={`p-3 rounded-xl border-2 transition-all ${
                preferences.fontSize === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`font-medium ${
                option.value === 'small' ? 'text-sm' :
                option.value === 'large' ? 'text-lg' : 'text-base'
              }`}>
                {option.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Reduced Motion */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-700">Giảm hiệu ứng chuyển động</div>
          <div className="text-xs text-gray-500">Giảm thiểu các hiệu ứng animation</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.reducedMotion}
            onChange={(e) => updatePreference('reducedMotion', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  const renderMedicalTab = () => (
    <div className="space-y-6">
      {/* Preferred Specialties */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Chuyên khoa ưa thích</label>
        <div className="grid grid-cols-2 gap-2">
          {specialtyOptions.map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.preferredSpecialties.includes(option.value)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...preferences.preferredSpecialties, option.value]
                    : preferences.preferredSpecialties.filter(s => s !== option.value);
                  updatePreference('preferredSpecialties', updated);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Liên hệ khẩn cấp</label>
        <div className="space-y-3">
          {preferences.emergencyContacts.map((contact, index) => (
            <div key={contact.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-sm">{contact.name}</div>
                <div className="text-xs text-gray-500">{contact.relationship} - {contact.phone}</div>
              </div>
              {contact.isPrimary && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Chính</span>
              )}
            </div>
          ))}
          <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 transition-colors">
            + Thêm liên hệ khẩn cấp
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {[
        { key: 'appointmentReminders', label: 'Nhắc nhở lịch khám', desc: 'Nhận thông báo trước khi có lịch khám' },
        { key: 'medicationReminders', label: 'Nhắc nhở uống thuốc', desc: 'Nhận thông báo khi đến giờ uống thuốc' },
        { key: 'testResultNotifications', label: 'Kết quả xét nghiệm', desc: 'Nhận thông báo khi có kết quả xét nghiệm mới' },
        { key: 'promotionalNotifications', label: 'Thông báo khuyến mãi', desc: 'Nhận thông báo về các chương trình ưu đãi' },
        { key: 'emailNotifications', label: 'Thông báo email', desc: 'Nhận thông báo qua email' },
        { key: 'smsNotifications', label: 'Thông báo SMS', desc: 'Nhận thông báo qua tin nhắn SMS' }
      ].map(item => (
        <div key={item.key} className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700">{item.label}</div>
            <div className="text-xs text-gray-500">{item.desc}</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences[item.key as keyof UserPreferences] as boolean}
              onChange={(e) => updatePreference(item.key as keyof UserPreferences, e.target.checked as any)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      {[
        { key: 'shareDataForResearch', label: 'Chia sẻ dữ liệu cho nghiên cứu', desc: 'Cho phép sử dụng dữ liệu ẩn danh cho nghiên cứu y khoa' },
        { key: 'allowLocationTracking', label: 'Cho phép theo dõi vị trí', desc: 'Sử dụng vị trí để tìm bệnh viện gần nhất' },
        { key: 'showProfileToOthers', label: 'Hiển thị hồ sơ cho người khác', desc: 'Cho phép bác sĩ và nhân viên y tế xem hồ sơ của bạn' }
      ].map(item => (
        <div key={item.key} className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700">{item.label}</div>
            <div className="text-xs text-gray-500">{item.desc}</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences[item.key as keyof UserPreferences] as boolean}
              onChange={(e) => updatePreference(item.key as keyof UserPreferences, e.target.checked as any)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderBookingTab = () => (
    <div className="space-y-6">
      {/* Preferred Time Slots */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Khung giờ ưa thích</label>
        <div className="space-y-2">
          {timeSlotOptions.map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.preferredTimeSlots.includes(option.value)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...preferences.preferredTimeSlots, option.value]
                    : preferences.preferredTimeSlots.filter(s => s !== option.value);
                  updatePreference('preferredTimeSlots', updated);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Consultation Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Hình thức khám ưa thích</label>
        <select
          value={preferences.preferredConsultationType}
          onChange={(e) => updatePreference('preferredConsultationType', e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="in-person">Khám trực tiếp</option>
          <option value="online">Tư vấn online</option>
          <option value="both">Cả hai</option>
        </select>
      </div>

      {/* Auto Booking */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-700">Tự động đặt lịch</div>
          <div className="text-xs text-gray-500">Tự động đặt lịch khi có slot phù hợp</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.autoBookingEnabled}
            onChange={(e) => updatePreference('autoBookingEnabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  const renderAccessibilityTab = () => (
    <div className="space-y-6">
      {[
        { key: 'highContrast', label: 'Độ tương phản cao', desc: 'Tăng độ tương phản để dễ nhìn hơn' },
        { key: 'screenReaderOptimized', label: 'Tối ưu cho trình đọc màn hình', desc: 'Cải thiện trải nghiệm với trình đọc màn hình' },
        { key: 'keyboardNavigationOnly', label: 'Chỉ điều hướng bằng bàn phím', desc: 'Tối ưu cho người dùng chỉ sử dụng bàn phím' }
      ].map(item => (
        <div key={item.key} className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700">{item.label}</div>
            <div className="text-xs text-gray-500">{item.desc}</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences[item.key as keyof UserPreferences] as boolean}
              onChange={(e) => updatePreference(item.key as keyof UserPreferences, e.target.checked as any)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'display': return renderDisplayTab();
      case 'medical': return renderMedicalTab();
      case 'notifications': return renderNotificationsTab();
      case 'privacy': return renderPrivacyTab();
      case 'booking': return renderBookingTab();
      case 'accessibility': return renderAccessibilityTab();
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Cài đặt tài khoản</h2>
        <p className="text-sm text-gray-600 mt-1">Tùy chỉnh trải nghiệm sử dụng ứng dụng</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <button
          onClick={onReset}
          className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          disabled={isLoading}
        >
          Đặt lại mặc định
        </button>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-xs text-orange-600">Có thay đổi chưa lưu</span>
          )}
          <button
            onClick={onSave}
            disabled={isLoading || !hasChanges}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;
