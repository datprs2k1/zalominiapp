import { Link, To } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface ActionProps {
  label: string;
  badge?: number;
  icon: React.ReactNode;
  to: To;
}

export function Action({ label, badge, icon, to }: ActionProps) {
  return (
    <Link
      className="flex items-center justify-between py-4 px-4 rounded-medical hover:bg-medical-50 transition-colors duration-200 min-h-[44px] group"
      to={to}
    >
      <div className="flex items-center gap-2 text-medical-body">
        <div className="font-medium text-neutral-900 group-hover:text-medical-700 transition-colors duration-200">
          {label}
        </div>
        {badge && (
          <div className="flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-danger-500 px-1 text-center text-xs text-white font-medium">
            {badge > 99 ? '99+' : badge}
          </div>
        )}
      </div>
      <div className="text-neutral-400 group-hover:text-medical-500 transition-colors duration-200">{icon}</div>
    </Link>
  );
}
