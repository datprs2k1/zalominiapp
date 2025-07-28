import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export interface Suggestion {
  id: string | number;
  title: string;
  value: string;
  url?: string;
  sub_type?: string;
  image?: string;
}

interface SuggestionListProps {
  suggestions: Suggestion[];
}

export default function SuggestionList({ suggestions }: SuggestionListProps) {
  // Group suggestions by type for better organization
  const groupedSuggestions = useMemo(() => {
    const groups: Record<string, Suggestion[]> = {};

    suggestions.forEach((suggestion) => {
      const type = suggestion.sub_type || 'general';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(suggestion);
    });

    return groups;
  }, [suggestions]);

  // Get appropriate icon for each suggestion type
  const getIconForType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'doctor':
        return (
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
            className="text-blue-500"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        );
      case 'department':
        return (
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
            className="text-green-600"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        );
      case 'service':
        return (
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
            className="text-purple-600"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        );
      default:
        return (
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
            className="text-gray-500"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        );
    }
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="suggestion-list px-2 py-2 animate-fade-in">
      {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
        <div key={type} className="mb-4 last:mb-0">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
            {type === 'general' ? 'Kết quả tìm kiếm' : type}
          </h3>
          <div className="space-y-2">
            {typeSuggestions.map((suggestion) => (
              <Link
                key={suggestion.id}
                to={suggestion.url || `/${suggestion.sub_type?.toLowerCase() || 'search'}/${suggestion.id}`}
                className="flex items-center p-3 rounded-xl bg-white border border-gray-100 
                          shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300
                          transform hover:translate-x-1"
              >
                <div className="flex-shrink-0">
                  {suggestion.image ? (
                    <img
                      src={suggestion.image}
                      alt={suggestion.title}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-50"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 
                                flex items-center justify-center"
                    >
                      {getIconForType(suggestion.sub_type || '')}
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0 ml-4">
                  <div className="text-gray-900 font-medium text-base line-clamp-1">{suggestion.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center">
                    {suggestion.sub_type && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs 
                                      ${
                                        suggestion.sub_type.toLowerCase() === 'doctor'
                                          ? 'bg-blue-100 text-blue-800'
                                          : suggestion.sub_type.toLowerCase() === 'department'
                                            ? 'bg-green-100 text-green-800'
                                            : suggestion.sub_type.toLowerCase() === 'service'
                                              ? 'bg-purple-100 text-purple-800'
                                              : 'bg-gray-100 text-gray-800'
                                      }`}
                      >
                        {suggestion.sub_type}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2 text-blue-400 animate-pulse-subtle">
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
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
