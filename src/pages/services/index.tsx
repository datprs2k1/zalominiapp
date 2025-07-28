import Section from '@/components/section';
import MarkedTitleSection from '@/components/marked-title-section';
import chatOa from '@/static/services/chat-oa.svg';
import heartAndPill from '@/static/services/heart-and-pill.svg';
import invoice from '@/static/services/invoice.svg'; // Added import for the price icon
import { openChat } from 'zmp-sdk';
import { getConfig } from '@/utils/miscellaneous';
import { servicesAtom } from '@/services/post';
import { useAtomValue } from 'jotai';
import TransitionLink from '@/components/transition-link';
import { motion } from 'framer-motion';
import { Skeleton, ProgressiveLoader } from '@/components/loading-states';
import { usePageLoading } from '@/hooks/use-route-transition';
import { useEffect } from 'react';

const POST_ATOM_PARAMS = {};

function ServicesPage() {
  const data = useAtomValue(servicesAtom(POST_ATOM_PARAMS));
  const posts = (data as any) || [];
  const isEmpty = posts.length === 0;
  const sortedPosts = [...posts].sort((a, b) => a.title.rendered.localeCompare(b.title.rendered));
  const pageLoading = usePageLoading('services');

  // Simulate loading state for demo purposes
  useEffect(() => {
    if (posts.length === 0) {
      pageLoading.setLoading('services', true);
      // This would normally be handled by your data fetching logic
      setTimeout(() => {
        pageLoading.setLoading('services', false);
      }, 1000);
    }
  }, [posts.length]);
  return (
    <Section className="pt-4 px-2 sm:pt-8 sm:px-4 md:px-8" isCard>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.h2
          className="text-xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          Dịch vụ nổi bật
        </motion.h2>

        {/* Chat OA Card - Featured */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-sm p-5 cursor-pointer hover:shadow-md transition mb-4"
          onClick={() =>
            openChat({
              type: 'oa',
              id: getConfig((c) => c.template.oaID),
            })
          }
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white border border-blue-200 shadow-sm overflow-hidden">
              <img src={chatOa} alt="Chat OA" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-gray-900">Tư vấn trực tuyến</div>
              <div className="text-sm text-gray-600">Chat với CSKH phòng khám để được hỗ trợ ngay</div>
            </div>
            <div className="bg-white rounded-full p-2 shadow-sm">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Service Prices Card */}
        <TransitionLink to="/service-prices" className="block">
          <motion.div
            className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl shadow-sm p-5 cursor-pointer hover:shadow-md transition mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white border border-green-200 shadow-sm overflow-hidden">
                <img src={invoice} alt="Service Prices" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">Bảng giá dịch vụ</div>
                <div className="text-sm text-gray-600">Xem chi tiết giá các dịch vụ y tế theo từng loại</div>
              </div>
              <div className="bg-white rounded-full p-2 shadow-sm">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.div>
        </TransitionLink>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.h2
          className="text-xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          Tất cả dịch vụ
        </motion.h2>

        <ProgressiveLoader
          items={sortedPosts}
          isLoading={pageLoading.isLoading('services') || isEmpty}
          skeletonCount={6}
          renderItem={(post, index) => (
            <TransitionLink
              key={post.id}
              to={`/service/${post.id}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition border border-gray-100"
            >
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <div className="h-40 bg-gray-50 overflow-hidden">
                  <img
                    src={post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || heartAndPill}
                    alt={post.title.rendered}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div
                    className="text-base font-semibold text-gray-900 mb-2"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  {post.excerpt?.rendered && (
                    <div
                      className="text-sm text-gray-600 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                  )}
                  <div className="flex justify-end mt-3">
                    <div className="inline-flex items-center text-sm font-medium text-blue-500">
                      Xem chi tiết
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TransitionLink>
          )}
        />

        {/* Empty state with animation */}
        {!pageLoading.isLoading('services') && isEmpty && (
          <motion.div
            className="text-center text-gray-400 py-12 bg-gray-50 rounded-xl text-base sm:text-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </motion.svg>
            Hiện chưa có dịch vụ nào.
          </motion.div>
        )}
      </motion.div>
    </Section>
  );
}

export default ServicesPage;
