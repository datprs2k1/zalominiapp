import { bookingFormState } from '@/state';
import { Doctor } from '@/types';
import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui';
import { cn } from '@/utils/cn';

interface VisitedDoctorProps {
  doctor: Doctor;
}

export function VisitedDoctor({ doctor }: VisitedDoctorProps) {
  const setFormData = useSetAtom(bookingFormState);
  const navigate = useNavigate();

  return (
    <Card
      variant="hover"
      className="cursor-pointer text-left"
      onClick={() => {
        setFormData((prev) => ({
          ...prev,
          doctor,
        }));
        navigate('/booking', {
          viewTransition: true,
        });
      }}
    >
      <div className="flex items-center gap-3">
        <img src={doctor.image} className="w-12 h-12 rounded-full object-cover border-2 border-medical-100" />
        <div className="flex flex-grow flex-col gap-1">
          <div className="text-medical-body font-semibold text-neutral-900">{doctor.name}</div>
          <div className="text-medical-label text-neutral-500">{doctor.specialties}</div>
        </div>
        <div className="text-neutral-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Card>
  );
}
