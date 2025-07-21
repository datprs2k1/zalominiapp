import Section from '@/components/section';
import TransitionLink from '@/components/transition-link';
import { getPosts, postsAtomFamily } from '@/services/post';
import { useEffect, useState, useMemo } from 'react';
import { useAtomValue } from 'jotai';

const POST_ATOM_PARAMS = { type: 'post', per_page: 6 };

export function NewsItem({ _embedded, id, title, date }) {
  return (
    <TransitionLink
      to={`/news/${id}`}
      className="flex items-center w-full rounded-xl bg-white shadow-sm hover:shadow-md transition-all active:scale-[0.98] border border-gray-100"
    >
      <div className="flex-shrink-0 w-20 h-20">
        <img
          src={_embedded['wp:featuredmedia'][0].source_url}
          className="w-full h-full object-cover object-center rounded-l-xl"
          alt="News thumbnail"
          loading="lazy"
        />
      </div>
      <div className="p-3 flex-1">
        <div className="flex flex-col">
          <span className="inline-block bg-emerald-50 text-emerald-600 text-xs font-semibold px-2 py-0.5 rounded-full w-fit mb-1">
            {_embedded['wp:term'][0][0].name}
          </span>
          <h3
            className="text-sm font-bold line-clamp-2 text-blue-800"
            dangerouslySetInnerHTML={{ __html: title.rendered }}
          />
          <div className="text-xs text-gray-500 mt-1">{date}</div>
        </div>
      </div>
    </TransitionLink>
  );
}

export default function HealthNews() {
  const data = useAtomValue(postsAtomFamily(POST_ATOM_PARAMS));
  const posts = (data as any) || [];
  const [isLoading, setIsLoading] = useState(!data || posts.length === 0);

  // Add loading skeletons
  const renderSkeletons = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="flex items-center w-full rounded-xl bg-white shadow-sm border border-gray-100 animate-pulse"
      >
        <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-l-xl"></div>
        <div className="p-3 flex-1">
          <div className="h-4 bg-emerald-100 rounded-full w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/4"></div>
        </div>
      </div>
    ));
  };

  // Handle loading state
  useEffect(() => {
    setIsLoading(!data || posts.length === 0);
  }, [data, posts.length]);

  // Custom news icon
  const NewsIcon = () => (
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
      className="text-emerald-600"
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );

  return (
    <Section
      className="pt-2"
      title="Tin tức sức khỏe"
      viewMore="/explore"
      isCard
      accentColor="blue"
      icon={<NewsIcon />}
    >
      <div className="space-y-3">
        {isLoading ? renderSkeletons() : posts.map((post) => <NewsItem key={post.id} {...post} />)}
      </div>
    </Section>
  );
}
