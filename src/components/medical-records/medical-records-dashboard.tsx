import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  MEDICAL_COLORS, 
  TYPOGRAPHY, 
  ANIMATIONS, 
  ACCESSIBILITY,
  SPACING,
  combineClasses 
} from '@/styles/medical-design-system';

// Medical Records Types
interface MedicalRecord {
  id: string;
  type: 'appointment' | 'test_result' | 'prescription' | 'diagnosis' | 'vital_signs';
  title: string;
  date: Date;
  doctor: string;
  department: string;
  status: 'completed' | 'pending' | 'cancelled' | 'scheduled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  details?: any;
}

interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
}

interface TestResult {
  testName: string;
  result: string;
  normalRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  unit: string;
}

interface MedicalRecordsDashboardProps {
  records: MedicalRecord[];
  patientInfo: {
    name: string;
    id: string;
    age: number;
    gender: string;
    bloodType: string;
    allergies: string[];
  };
  vitalSigns?: VitalSigns;
  recentTests?: TestResult[];
}

// Medical Record Type Icons
const getRecordIcon = (type: MedicalRecord['type']) => {
  const iconProps = { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24" };
  
  switch (type) {
    case 'appointment':
      return (
        <svg {...iconProps}>
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      );
    case 'test_result':
      return (
        <svg {...iconProps}>
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      );
    case 'prescription':
      return (
        <svg {...iconProps}>
          <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>
        </svg>
      );
    case 'diagnosis':
      return (
        <svg {...iconProps}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
    case 'vital_signs':
      return (
        <svg {...iconProps}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"/>
        </svg>
      );
  }
};

// Status Badge Component
const StatusBadge: React.FC<{ status: MedicalRecord['status'] }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return {
          bg: `${MEDICAL_COLORS.secondary.green}15`,
          text: MEDICAL_COLORS.secondary.green,
          border: `${MEDICAL_COLORS.secondary.green}30`
        };
      case 'pending':
        return {
          bg: `${MEDICAL_COLORS.accent.cyan}15`,
          text: MEDICAL_COLORS.accent.cyan,
          border: `${MEDICAL_COLORS.accent.cyan}30`
        };
      case 'cancelled':
        return {
          bg: '#EF444415',
          text: '#EF4444',
          border: '#EF444430'
        };
      case 'scheduled':
        return {
          bg: `${MEDICAL_COLORS.primary.blue}15`,
          text: MEDICAL_COLORS.primary.blue,
          border: `${MEDICAL_COLORS.primary.blue}30`
        };
      default:
        return {
          bg: '#6B728015',
          text: '#6B7280',
          border: '#6B728030'
        };
    }
  };

  const colors = getStatusColor();
  const statusText = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium border"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border
      }}
    >
      {statusText}
    </span>
  );
};

// Priority Indicator Component
const PriorityIndicator: React.FC<{ priority: MedicalRecord['priority'] }> = ({ priority }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'critical':
        return '#EF4444';
      case 'high':
        return '#F59E0B';
      case 'medium':
        return MEDICAL_COLORS.accent.cyan;
      case 'low':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  return (
    <div
      className="w-3 h-3 rounded-full"
      style={{ backgroundColor: getPriorityColor() }}
      title={`Priority: ${priority}`}
    />
  );
};

