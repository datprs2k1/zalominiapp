import { useAtomValue } from 'jotai';
import { useParams } from 'react-router-dom';
import NotFound from '../404';
import { postAtomFamily } from '@/services/post';
import normalizeHtml from '@/utils/normalHTML';

function NewsPage() {
  const { id } = useParams();
  const news = useAtomValue(postAtomFamily(Number(id)));

  if (news === undefined) {
    // Loading state
    return (
      <div className="flex w-full flex-col items-center justify-center p-8 min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-4" />
        <span>Đang tải bài viết...</span>
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
    <div className="max-w-2xl mx-auto w-full bg-white rounded-lg shadow p-4 md:p-8 flex flex-col gap-6 mt-4 mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <div className="text-xs text-gray-500 mb-2">{date}</div>
      <div
        className="prose prose-sm md:prose max-w-none text-blue-900"
        dangerouslySetInnerHTML={{ __html: normalizeHtml(post.content?.rendered || '') }}
      />
    </div>
  );
}

export default NewsPage;
