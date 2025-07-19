import Section from '@/components/section';
import TransitionLink from '@/components/transition-link';
import book from '@/static/book.svg';
import history from '@/static/history.svg';
import all from '@/static/services/all.svg';
import hospital from '@/static/services/hospital.svg';
import { To } from 'react-router-dom';

interface QuickActionProps {
  to: To;
  icon: string;
  title: string;
  subtitle: string;
  color?: string;
}

const QuickAction = ({ icon, title, subtitle, to, color = 'emerald' }: QuickActionProps) => (
  <TransitionLink
    to={to}
    className={`flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-${color}-100 transition-all duration-300 active:scale-95 group`}
  >
    <div
      className={`flex-shrink-0 w-12 h-12 rounded-xl bg-${color}-50 p-2 flex items-center justify-center group-hover:bg-${color}-100 transition-colors duration-300`}
    >
      <img src={icon} className="h-7 w-7 md:h-8 md:w-8" alt={title} />
    </div>
    <div className="flex flex-grow flex-col">
      <div
        className={`text-sm font-semibold text-gray-900 group-hover:text-${color}-700 transition-colors duration-300`}
      >
        {title}
      </div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
    <div
      className={`flex-shrink-0 p-1.5 rounded-full bg-gray-50 group-hover:bg-${color}-50 transition-colors duration-300`}
    >
      <svg
        className={`w-5 h-5 text-gray-400 group-hover:text-${color}-500 transition-colors duration-300`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </TransitionLink>
);

interface QuickActionsProps {
  className?: string;
}

const QuickActions = ({ className }: QuickActionsProps) => {
  // Icon for section header
  const ActionIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-blue-600"
    >
      <path
        d="M8 12.2H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 16.2H12.38"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <Section className={`py-2 ${className ?? ''}`} title="Thao tác nhanh" icon={<ActionIcon />} accentColor="blue">
      <div className="mb-3 pl-1">
        <p className="text-xs text-gray-600">Truy cập nhanh các dịch vụ chính</p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <QuickAction to="/booking" icon={book} title="Đặt lịch khám" subtitle="Đặt lịch với bác sĩ" color="blue" />
        <QuickAction to="/schedule" icon={history} title="Lịch sử khám" subtitle="Xem hồ sơ khám" color="purple" />
        <QuickAction to="/services" icon={all} title="Dịch vụ y tế" subtitle="Khám đa khoa" color="emerald" />
        <QuickAction to="/departments" icon={hospital} title="Khoa chuyên môn" subtitle="Chuyên khoa" color="amber" />
      </div>
    </Section>
  );
};

export default QuickActions;
