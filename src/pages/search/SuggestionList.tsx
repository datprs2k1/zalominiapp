import React from 'react';
import TransitionLink from '@/components/transition-link';

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
    <div className="grid grid-cols-1 gap-3">
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
          className="block rounded-lg border border-gray-100 hover:shadow-md transition bg-white group search-item search-result-item"
        >
          <div className="p-3 flex items-center">
            <div className="flex-1">
              <div className="font-semibold text-base line-clamp-2 group-hover:text-emerald-600 transition">
                {item.title}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {item?.sub_type === 'info-bacsi' ? 'Bác sĩ' : item?.sub_type === 'post' ? 'Tin tức' : 'Dịch vụ'}
              </div>
            </div>

            <div className="ml-2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
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
                className="text-gray-500"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>
        </TransitionLink>
      ))}
    </div>
  );
};

export default SuggestionList;
