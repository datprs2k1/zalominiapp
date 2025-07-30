import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Page, Header } from 'zmp-ui';
import EnhancedSelect, { SelectOption } from '@/components/form/enhanced-select';
import EnhancedDatePicker from '@/components/form/enhanced-date-picker';
import DepartmentPicker from '@/components/form/department-picker';
import ServicePicker from '@/components/form/service-picker';
import { MEDICAL_COLORS, SPACING } from '@/styles/medical-design-system';
import { Department, Service, AvailableTimeSlots } from '@/types';

// Mock data for demo
const mockSelectOptions: SelectOption[] = [
  {
    id: 1,
    label: 'Khoa Tim mạch',
    description: 'Chuyên khoa về tim mạch và huyết áp',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 2,
    label: 'Khoa Nhi',
    description: 'Chuyên khoa về trẻ em và sơ sinh',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 3,
    label: 'Khoa Thần kinh',
    description: 'Chuyên khoa về hệ thần kinh',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: 4,
    label: 'Khoa Da liễu',
    description: 'Chuyên khoa về da và các bệnh ngoài da',
    disabled: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

const mockTimeSlots: AvailableTimeSlots[] = [
  { date: new Date() },
  { date: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
  { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
  { date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) },
  { date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
  { date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) },
];

export default function EnhancedFormsDemo() {
  const [selectedOption, setSelectedOption] = useState<SelectOption | undefined>();
  const [selectedDate, setSelectedDate] = useState<{ date?: Date } | undefined>();
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>();
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [showErrors, setShowErrors] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <Page className="bg-gray-50">
      <Header title="Enhanced Forms Demo" showBackIcon />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2" style={{ color: MEDICAL_COLORS.primary.blue }}>
            Enhanced Form Components
          </h1>
          <p className="text-gray-600">
            Redesigned selectbox and date picker with modern medical UI/UX
          </p>
        </motion.div>

        {/* Enhanced Select Demo */}
        <motion.section
          className="bg-white rounded-2xl p-6 shadow-lg"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: MEDICAL_COLORS.primary.blue }}>
            Enhanced Select Component
          </h2>
          <div className="space-y-4">
            <EnhancedSelect
              label="Chọn khoa khám"
              options={mockSelectOptions}
              value={selectedOption}
              onChange={setSelectedOption}
              placeholder="Vui lòng chọn khoa khám"
              searchable={true}
              clearable={true}
              error={showErrors && !selectedOption ? 'Vui lòng chọn khoa khám' : undefined}
            />
            
            <div className="text-sm text-gray-600">
              <strong>Features:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Searchable dropdown with real-time filtering</li>
                <li>Keyboard navigation support (Arrow keys, Enter, Escape)</li>
                <li>Icons and descriptions for options</li>
                <li>Clear button and loading states</li>
                <li>Error handling and validation</li>
                <li>WCAG 2.1 AA accessibility compliance</li>
                <li>Smooth animations with reduced motion support</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Enhanced Date Picker Demo */}
        <motion.section
          className="bg-white rounded-2xl p-6 shadow-lg"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: MEDICAL_COLORS.accent.cyan }}>
            Enhanced Date Picker Component
          </h2>
          <div className="space-y-4">
            <EnhancedDatePicker
              label="Chọn ngày khám"
              value={selectedDate}
              onChange={setSelectedDate}
              slots={mockTimeSlots}
              placeholder="Vui lòng chọn ngày khám"
              error={showErrors && !selectedDate ? 'Vui lòng chọn ngày khám' : undefined}
            />
            
            <div className="text-sm text-gray-600">
              <strong>Features:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Compact and expanded view modes</li>
                <li>Smart date labeling (Today, Tomorrow, etc.)</li>
                <li>Keyboard navigation support</li>
                <li>Visual date selection with calendar icons</li>
                <li>Error handling and validation</li>
                <li>Responsive design for mobile and desktop</li>
                <li>Medical-themed color scheme</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Department & Service Pickers Demo */}
        <motion.section
          className="bg-white rounded-2xl p-6 shadow-lg"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: MEDICAL_COLORS.secondary.green }}>
            Updated Department & Service Pickers
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <DepartmentPicker
                label="Khoa khám"
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                placeholder="Chọn khoa khám"
                error={showErrors && !selectedDepartment ? 'Vui lòng chọn khoa' : undefined}
              />
            </div>
            <div>
              <ServicePicker
                label="Dịch vụ"
                value={selectedService}
                onChange={setSelectedService}
                placeholder="Chọn dịch vụ"
                error={showErrors && !selectedService ? 'Vui lòng chọn dịch vụ' : undefined}
              />
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <strong>Improvements:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Now using the enhanced select component</li>
              <li>Built-in search functionality</li>
              <li>Better visual feedback and error handling</li>
              <li>Consistent medical iconography</li>
              <li>Improved accessibility</li>
            </ul>
          </div>
        </motion.section>

        {/* Controls */}
        <motion.section
          className="bg-white rounded-2xl p-6 shadow-lg"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: MEDICAL_COLORS.primary.blue }}>
            Demo Controls
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowErrors(!showErrors)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showErrors 
                  ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                  : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
              }`}
            >
              {showErrors ? 'Hide Errors' : 'Show Errors'}
            </button>
            
            <button
              onClick={() => {
                setSelectedOption(undefined);
                setSelectedDate(undefined);
                setSelectedDepartment(undefined);
                setSelectedService(undefined);
              }}
              className="px-4 py-2 rounded-lg font-medium bg-blue-100 text-blue-700 border-2 border-blue-300 transition-all hover:bg-blue-200"
            >
              Clear All
            </button>
          </div>
        </motion.section>

        {/* Current Values Display */}
        <motion.section
          className="bg-gray-100 rounded-2xl p-6"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: MEDICAL_COLORS.primary.blue }}>
            Current Values
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Enhanced Select:</strong>
              <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-auto">
                {JSON.stringify(selectedOption, null, 2)}
              </pre>
            </div>
            <div>
              <strong>Enhanced Date Picker:</strong>
              <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-auto">
                {JSON.stringify(selectedDate, null, 2)}
              </pre>
            </div>
            <div>
              <strong>Department Picker:</strong>
              <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-auto">
                {JSON.stringify(selectedDepartment, null, 2)}
              </pre>
            </div>
            <div>
              <strong>Service Picker:</strong>
              <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-auto">
                {JSON.stringify(selectedService, null, 2)}
              </pre>
            </div>
          </div>
        </motion.section>
      </div>
    </Page>
  );
}
