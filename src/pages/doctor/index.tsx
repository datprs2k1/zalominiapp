import DoctorList from '@/components/form/doctor-list';

export default function DoctorPage() {
  return (
    <div className="min-h-screen bg-white px-3 sm:px-4 py-1.5 sm:py-2 pb-st">
      <DoctorList className="max-w-sm sm:max-w-md mx-auto" />
    </div>
  );
}
