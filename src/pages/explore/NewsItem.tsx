import TransitionLink from '@/components/transition-link';
import { useEffect, useState } from 'react';

export function ExploreNewsItem({ _embedded, id, title, date, excerpt }) {
  // Extract featured image URL
  const featuredImageUrl =
    _embedded && _embedded['wp:featuredmedia'] && _embedded['wp:featuredmedia'][0]
      ? _embedded['wp:featuredmedia'][0].source_url
      : '/static/news.png'; // fallback image

  // Extract category
  const category =
    _embedded && _embedded['wp:term'] && _embedded['wp:term'][0] && _embedded['wp:term'][0][0]
      ? _embedded['wp:term'][0][0].name
      : 'News';

  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Extract and clean excerpt
  const cleanExcerpt =
    excerpt && excerpt.rendered
      ? excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
      : '';

  // Detect if we're on desktop for enhanced effects
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Initial check
    checkIfDesktop();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfDesktop);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfDesktop);
  }, []);

  return (
    <TransitionLink to={`/news/${id}`} className="news-item">
      <div className="news-item-image">
        <img src={featuredImageUrl} alt={title.rendered || 'News thumbnail'} loading="lazy" />
        {isDesktop && (
          <div className="news-item-overlay">
            <div className="news-item-read-more">Read more</div>
          </div>
        )}
      </div>
      <div className="news-item-content">
        <div className="news-item-category">{category}</div>
        <h3 className="news-item-title" dangerouslySetInnerHTML={{ __html: title.rendered }} />
        {cleanExcerpt && <p className="news-item-excerpt">{cleanExcerpt}</p>}
        <div className="news-item-date">{formattedDate}</div>
      </div>
    </TransitionLink>
  );
}

export default ExploreNewsItem;
