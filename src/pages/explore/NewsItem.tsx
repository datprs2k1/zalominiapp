import TransitionLink from '@/components/transition-link';

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

  return (
    <TransitionLink to={`/news/${id}`} className="news-item">
      <div className="news-item-image">
        <img src={featuredImageUrl} alt={title.rendered || 'News thumbnail'} loading="lazy" />
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
