import { askFormState } from '@/state';
import { useAtom } from 'jotai';
import FabForm from '@/components/form/fab-form';
import { useResetAtom } from 'jotai/utils';
import SymptomInquiry from '@/components/form/symptom-inquiry';
import { useState } from 'react';
import { promptJSON, wait } from '@/utils/miscellaneous';
import QuestionSentSuccessfully from './success';
import DepartmentPicker from '@/components/form/department-picker';
import toast from 'react-hot-toast';
import { motion, useReducedMotion } from 'framer-motion';

export default function AskPage() {
  const [formData, setFormData] = useAtom(askFormState);
  const resetFormData = useResetAtom(askFormState);
  const prefersReducedMotion = useReducedMotion();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isSubmitted) {
    return <QuestionSentSuccessfully />;
  }

  return (
    <motion.div
      className="flex-1 bg-gradient-to-br from-blue-50/30 via-white to-green-50/30 min-h-screen"
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Medical Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Tư vấn y tế trực tuyến</h1>
            <p className="text-blue-100 text-sm">Đặt câu hỏi với đội ngũ chuyên gia</p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Phản hồi trong 24h</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <span>Bảo mật tuyệt đối</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Miễn phí tư vấn</span>
          </div>
        </div>
      </motion.div>

      <FabForm
        onSubmit={async () => {
          setIsSubmitting(true);
          await wait(1500);
          setIsSubmitting(false);
          setIsSubmitted(true);
          promptJSON(formData);
          resetFormData();
        }}
        fab={{
          children: isSubmitting ? 'Đang gửi...' : 'Gửi câu hỏi',
          disabled: isSubmitting || !formData.description.trim().length || !formData.department,
          onDisabledClick() {
            toast.error('Vui lòng điền đầy đủ thông tin!');
          },
        }}
      >
        <motion.div
          className="px-4 py-6 space-y-6"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Department Selection */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Chọn khoa tư vấn</h3>
                <p className="text-sm text-gray-500">Chọn khoa phù hợp với vấn đề của bạn</p>
              </div>
            </div>
            <DepartmentPicker
              label=""
              placeholder="Chọn khoa cần tư vấn"
              value={formData.department}
              onChange={(department) => setFormData((prev) => ({ ...prev, department }))}
            />
          </motion.div>

          {/* Symptom Inquiry */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mô tả triệu chứng</h3>
                  <p className="text-sm text-gray-500">Mô tả chi tiết tình trạng sức khỏe của bạn</p>
                </div>
              </div>
            </div>
            <SymptomInquiry
              value={formData}
              onChange={setFormData}
              render={({ symptom, description }) => <div className="p-6">{description}</div>}
            />
          </motion.div>

          {/* Privacy Notice */}
          <motion.div
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200"
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-green-900 mb-1">Cam kết bảo mật</h4>
                <p className="text-sm text-green-700">
                  Thông tin của bạn được bảo mật tuyệt đối. Chỉ đội ngũ bác sĩ chuyên khoa mới có thể xem và tư vấn.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-gray-700 font-medium">Đang gửi câu hỏi...</p>
              <p className="text-sm text-gray-500 mt-1">Vui lòng đợi trong giây lát</p>
            </div>
          </div>
        )}
      </FabForm>
    </motion.div>
  );
}
