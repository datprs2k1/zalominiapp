import DoctorSelector from '@/components/form/doctor-selector';
import { bookingFormState } from '@/state';
import { Doctor } from '@/types';
import { useSetAtom } from 'jotai';
import { useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DetailPageContext } from './context';
import { motion } from 'framer-motion';
import { MedicalStatusIndicator, MedicalIcon } from '@/components/medical/MedicalServiceComponents';

export default function Tab2() {
  const { tab2 } = useContext(DetailPageContext);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>();
  const [query] = useSearchParams();
  const navigate = useNavigate();
  const setBookingData = useSetAtom(bookingFormState);

  const handleBookAppointment = () => {
    if (selectedDoctor) {
      setBookingData((prev) => ({
        ...prev,
        department: tab2.department,
        doctor: selectedDoctor,
      }));
      navigate('/booking', {
        viewTransition: true,
      });
    }
  };

  return (
    <div className="px-4 py-6 sm:px-8">
      {/* Doctor selection header */}
      <motion.div
        className="bg-white p-4 sm:p-6 rounded-xl shadow-sm mb-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
            <MedicalIcon type="stethoscope" size="sm" className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Bác sĩ chuyên khoa</h2>
            <p className="text-sm text-gray-600">Chọn bác sĩ để đặt lịch khám</p>
          </div>
        </div>

        <div className="bg-primary-50 rounded-lg p-3 text-sm text-primary-dark flex items-start">
          <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            Chọn bác sĩ phù hợp với nhu cầu của bạn. Bạn có thể xem thông tin chi tiết về kinh nghiệm và chuyên môn của
            từng bác sĩ.
          </div>
        </div>
      </motion.div>

      {/* Doctor selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DoctorSelector
          value={selectedDoctor}
          onChange={setSelectedDoctor}
          onLoadDoctors={(doctors) => {
            const doctorId = query.get('doctor');
            const doctor = doctors.find((d) => d.id === Number(doctorId));
            if (doctor && !selectedDoctor) {
              setSelectedDoctor(doctor);
            }
          }}
        />
      </motion.div>

      {/* Bottom action bar */}
      {selectedDoctor && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, type: 'spring' }}
        >
          <div className="flex items-center gap-4 max-w-4xl mx-auto">
            <div className="flex-1">
              <div className="flex items-center">
                <img
                  src={selectedDoctor.image || '/static/doctors/wilsonj.png'}
                  alt={selectedDoctor.name}
                  className="w-10 h-10 rounded-full border-2 border-primary object-cover mr-3"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{selectedDoctor.name}</p>
                  <div className="flex items-center">
                    <MedicalStatusIndicator status="available" size="sm" />
                    <span className="text-xs text-gray-500 ml-2">Đang trực tuyến</span>
                  </div>
                </div>
              </div>
            </div>
            <motion.button
              className="bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center shadow-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBookAppointment}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Đặt lịch khám
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
