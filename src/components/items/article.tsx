import { Article } from '@/types';
import TransitionLink from '../transition-link';

export function ArticleItem({ id, title, categories, date, featured_image }: Article) {
  return (
    <TransitionLink to={`/news/${id}`} className="flex flex-grow items-center justify-center space-x-6">
      <div className="flex flex-grow flex-col items-start gap-3">
        <div className="h-9 line-clamp-2 text-sm font-medium">{title}</div>
        <div className="w-full flex items-center justify-between text-xs">
          <div className="rounded-lg bg-highlight px-2 text-center whitespace-nowrap">{categories[0]}</div>
          <div className="text-disabled whitespace-nowrap">{date}</div>
        </div>
      </div>
      <div className="h-[76px] w-[106px] flex-none">
        <img className="w-full h-full object-cover rounded-lg" src={featured_image} alt={title} />
      </div>
    </TransitionLink>
  );
}
