import { useEffect, useState } from 'react';
import { serviceByIdState, symptomFormState } from '@/state';
import { useAtomValue } from 'jotai';
import { useParams } from 'react-router-dom';
import NotFound from '../404';
import DetailPageTemplate from './template';
import { departmentAtom } from '@/services/post';
import normalizeHtml from '@/utils/normalHTML';
import heartAndPill from '@/static/services/heart-and-pill.svg';
import drug from '@/static/services/drug.svg';
import stethoscope from '@/static/services/stethoscope.svg';
import pill from '@/static/services/pill.svg';

function DepartmentDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const data = useAtomValue(departmentAtom(Number(id)));

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
    excerpt?: { rendered?: string };
    [key: string]: any;
  };

  // Extract a short description from excerpt or first part of content
  const getSubtitle = () => {
    if (service.excerpt?.rendered) {
      // Remove HTML tags and limit length
      return normalizeHtml(service.excerpt.rendered).substring(0, 120) + '...';
    }
    return 'Thông tin chi tiết về chuyên khoa';
  };

  // Sample department statistics
  const departmentStats = [
    { label: 'Bác sĩ', value: '12+' },
    { label: 'Bệnh nhân/ngày', value: '120' },
    { label: 'Đánh giá', value: '4.8/5' },
    { label: 'Kinh nghiệm', value: '15 năm' },
  ];

  // Get department icon - you could map department types to specific icons here
  const getDepartmentIcon = () => {
    // This is a placeholder logic. In a real app, you'd match the department type to an icon
    const departmentName = service.title?.rendered?.toLowerCase() || '';
    if (departmentName.includes('da')) {
      return pill;
    } else if (departmentName.includes('tim')) {
      return heartAndPill;
    } else if (departmentName.includes('khám')) {
      return stethoscope;
    }
    return heartAndPill; // default
  };

  return (
    <DetailPageTemplate
      title={service.title?.rendered || 'Khoa'}
      // subtitle={getSubtitle()}
      // icon={getDepartmentIcon()}
      // stats={departmentStats}
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

export default DepartmentDetailPage;
