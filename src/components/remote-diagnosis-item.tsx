import { ReactNode } from 'react';
import TransitionLink from './transition-link';

interface RemoteDiagnosisItemProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export default function RemoteDiagnosisItem({ icon, title, subtitle }: RemoteDiagnosisItemProps) {
  return (
    <TransitionLink
      to="/booking"
      className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-3 shadow-sm active:scale-95 transition-all"
    >
      <div className="h-10 w-10 flex-shrink-0 text-emerald-600">{icon}</div>
      <div className="flex flex-col">
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </TransitionLink>
  );
}
