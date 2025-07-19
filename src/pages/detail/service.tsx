import { useEffect, useState } from 'react';
import { serviceByIdState, symptomFormState } from '@/state';
import { useAtomValue } from 'jotai';
import { useParams } from 'react-router-dom';
import NotFound from '../404';
import DetailPageTemplate from './template';
import { serviceAtom } from '@/services/post';
import normalizeHtml from '@/utils/normalHTML';
function ServiceDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const data = useAtomValue(serviceAtom(Number(id)));

  useEffect(() => {
    if (data === undefined) {
      setLoading(true);
    } else {
      setLoading(false);
      setError(!data);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <NotFound />;
  }

  // data là object với các trường title, content, department (theo WP REST API)
  const service = data as {
    title?: { rendered?: string };
    content?: { rendered?: string };
    department?: any;
    [key: string]: any;
  };

  return (
    <DetailPageTemplate
      title={service.title?.rendered || 'Dịch vụ'}
      tab1={{
        htmlContent: normalizeHtml(service.content?.rendered || ''),
      }}
      tab2={{
        department: service.department || '',
      }}
      tab3={{
        formData: { ...symptomFormState },
      }}
    />
  );
}

export default ServiceDetailPage;
