import { useAtomValue } from 'jotai';
import DoctorItem from '../items/doctor';
import { Doctor } from '@/types';
import CheckIcon from '../icons/check';
import { useEffect } from 'react';
import { doctorsAtom } from '@/services/post';

export interface DoctorSelectorProps {
  value?: Doctor;
  onChange: (value: Doctor) => void;
  onLoadDoctors?: (doctors: any) => void;
  loading?: boolean;
}

function DoctorSelector({ value, onChange, onLoadDoctors, loading }: DoctorSelectorProps) {
  const data = useAtomValue(doctorsAtom);
  const doctors = data || [];
  const isLoading = loading || !data;

  useEffect(() => {
    onLoadDoctors?.(doctors);
  }, [doctors]);

  // Skeleton loading UI
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 bg-white mt-3 p-4 rounded-lg shadow animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
            <div className="h-14 w-14 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-3 w-1/4 bg-gray-100 rounded" />
            </div>
            <div className="h-7 w-14 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 bg-white mt-3 p-4 rounded-lg shadow">
      {doctors.map((doctor, index) => {
        const selected = value && value.id === doctor.id;
        return (
          <DoctorItem
            withLanguages
            key={doctor.id || index}
            doctor={doctor}
            onClick={() => doctor.isAvailable && onChange(doctor)}
            className={`transition hover:shadow-md ${selected ? 'ring-2 ring-primary' : ''}`}
          />
        );
      })}
    </div>
  );
}

export default DoctorSelector;
