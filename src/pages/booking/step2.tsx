import FabForm from '@/components/form/fab-form';
import SymptomInquiry from '@/components/form/symptom-inquiry';
import { bookingFormState } from '@/state';
import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import FormItem from '@/components/form/item';
import { Input } from 'zmp-ui';
import { getUserInfo, getAccessToken, getPhoneNumber } from 'zmp-sdk';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, SECRET_KEY } from '@/config';

export default function Step2() {
  const [formData, setFormData] = useAtom(bookingFormState);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPhone = async () => {
    try {
      const phone = await getPhoneNumber();
      const token = phone.token;
      const res = await axios.get('https://graph.zalo.me/v2.0/me/info', {
        headers: {
          access_token: localStorage.getItem('zaloAccessToken') || '',
          code: token,
          secret_key: SECRET_KEY,
        },
      });
      return res.data.data.number;
    } catch (error) {
      console.error('Error getting phone number:', error);
      toast.error('Không thể lấy số điện thoại');
      return '';
    }
  };

  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const accessToken = await getAccessToken();
        localStorage.setItem('zaloAccessToken', accessToken);
      } catch (e) {
        console.error('Không thể lấy accessToken:', e);
      }
    }
    fetchAccessToken();
  }, []);

  // Format date for submission
  function formatDateVN(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  const isFormValid =
    formData.name.trim().length > 0 && formData.phone.trim().length > 0 && formData.description.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setIsSubmitting(true);

    try {
      let { description, slot, name, phone } = formData;
      if (!slot) {
        toast.error('Vui lòng chọn ngày khám!');
        return;
      }
      const date = new Date(slot.date);
      const formattedDate = formatDateVN(date);

      const data = new FormData();
      data.append('your-message', description);
      data.append('your-date', formattedDate);
      data.append('your-name', name);
      data.append('your-phone', phone);

      // Uncomment when API is ready
      // const res = await axios.post(`${API_URL}/wp-json/contact-form-7/v1/contact-forms/feedback`, data);
      // if (res.status === 200) {

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Đặt lịch khám thành công!');
      navigate('/booking/3', {
        viewTransition: true,
      });
      // }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại sau!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetUserInfo = async () => {
    try {
      const userInfo = await getUserInfo();
      const phone = await getPhone();
      setFormData((prev) => ({
        ...prev,
        phone: phone || '',
        name: userInfo.userInfo.name || prev.name,
      }));
      toast.success('Đã lấy thông tin từ Zalo');
    } catch (e) {
      console.log(e);
      toast.error('Không thể lấy thông tin từ Zalo!');
    }
  };

  return (
    <FabForm
      fab={{
        children: 'Đặt lịch khám',
        disabled: !isFormValid || isSubmitting,
        onDisabledClick() {
          toast.error('Vui lòng điền đầy đủ thông tin!');
        },
      }}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col">
        {/* Personal Information Section */}
        <div className="bg-white p-4 sm:p-5 rounded-lg">
          <h2 className="text-lg sm:text-xl font-medium mb-4">Thông tin cá nhân</h2>

          <div className="flex justify-end mb-4">
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-medical-600 font-medium px-4 py-2 rounded-medical bg-medical-50 hover:bg-medical-100 transition-colors comfortable-touch-target mobile-focus-visible"
              onClick={handleGetUserInfo}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              Lấy từ Zalo
            </button>
          </div>

          <div className="space-y-5">
            <div className="form-control">
              <label className="mobile-form-label">
                Họ và tên
                <span className="text-red-500">*</span>
              </label>
              <Input
                className="mobile-form-input"
                placeholder="Nhập họ và tên"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.currentTarget.value }))}
              />
              {formData.name.trim().length === 0 && (
                <p className="mt-2 text-xs text-red-500 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Vui lòng nhập họ và tên
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="mobile-form-label">
                Số điện thoại
                <span className="text-red-500">*</span>
              </label>
              <Input
                className="mobile-form-input"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                type="tel"
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.currentTarget.value }))}
              />
              {formData.phone.trim().length === 0 && (
                <p className="mt-2 text-xs text-red-500 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Vui lòng nhập số điện thoại
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Appointment Information Section */}
        <div className="mt-4 space-y-4">
          <div className="bg-medical-50 p-4 rounded-medical border border-medical-100">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-medical-500 rounded-full p-1.5 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-medical-800 mb-1">Lưu ý quan trọng</h3>
                <p className="text-sm text-medical-700 leading-relaxed">
                  Vui lòng mô tả chi tiết các triệu chứng, vấn đề sức khỏe bạn đang gặp phải để bác sĩ có thể chuẩn bị
                  tốt hơn cho buổi khám.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-medical border border-gray-200">
            <SymptomInquiry value={formData} onChange={setFormData} />
          </div>
        </div>

        {isSubmitting && (
          <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 safe-area-padding">
            <div className="flex flex-col items-center bg-white rounded-medical shadow-lg p-6 mx-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-medical-500 mb-3"></div>
              <p className="text-medical-700 font-medium">Đang xử lý...</p>
              <p className="text-sm text-medical-600 mt-1">Vui lòng đợi trong giây lát</p>
            </div>
          </div>
        )}
      </div>
    </FabForm>
  );
}
