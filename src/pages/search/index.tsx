import { useAtomValue } from 'jotai';
import { useSearchParams } from 'react-router-dom';
import SearchBar from './search-bar';
import { useMemo, useState } from 'react';
import { searchAtom } from '@/services/post';
import SuggestionList from './SuggestionList';
import './mobile.css';
import { Container, Card } from '@/components/ui';
import { cn } from '@/utils/cn';
import SearchIcon from '@/components/icons/search';

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
    <div className="flex flex-col h-full search-page-container bg-neutral-50">
      <div className="sticky top-0 z-10 bg-neutral-50/95 backdrop-blur-medical pt-4 pb-2 search-bar-mobile">
        <Container maxWidth="md" padding="md">
          <SearchBar defaultValue={keyword ?? ''} className="mb-0" loading={isLoading} />
        </Container>
      </div>

      <div className="flex-1 overflow-y-auto search-results-container">
        <Container maxWidth="md" padding="md">
          {keyword && (
            <div className="mb-4 text-neutral-600 text-medical-body">
              Kết quả tìm kiếm cho "<span className="font-semibold text-medical-600">{keyword}</span>"
            </div>
          )}

          <Card>
            <SuggestionList suggestions={suggestions} />

            {suggestions.length === 0 && keyword && (
              <div className="py-12 text-center no-results-container">
                <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="text-neutral-500 mb-2 font-medium">Không tìm thấy kết quả</div>
                <div className="text-medical-body text-neutral-400">Hãy thử tìm kiếm với từ khóa khác</div>
              </div>
            )}

            {!keyword && (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-medical-100 rounded-full flex items-center justify-center">
                  <SearchIcon className="w-8 h-8 text-medical-500" />
                </div>
                <div className="text-neutral-500 font-medium">Hãy nhập từ khóa để tìm kiếm</div>
                <div className="text-medical-body text-neutral-400 mt-1">Tìm bệnh, bác sĩ, thuốc...</div>
              </div>
            )}
          </Card>
        </Container>
      </div>
    </div>
  );
}

export default SearchResultPage;
