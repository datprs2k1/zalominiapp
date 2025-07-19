import ArrowRightIcon from '@/components/icons/arrow-right';
import Section from '@/components/section';
import { useAtomValue } from 'jotai';
import { departmentsAtom } from '@/services/post';
import { useMemo } from 'react';
import TransitionLink from '@/components/transition-link';

const POST_ATOM_PARAMS = { per_page: 4 };

interface FeaturedDepartentsProps {
  className?: string;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse flex flex-col items-start gap-3 rounded-xl shadow-sm p-4 min-h-[160px] bg-gray-100 border border-gray-200">
      <div className="bg-gray-300 rounded-xl w-[80px] h-[60px] mb-2" />
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="mt-auto h-8 w-16 bg-gray-300 rounded-full" />
    </div>
  );
}

const DepartmentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-blue-600"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
    <path d="m18 15-2-2" />
    <path d="m15 18-2-2" />
  </svg>
);

export default function FeaturedDepartents({ className }: FeaturedDepartentsProps) {
  const data = useAtomValue(departmentsAtom(POST_ATOM_PARAMS));
  const posts = (data as any) || [];
  const isLoading = !data || posts.length === 0;
  const skeletons = useMemo(() => Array.from({ length: 4 }), []);

  return (
    <Section
      className={`pt-3 pb-2 ${className ?? ''}`}
      title="Khoa nổi bật"
      viewMore="/departments"
      isCard
      icon={<DepartmentIcon />}
      accentColor="blue"
    >
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        {isLoading
          ? skeletons.map((_, idx) => <SkeletonCard key={idx} />)
          : posts.map((post) => (
              <TransitionLink
                to={`/department/${post.id}`}
                className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-0 active:scale-95 transition-all"
                key={post.id}
              >
                {post?._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                  <img
                    src={post._embedded['wp:featuredmedia'][0].source_url}
                    alt={post.title.rendered}
                    className="w-full h-28 object-cover object-center rounded-t-xl"
                  />
                )}
                <div className="flex flex-col p-3">
                  <div
                    className="text-base font-bold text-blue-600 mb-2 text-center line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <button className="mt-auto w-full flex items-center justify-center rounded-lg px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold">
                    <span>Xem khoa</span>
                    <ArrowRightIcon width={16} height={16} color="white" className="ml-2" />
                  </button>
                </div>
              </TransitionLink>
            ))}
      </div>
    </Section>
  );
}
