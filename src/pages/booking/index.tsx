import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { BackIcon } from '@/components/icons/back';

function BookingPage() {
  const { step } = useParams();
  const currentStep = Number(step ?? '1');
  const navigate = useNavigate();

  // Validate step parameter
  useEffect(() => {
    if (currentStep < 1 || currentStep > 3 || isNaN(currentStep)) {
      navigate('/booking/1', { replace: true });
    }
  }, [currentStep, navigate]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      default:
        return <Navigate to="/booking/1" replace />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Chọn dịch vụ & lịch hẹn';
      case 2:
        return 'Thông tin cá nhân';
      case 3:
        return 'Xác nhận đặt lịch';
      default:
        return '';
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      navigate(`/booking/${currentStep - 1}`, { viewTransition: true });
    } else {
      navigate('/', { viewTransition: true });
    }
  };

  return (
    <div className="booking-page flex flex-col min-h-screen bg-gray-50">
      {/* Header with progress indicator */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 pt-4 pb-3">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${
                      idx === currentStep
                        ? 'bg-primary text-white shadow-md shadow-primary/30 scale-110'
                        : idx < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                >
                  {idx < currentStep ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="font-medium">{idx}</span>
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    idx === currentStep ? 'text-primary' : idx < currentStep ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {idx === 1 ? 'Thông tin' : idx === 2 ? 'Chi tiết' : 'Xác nhận'}
                </span>

                {/* Connector line */}
                {idx < 3 && (
                  <div className="absolute top-5 left-1/2 w-full h-[2px] -z-10">
                    <div className={`h-full ${idx < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">{renderStepContent()}</div>
      </div>
    </div>
  );
}

export default BookingPage;
