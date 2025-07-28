import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import SymptomInquiry from '@/components/form/symptom-inquiry';
import { useContext, useState } from 'react';
import { DetailPageContext } from './context';
import { motion } from 'framer-motion';
import QuestionSentSuccessfully from '../ask/success';
import { MedicalIcon } from '@/components/medical/MedicalServiceComponents';

function Tab3() {
  const { tab3 } = useContext(DetailPageContext);
  const [formData, setFormData] = useAtom(tab3.formData);
  const resetFormData = useResetAtom(tab3.formData);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    resetFormData();
  };

  if (isSubmitted) {
    return <QuestionSentSuccessfully />;
  }

  return (
    <div className="px-4 py-6 sm:px-8">
      {/* Consultation Header */}
      <motion.div
        className="bg-white p-4 sm:p-6 rounded-xl shadow-sm mb-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
            <MedicalIcon type="pill" size="sm" className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Tư vấn y tế</h2>
            <p className="text-sm text-gray-600">Hỏi đáp về triệu chứng và tình trạng sức khỏe</p>
          </div>
        </div>

        <div className="bg-primary-50 rounded-lg p-3 text-sm text-primary-dark flex items-start mb-4">
          <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>Mô tả chi tiết các triệu chứng của bạn. Bác sĩ sẽ liên hệ tư vấn trong vòng 24 giờ.</div>
        </div>

        <div className="flex flex-wrap -mx-2">
          <div className="w-1/3 px-2 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 h-full flex flex-col items-center text-center">
              <svg className="w-6 h-6 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs font-medium text-gray-600">Tư vấn nhanh trong 24 giờ</p>
            </div>
          </div>
          <div className="w-1/3 px-2 mb-4">
            <div className="bg-green-50 rounded-lg p-3 h-full flex flex-col items-center text-center">
              <svg className="w-6 h-6 text-secondary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <p className="text-xs font-medium text-gray-600">Bảo mật thông tin y tế</p>
            </div>
          </div>
          <div className="w-1/3 px-2 mb-4">
            <div className="bg-yellow-50 rounded-lg p-3 h-full flex flex-col items-center text-center">
              <svg className="w-6 h-6 text-yellow-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-xs font-medium text-gray-600">Hồ sơ bệnh án điện tử</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Symptom Inquiry Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6">
            <SymptomInquiry value={formData} onChange={setFormData} />

            <motion.button
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg px-4 py-3 mt-6 text-sm font-medium flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="w-4 h-4 rounded-full border-2 border-white border-t-transparent mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Đang gửi...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  Gửi câu hỏi
                </>
              )}
            </motion.button>
          </div>

          <div className="bg-gray-50 p-4 border-t border-gray-100 text-xs text-gray-500">
            Cam kết bảo mật thông tin và phản hồi từ bác sĩ chuyên khoa trong thời gian sớm nhất
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Tab3;