// Medical Record Card Component
const MedicalRecordCard: React.FC<{ 
  record: MedicalRecord; 
  onClick?: (record: MedicalRecord) => void;
}> = ({ record, onClick }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border shadow-sm cursor-pointer transition-all duration-200"
      style={{
        borderColor: `${MEDICAL_COLORS.primary.blue}10`,
        boxShadow: `0 2px 8px ${MEDICAL_COLORS.primary.blue}05`
      }}
      whileHover={prefersReducedMotion ? {} : {
        y: -2,
        boxShadow: `0 4px 16px ${MEDICAL_COLORS.primary.blue}15`
      }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      onClick={() => onClick?.(record)}
      role="button"
      tabIndex={0}
      aria-label={`Medical record: ${record.title} from ${record.date.toLocaleDateString()}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: `${MEDICAL_COLORS.primary.blue}10`,
              color: MEDICAL_COLORS.primary.blue
            }}
          >
            {getRecordIcon(record.type)}
          </div>
          <div>
            <h3 className="font-semibold text-lg" style={{ color: MEDICAL_COLORS.primary.blue }}>
              {record.title}
            </h3>
            <p className="text-sm" style={{ color: `${MEDICAL_COLORS.primary.blue}70` }}>
              {record.department} • Dr. {record.doctor}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <PriorityIndicator priority={record.priority} />
          <StatusBadge status={record.status} />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm leading-relaxed" style={{ color: `${MEDICAL_COLORS.primary.blue}80` }}>
          {record.summary}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span style={{ color: `${MEDICAL_COLORS.primary.blue}60` }}>
          {record.date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        <span style={{ color: `${MEDICAL_COLORS.primary.blue}60` }}>
          {record.date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </motion.div>
  );
};

// Main Medical Records Dashboard Component
export const MedicalRecordsDashboard: React.FC<MedicalRecordsDashboardProps> = ({
  records,
  patientInfo,
  vitalSigns,
  recentTests
}) => {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const prefersReducedMotion = useReducedMotion();

  // Filter records based on type
  const filteredRecords = useMemo(() => {
    if (filterType === 'all') return records;
    return records.filter(record => record.type === filterType);
  }, [records, filterType]);

  // Sort records by date (most recent first)
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [filteredRecords]);

  const recordTypes = [
    { key: 'all', label: 'All Records', count: records.length },
    { key: 'appointment', label: 'Appointments', count: records.filter(r => r.type === 'appointment').length },
    { key: 'test_result', label: 'Test Results', count: records.filter(r => r.type === 'test_result').length },
    { key: 'prescription', label: 'Prescriptions', count: records.filter(r => r.type === 'prescription').length },
    { key: 'vital_signs', label: 'Vital Signs', count: records.filter(r => r.type === 'vital_signs').length },
  ];

  return (
    <motion.div
      className="min-h-screen p-4 space-y-6"
      style={{ backgroundColor: MEDICAL_COLORS.white.soft }}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={prefersReducedMotion ? {} : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Patient Information Header */}
      <motion.div
        className="bg-white rounded-2xl p-6 border shadow-sm"
        style={{
          borderColor: `${MEDICAL_COLORS.primary.blue}15`,
          boxShadow: `0 2px 12px ${MEDICAL_COLORS.primary.blue}08`
        }}
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold" style={{ color: MEDICAL_COLORS.primary.blue }}>
            Medical Records
          </h1>
          <div className="text-sm" style={{ color: `${MEDICAL_COLORS.primary.blue}70` }}>
            Patient ID: {patientInfo.id}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="font-semibold mb-2" style={{ color: MEDICAL_COLORS.primary.blue }}>
              Patient Information
            </h2>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {patientInfo.name}</p>
              <p><span className="font-medium">Age:</span> {patientInfo.age}</p>
              <p><span className="font-medium">Gender:</span> {patientInfo.gender}</p>
              <p><span className="font-medium">Blood Type:</span> 
                <span className="ml-1 font-semibold" style={{ color: MEDICAL_COLORS.secondary.green }}>
                  {patientInfo.bloodType}
                </span>
              </p>
            </div>
          </div>

          {patientInfo.allergies.length > 0 && (
            <div>
              <h2 className="font-semibold mb-2" style={{ color: '#EF4444' }}>
                Allergies
              </h2>
              <div className="space-y-1">
                {patientInfo.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium mr-2 mb-1"
                    style={{
                      backgroundColor: '#EF444415',
                      color: '#EF4444',
                      border: '1px solid #EF444430'
                    }}
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}

          {vitalSigns && (
            <div>
              <h2 className="font-semibold mb-2" style={{ color: MEDICAL_COLORS.secondary.green }}>
                Latest Vital Signs
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>BP: {vitalSigns.bloodPressure}</div>
                <div>HR: {vitalSigns.heartRate} bpm</div>
                <div>Temp: {vitalSigns.temperature}°C</div>
                <div>O2: {vitalSigns.oxygenSaturation}%</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        className="bg-white rounded-2xl p-4 border shadow-sm"
        style={{
          borderColor: `${MEDICAL_COLORS.primary.blue}10`,
          boxShadow: `0 2px 8px ${MEDICAL_COLORS.primary.blue}05`
        }}
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-wrap gap-2">
          {recordTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => setFilterType(type.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterType === type.key ? 'shadow-md' : ''
              }`}
              style={{
                backgroundColor: filterType === type.key 
                  ? MEDICAL_COLORS.primary.blue 
                  : `${MEDICAL_COLORS.primary.blue}08`,
                color: filterType === type.key 
                  ? 'white' 
                  : MEDICAL_COLORS.primary.blue,
                border: `1px solid ${filterType === type.key 
                  ? MEDICAL_COLORS.primary.blue 
                  : `${MEDICAL_COLORS.primary.blue}20`}`
              }}
            >
              {type.label} ({type.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Medical Records Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.3 }}
      >
        {sortedRecords.map((record, index) => (
          <motion.div
            key={record.id}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { 
              duration: 0.4, 
              delay: 0.4 + (index * 0.1),
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <MedicalRecordCard
              record={record}
              onClick={setSelectedRecord}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {sortedRecords.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.3 }}
        >
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${MEDICAL_COLORS.primary.blue}10` }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: MEDICAL_COLORS.primary.blue }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: MEDICAL_COLORS.primary.blue }}>
            No Records Found
          </h3>
          <p style={{ color: `${MEDICAL_COLORS.primary.blue}70` }}>
            No medical records match the selected filter.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MedicalRecordsDashboard;
