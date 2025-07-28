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
  gradient?: string;
}

const QuickAction = ({ icon, title, subtitle, to, color = 'blue', gradient }: QuickActionProps) => (
  <TransitionLink
    to={to}
    className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-all border border-gray-50 active:scale-[0.98]"
  >
    <div
      className={`h-14 w-14 rounded-full flex items-center justify-center ${
        gradient ? gradient : `bg-${color}-50`
      } shadow-sm`}
    >
      <img src={icon} className="h-7 w-7" alt={title} />
    </div>
    <div className="flex flex-col items-center text-center">
      <div className="text-base font-semibold text-gray-800">{title}</div>
      <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>
    </div>
  </TransitionLink>
);

const QuickActions = () => {
  return (
    <div className="px-4 mb-2">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
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
          className="text-blue-600 mr-2"
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
        Dịch vụ chính
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <QuickAction
          to="/booking"
          icon={book}
          title="Đặt lịch khám"
          subtitle="Đặt khám nhanh"
          gradient="bg-gradient-to-br from-cyan-50 to-blue-50"
        />
        <QuickAction
          to="/schedule"
          icon={history}
          title="Lịch sử khám"
          subtitle="Theo dõi hồ sơ"
          gradient="bg-gradient-to-br from-emerald-50 to-teal-50"
        />
        <QuickAction
          to="/departments"
          icon={book}
          title="Khoa & Dịch vụ"
          subtitle="Tìm khoa phù hợp"
          gradient="bg-gradient-to-br from-blue-50 to-indigo-50"
        />
        <QuickAction
          to="/doctor"
          icon={history}
          title="Bác sĩ"
          subtitle="Đội ngũ chuyên gia"
          gradient="bg-gradient-to-br from-indigo-50 to-purple-50"
        />
      </div>

      {/* View All Services Button */}
      <div className="mt-3 flex justify-center">
        <TransitionLink
          to="/services"
          className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700 px-4 py-2 rounded-full active:bg-blue-50 transition-colors"
        >
          Xem tất cả dịch vụ
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </TransitionLink>
      </div>
    </div>
  );
};

export default QuickActions;
