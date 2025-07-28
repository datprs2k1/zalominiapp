import { useAtomValue } from 'jotai';
import { useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import NotFound from '../404';
import { postAtomFamily } from '@/services/post';
import normalizeHtml from '@/utils/normalHTML';
import { getColorToken } from '@/styles/unified-color-system';

function NewsPage() {
  const { id } = useParams();
  const news = useAtomValue(postAtomFamily(Number(id)));
  const prefersReducedMotion = useReducedMotion();

  if (news === undefined) {
    // Enhanced Loading state with medical styling
    return (
      <motion.div
        className="flex w-full flex-col items-center justify-center p-8 min-h-[400px] bg-gradient-to-br from-blue-50/30 via-white to-green-50/30"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <motion.div
              className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
              animate={prefersReducedMotion ? {} : { rotate: 360 }}
              transition={prefersReducedMotion ? {} : { duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang tải bài viết</h3>
          <p className="text-gray-600 text-sm">Vui lòng đợi trong giây lát...</p>
        </div>
      </motion.div>
    );
  }

  if (!news) {
    return <NotFound />;
  }

  // Nếu dùng axios interceptor trả về response.data thì news là object bài viết
  const post = news.data ? news.data : news; // fallback nếu đã interceptor trả về data luôn
  const title = post.title?.rendered || '';
  const date = post.date
    ? new Date(post.date).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  let featuredImage = '';
  let category = 'Tin tức y tế';

  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url) {
    featuredImage = post._embedded['wp:featuredmedia'][0].source_url;
  }

  // Extract category
  if (post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0] && post._embedded['wp:term'][0][0]) {
    category = post._embedded['wp:term'][0][0].name;
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-green-50/30"
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Medical Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Tin tức y tế</h1>
              <p className="text-blue-100 text-sm">Thông tin sức khỏe và y học cập nhật</p>
            </div>
          </div>

          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm font-medium">{category}</span>
          </div>
        </div>
      </motion.div>

      {/* Article Content */}
      <motion.div
        className="max-w-4xl mx-auto px-4 py-8"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <article className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          {/* Featured Image */}
          {featuredImage && (
            <motion.div
              className="relative h-64 md:h-80 overflow-hidden"
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <img src={featuredImage} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          )}

          {/* Article Header */}
          <motion.div
            className="p-6 md:p-8"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">{title}</h1>

            {/* Article Meta */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">{date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">5 phút đọc</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                <span className="text-sm font-medium">Đã kiểm duyệt y khoa</span>
              </div>
            </div>

            {/* Article Content */}
            <motion.div
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              dangerouslySetInnerHTML={{ __html: normalizeHtml(post.content?.rendered || '') }}
            />
          </motion.div>
        </article>

        {/* Related Actions */}
        <motion.div
          className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cần tư vấn thêm?</h3>
              <p className="text-gray-600 mb-4">
                Đội ngũ bác sĩ chuyên khoa của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  Đặt lịch tư vấn
                </button>
                <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-xl font-medium transition-colors">
                  Gọi hotline: 1900 1234
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default NewsPage;
