import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Container } from '@/components/ui';
import { cn } from '@/utils/cn';
import './mobile.css';

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
    <div className="booking-page flex flex-col min-h-screen bg-neutral-50">
      {/* Header with progress indicator */}
      <div className="bg-white shadow-card-medical sticky top-0 z-10 safe-area-padding">
        <Container maxWidth="md" padding="sm">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 comfortable-touch-target',
                    idx === currentStep
                      ? 'bg-medical-500 text-white shadow-button-medical'
                      : idx < currentStep
                        ? 'bg-success-500 text-white'
                        : 'bg-neutral-200 text-neutral-500'
                  )}
                >
                  <span className="text-xs sm:text-sm">{idx < currentStep ? '✓' : idx}</span>
                </div>
                <span
                  className={cn(
                    'text-xs mt-1 sm:mt-2 font-medium text-center px-1',
                    idx === currentStep ? 'text-medical-600' : 'text-neutral-500'
                  )}
                >
                  {idx === 1 ? 'Thông tin' : idx === 2 ? 'Chi tiết' : 'Xác nhận'}
                </span>
              </div>
            ))}
          </div>
          <div className="relative h-1 bg-neutral-200 rounded-full overflow-hidden mx-2">
            <div
              className="absolute top-0 left-0 h-full bg-medical-500 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </Container>
      </div>

      {/* Main content */}
      <div className="flex-grow">
        <Container maxWidth="md" padding="sm">
          <div className="bg-white rounded-medical-lg shadow-card-medical overflow-hidden mx-2 sm:mx-0">
            {renderStepContent()}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default BookingPage;
