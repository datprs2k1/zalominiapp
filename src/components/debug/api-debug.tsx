/**
 * API Debug Component
 * Shows API data quality and missing fields in development mode
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateDoctorData } from '@/utils/api-test';

interface APIDebugProps {
  data: any;
  type: 'doctor' | 'doctors' | 'general';
  className?: string;
}

export function APIDebug({ data, type, className = '' }: APIDebugProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [validation, setValidation] = useState<any>(null);

  // Only show in development mode
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isDev || !data) return;

    if (type === 'doctor') {
      const result = validateDoctorData(data);
      setValidation(result);
    } else if (type === 'doctors' && Array.isArray(data)) {
      const results = data.map(doctor => ({
        id: doctor.id,
        name: doctor.title?.rendered || 'Unknown',
        ...validateDoctorData(doctor),
      }));
      
      const summary = {
        total: results.length,
        valid: results.filter(r => r.isValid).length,
        invalid: results.filter(r => !r.isValid).length,
        commonIssues: getCommonIssues(results),
        results,
      };
      
      setValidation(summary);
    }
  }, [data, type, isDev]);

  if (!isDev || !validation) return null;

  const getCommonIssues = (results: any[]) => {
    const issueCount: Record<string, number> = {};
    results.forEach(result => {
      result.issues?.forEach((issue: string) => {
        issueCount[issue] = (issueCount[issue] || 0) + 1;
      });
    });
    
    return Object.entries(issueCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 max-h-96 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">API Debug Info</h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {type === 'doctor' && (
              <DoctorDebugInfo validation={validation} data={data} />
            )}

            {type === 'doctors' && (
              <DoctorsDebugInfo validation={validation} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DoctorDebugInfo({ validation, data }: { validation: any; data: any }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${validation.isValid ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm font-medium">
          {validation.isValid ? 'Valid Data' : 'Issues Found'}
        </span>
      </div>

      {validation.issues?.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-600 mb-2">Issues:</h4>
          <ul className="space-y-1">
            {validation.issues.map((issue: string, index: number) => (
              <li key={index} className="text-xs text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="text-xs font-medium text-gray-600 mb-2">Available Fields:</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <FieldStatus label="Title" value={!!data.title?.rendered} />
          <FieldStatus label="Content" value={!!data.content?.rendered} />
          <FieldStatus label="Image" value={!!data.featuredImageUrl} />
          <FieldStatus label="Position" value={!!data.bacsi_chucdanh} />
          <FieldStatus label="Department" value={!!data.bacsi_donvi} />
          <FieldStatus label="Experience" value={!!data.bacsi_kinhnghiem} />
          <FieldStatus label="Phone" value={!!data.bacsi_dienthoai} />
          <FieldStatus label="Email" value={!!data.bacsi_email} />
          <FieldStatus label="Specialization" value={!!data.bacsi_chuyenmon} />
          <FieldStatus label="Languages" value={!!data.bacsi_ngonngu} />
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200">
        <h4 className="text-xs font-medium text-gray-600 mb-1">Enhanced Data:</h4>
        <div className="text-xs text-gray-500 space-y-1">
          <div>Specializations: {data.specializations?.length || 0}</div>
          <div>Qualifications: {data.qualifications?.length || 0}</div>
          <div>Languages: {data.languages?.length || 0}</div>
          <div>Priority: {data.priority || 'N/A'}</div>
          <div>Available: {data.isAvailable ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  );
}

function DoctorsDebugInfo({ validation }: { validation: any }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-lg font-bold text-blue-600">{validation.total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-600">{validation.valid}</div>
          <div className="text-xs text-gray-500">Valid</div>
        </div>
        <div>
          <div className="text-lg font-bold text-red-600">{validation.invalid}</div>
          <div className="text-xs text-gray-500">Issues</div>
        </div>
      </div>

      {validation.commonIssues?.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-600 mb-2">Common Issues:</h4>
          <ul className="space-y-1">
            {validation.commonIssues.map(([issue, count]: [string, number], index: number) => (
              <li key={index} className="text-xs text-gray-600 flex justify-between">
                <span>{issue}</span>
                <span className="text-red-500">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-2 border-t border-gray-200">
        <h4 className="text-xs font-medium text-gray-600 mb-1">Data Quality:</h4>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(validation.valid / validation.total) * 100}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {Math.round((validation.valid / validation.total) * 100)}% complete data
        </div>
      </div>
    </div>
  );
}

function FieldStatus({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`} />
      <span className={value ? 'text-gray-700' : 'text-gray-400'}>{label}</span>
    </div>
  );
}

export default APIDebug;
