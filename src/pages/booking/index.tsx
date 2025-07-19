import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

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

  return (
    <div className="booking-page flex flex-col min-h-screen bg-gray-50">
      {/* Header with progress indicator */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between px-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    idx === currentStep
                      ? 'bg-primary text-white'
                      : idx < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {idx < currentStep ? '✓' : idx}
                </div>
                <span className={`text-xs mt-1 ${idx === currentStep ? 'text-primary font-medium' : 'text-gray-500'}`}>
                  {idx === 1 ? 'Thông tin' : idx === 2 ? 'Chi tiết' : 'Xác nhận'}
                </span>
              </div>
            ))}
          </div>
          <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">{renderStepContent()}</div>
      </div>
    </div>
  );
}

export default BookingPage;
