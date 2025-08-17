import React from 'react';
import TransitionLink from '@/components/transition-link';
import { cn } from '@/utils/cn';

interface Suggestion {
  id: number;
  title: string;
  value: string;
  url: string;
  price?: string;
  sub_type?: string;
}

interface SuggestionListProps {
  suggestions: Suggestion[];
}

const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions }) => {
  if (!suggestions?.length) return null;

  return (
    <div className="space-y-3">
      {suggestions.map((item) => (
        <TransitionLink
          key={item.id}
          to={
            item?.sub_type === 'info-bacsi'
              ? `/doctor/${item.id}`
              : item?.sub_type === 'post'
                ? `/news/${item.id}`
                : `/service/${item.id}`
          }
          className="block rounded-medical border border-neutral-100 hover:shadow-card-hover hover:border-medical-200 transition-all duration-200 bg-white group search-item search-result-item"
        >
          <div className="p-4 min-h-[64px] flex items-center">
            <div className="flex-1">
              <div className="font-semibold text-medical-body line-clamp-2 group-hover:text-medical-600 transition-colors text-neutral-900">
                {item.title}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    item?.sub_type === 'info-bacsi'
                      ? 'bg-medical-100 text-medical-700'
                      : item?.sub_type === 'post'
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-wellness-100 text-wellness-700'
                  )}
                >
                  {item?.sub_type === 'info-bacsi' ? 'Bác sĩ' : item?.sub_type === 'post' ? 'Tin tức' : 'Dịch vụ'}
                </span>
                {item.price && <span className="text-medical-label text-medical-600 font-medium">{item.price}</span>}
              </div>
            </div>

            <div className="ml-3 w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-medical-100 flex items-center justify-center transition-colors duration-200">
              <svg
                className="w-4 h-4 text-neutral-400 group-hover:text-medical-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </TransitionLink>
      ))}
    </div>
  );
};

export default SuggestionList;
