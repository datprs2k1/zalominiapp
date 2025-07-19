import { useAtomValue } from 'jotai';
import { useSearchParams } from 'react-router-dom';
import SearchBar from './search-bar';
import { useMemo, useState } from 'react';
import { searchAtom } from '@/services/post';
import SuggestionList from './SuggestionList';
import './mobile.css';

function SearchResultPage() {
  const [params] = useSearchParams();
  const keyword = params.get('keyword');
  const result = useAtomValue(searchAtom(keyword ?? ''));
  const [isLoading, setIsLoading] = useState(false);

  // Transform API response to match Suggestion[] type
  const suggestions = useMemo(() => {
    if (!result || !Array.isArray(result)) return [];

    return result.map((item: any) => ({
      id: item.id,
      title: item.title || item.name || '',
      value: item.title?.rendered || item.title || item.name || '',
      url: item.url || '',
      sub_type: item.subtype || '',
    }));
  }, [result]);

  return (
    <div className="flex flex-col h-full search-page-container">
      <div className="sticky top-0 z-10 bg-gray-50 pt-4 pb-2 px-4 search-bar-mobile">
        <SearchBar
          defaultValue={keyword ?? ''}
          className="mb-0"
          loading={isLoading}
          onChange={() => setIsLoading(true)}
        />
      </div>

      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto search-results-container">
        {keyword && (
          <div className="mb-3 text-gray-600 text-sm">
            Kết quả tìm kiếm cho "<span className="font-medium">{keyword}</span>"
          </div>
        )}

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <SuggestionList suggestions={suggestions} />

          {suggestions.length === 0 && keyword && (
            <div className="py-8 text-center no-results-container">
              <div className="text-gray-500 mb-2">Không tìm thấy kết quả</div>
              <div className="text-sm text-gray-400">Hãy thử tìm kiếm với từ khóa khác</div>
            </div>
          )}

          {!keyword && (
            <div className="py-8 text-center">
              <div className="text-gray-500">Hãy nhập từ khóa để tìm kiếm</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResultPage;
