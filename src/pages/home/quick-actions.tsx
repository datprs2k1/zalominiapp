import Section from '@/components/section';
import TransitionLink from '@/components/transition-link';
import book from '@/static/book.svg';
import history from '@/static/history.svg';
import { To } from 'react-router-dom';

interface QuickActionProps {
  to: To;
  icon: string;
  title: string;
  subtitle: string;
  color?: string;
}

const QuickAction = ({ icon, title, subtitle, to, color = 'blue' }: QuickActionProps) => (
  <TransitionLink
    to={to}
    className={`flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 active:scale-[0.98]`}
  >
    <div className={`flex-shrink-0 h-14 w-14 rounded-full bg-${color}-50 p-3 flex items-center justify-center`}>
      <img src={icon} className="h-8 w-8" />
    </div>
    <div className="flex flex-grow flex-col gap-1">
      <div className="text-base font-semibold text-blue-800">{title}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  </TransitionLink>
);

const QuickActions = () => {
  return (
    <Section
      className="pt-2"
      title="Truy cập nhanh"
      viewMore="/services"
      isCard
      accentColor="cyan"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-cyan-600"
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="M5 3v4" />
          <path d="M19 17v4" />
          <path d="M3 5h4" />
          <path d="M17 19h4" />
        </svg>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <QuickAction to="/booking" icon={book} title="Đặt lịch khám" subtitle="Đặt khám nhanh" color="cyan" />
        <QuickAction to="/schedule" icon={history} title="Lịch sử khám" subtitle="Theo dõi hồ sơ" color="emerald" />
        <QuickAction to="/departments" icon={book} title="Khoa & Dịch vụ" subtitle="Tìm khoa phù hợp" color="blue" />
        <QuickAction to="/doctor" icon={history} title="Bác sĩ" subtitle="Đội ngũ chuyên gia" color="indigo" />
      </div>
    </Section>
  );
};

export default QuickActions;
