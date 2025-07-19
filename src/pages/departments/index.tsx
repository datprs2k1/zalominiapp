import Section from '@/components/section';
import MarkedTitleSection from '@/components/marked-title-section';
import chatOa from '@/static/services/chat-oa.svg';
import heartAndPill from '@/static/services/heart-and-pill.svg';
import { openChat } from 'zmp-sdk';
import { getConfig } from '@/utils/miscellaneous';
import { departmentsAtom } from '@/services/post';
import { useAtomValue } from 'jotai';
import TransitionLink from '@/components/transition-link';
import { useState } from 'react';

const POST_ATOM_PARAMS = {};

function DepartmentsPage() {
  const data = useAtomValue(departmentsAtom(POST_ATOM_PARAMS));
  const posts = (data as any) || [];
  const isEmpty = posts.length === 0;
  const sortedPosts = [...posts].sort((a, b) => a.title.rendered.localeCompare(b.title.rendered));
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  const handleImageLoad = (postId: number) => {
    setImageLoaded((prev) => ({ ...prev, [postId]: true }));
  };

  return (
    <Section className="pt-4 px-2 sm:pt-8 sm:px-4 md:px-8" isCard>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Dịch vụ nổi bật</h2>

        {/* Chat OA Card - Featured */}
        <div
          className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-sm p-5 cursor-pointer hover:shadow-md transition mb-4"
          onClick={() =>
            openChat({
              type: 'oa',
              id: getConfig((c) => c.template.oaID),
            })
          }
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
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tất cả chuyên khoa</h2>

        {isEmpty ? (
          <div className="text-center text-gray-400 py-12 bg-gray-50 rounded-xl text-base sm:text-lg">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Hiện chưa có dịch vụ nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sortedPosts.map((post) => (
              <TransitionLink
                key={post.id}
                to={`/department/${post.id}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition border border-gray-100"
              >
                <div className="relative aspect-[3/2] bg-gray-50 overflow-hidden">
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${imageLoaded[post.id] ? 'opacity-0' : 'opacity-100'}`}
                  >
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <img
                    src={post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || heartAndPill}
                    alt={post.title.rendered}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded[post.id] ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => handleImageLoad(post.id)}
                    loading="lazy"
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
              </TransitionLink>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

export default DepartmentsPage;
