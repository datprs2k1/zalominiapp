import { feedbackCategoriesState, feedbackFormState } from '@/state';
import { useAtom, useAtomValue } from 'jotai';
import FabForm from '@/components/form/fab-form';
import { useResetAtom } from 'jotai/utils';
import { useState } from 'react';
import { promptJSON, wait } from '@/utils/miscellaneous';
import QuestionSentSuccessfully from '../ask/success';
import FormItem from '@/components/form/item';
import { Input, Radio } from 'zmp-ui';
import TextareaWithImageUpload from '@/components/form/textarea-with-image-upload';
import toast from 'react-hot-toast';
import { motion, useReducedMotion } from 'framer-motion';
import { getColorToken } from '@/styles/unified-color-system';

export default function FeedbackPage() {
  const [formData, setFormData] = useAtom(feedbackFormState);
  const resetFormData = useResetAtom(feedbackFormState);
  const feedbackCategories = useAtomValue(feedbackCategoriesState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prefersReducedMotion = useReducedMotion();

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
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Phản hồi dịch vụ</h1>
            <p className="text-blue-100 text-sm">Chia sẻ trải nghiệm của bạn với chúng tôi</p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <span>Bảo mật thông tin</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Phản hồi trong 24h</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Cải thiện dịch vụ</span>
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
          children: isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi',
          disabled: isSubmitting || !formData.title.trim() || !formData.description.trim() || !formData.category,
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
          {/* Rating Section */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Đánh giá dịch vụ</h3>
                  <p className="text-sm text-blue-600">Cho chúng tôi biết mức độ hài lòng của bạn</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <FormItem label="Tiêu đề phản hồi">
                <Input
                  placeholder="Nhập tiêu đề cho phản hồi của bạn"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.currentTarget.value }))}
                />
              </FormItem>
            </div>
          </motion.div>

          {/* Feedback Content */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Nội dung phản hồi</h3>
                  <p className="text-sm text-green-600">Chia sẻ chi tiết trải nghiệm của bạn</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <FormItem label="Mô tả chi tiết">
                <TextareaWithImageUpload
                  textarea={{
                    value: formData.description,
                    onChange: (description) => setFormData((prev) => ({ ...prev, description })),
                    placeholder: 'Mô tả chi tiết trải nghiệm của bạn về dịch vụ...',
                  }}
                  images={{
                    values: formData.images,
                    onChange: (images) => setFormData((prev) => ({ ...prev, images })),
                  }}
                />
              </FormItem>
            </div>
          </motion.div>

          {/* Category Selection */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Danh mục phản hồi</h3>
                  <p className="text-sm text-purple-600">Chọn loại dịch vụ bạn muốn phản hồi</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <FormItem label="Chọn danh mục">
                <Radio.Group
                  className="flex flex-col space-y-3"
                  value={formData.category}
                  onChange={(value) => setFormData((prev) => ({ ...prev, category: value as string }))}
                  options={feedbackCategories.map((c) => ({
                    label: c,
                    value: c,
                  }))}
                />
              </FormItem>
            </div>
          </motion.div>

          {/* Privacy Notice */}
          <motion.div
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200"
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
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
                  Phản hồi của bạn được bảo mật tuyệt đối và chỉ được sử dụng để cải thiện chất lượng dịch vụ. Chúng tôi
                  sẽ phản hồi trong vòng 24 giờ.
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
              <p className="text-gray-700 font-medium">Đang gửi phản hồi...</p>
              <p className="text-sm text-gray-500 mt-1">Vui lòng đợi trong giây lát</p>
            </div>
          </div>
        )}
      </FabForm>
    </motion.div>
  );
}
