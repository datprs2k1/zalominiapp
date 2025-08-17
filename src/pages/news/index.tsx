import { useAtomValue } from 'jotai';
import { useParams } from 'react-router-dom';
import NotFound from '../404';
import { postAtomFamily } from '@/services/post';
import normalizeHtml from '@/utils/normalHTML';
import { Card, Loading } from '@/components/ui';

function NewsPage() {
  const { id } = useParams();
  const news = useAtomValue(postAtomFamily(Number(id)));

  if (news === undefined) {
    // Enhanced loading state with Serene Blues design
    return (
      <div className="min-h-screen bg-medical-50 mobile-safe-top mobile-safe-bottom">
        <div className="container mx-auto px-4 py-6">
          <Card className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <Loading variant="spinner" size="lg" text="Đang tải bài viết..." className="text-medical-600" />
          </Card>
        </div>
      </div>
    );
  }

  if (!news) {
    return <NotFound />;
  }

  // Nếu dùng axios interceptor trả về response.data thì news là object bài viết
  const post = news.data ? news.data : news; // fallback nếu đã interceptor trả về data luôn
  const title = post.title?.rendered || '';
  const date = post.date ? new Date(post.date).toLocaleDateString('vi-VN') : '';
  let featuredImage = '';
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url) {
    featuredImage = post._embedded['wp:featuredmedia'][0].source_url;
  }

  return (
    <div className="min-h-screen bg-medical-50 mobile-safe-top mobile-safe-bottom">
      {/* Header Section with Gradient Background */}
      <div className="bg-gradient-to-br from-medical-500 to-medical-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-3">
            {/* Date Badge */}
            {date && (
              <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">{date}</span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold leading-tight mobile-heading-primary text-white">{title}</h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-6">
        <Card variant="default" padding="lg" className="shadow-card-medical border-medical-100">
          {/* Featured Image */}
          {featuredImage && (
            <div className="mb-6 -mx-6 -mt-6">
              <img
                src={featuredImage}
                alt={title}
                className="w-full h-48 md:h-64 object-cover rounded-t-medical-lg"
                loading="lazy"
              />
            </div>
          )}

          {/* Article Content */}
          <div
            className="prose-medical max-w-none"
            dangerouslySetInnerHTML={{ __html: normalizeHtml(post.content?.rendered || '') }}
          />
        </Card>

        {/* Back Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="btn-medical-secondary comfortable-touch-target"
            aria-label="Quay lại trang trước"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewsPage;
