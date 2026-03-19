import { Link } from 'react-router-dom';
import { RiCalendarLine, RiUserLine, RiArrowRightLine, RiTimeLine } from 'react-icons/ri';

/**
 * BlogCard — renders a single post card
 *
 * Props:
 *  post: {
 *    id, title, content/excerpt/body, author/authorName, createdAt/publishedAt,
 *    category/tag, readTime
 *  }
 *
 * Adjust field names below to match your Spring Boot Post DTO.
 */
const BlogCard = ({ post, featured = false }) => {
  // ── Normalise field names from Spring Boot DTO ────────────────────────────
  const id        = post.id;
  const title     = post.title     || 'Untitled Post';
  // excerpt: use dedicated field or truncate content/body
  const excerpt   = post.excerpt   || post.summary || truncate(post.content || post.body || '', 150);
  const author    = post.author    || post.authorName || post.username || 'Anonymous';
  const category  = post.category  || post.tag        || 'General';
  const readTime  = post.readTime  || estimateReadTime(post.content || post.body || '');
  // date
  const rawDate   = post.createdAt || post.publishedAt || post.date;
  const date      = rawDate ? new Date(rawDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }) : null;

  return (
    <article
      className={`card group flex flex-col ${featured ? 'md:flex-row md:items-stretch' : ''}`}
      aria-labelledby={`post-title-${id}`}
    >
      {/* Colour bar accent */}
      <div className={`h-1 w-full rounded-t-2xl bg-gradient-to-r from-primary-600 via-purple-500 to-accent-500
                       ${featured ? 'md:h-auto md:w-1 md:rounded-l-2xl md:rounded-tr-none' : ''}`} />

      <div className="flex flex-col flex-1 p-6">
        {/* Category tag */}
        <div className="flex items-center justify-between mb-3">
          <span className="tag">{category}</span>
          {readTime && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <RiTimeLine /> {readTime} min read
            </span>
          )}
        </div>

        {/* Title */}
        <h2
          id={`post-title-${id}`}
          className={`font-display font-bold leading-snug text-white group-hover:text-primary-300
                      transition-colors duration-200 mb-3
                      ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}
        >
          {title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-5">
          {excerpt}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <RiUserLine className="text-primary-400" />
              {author}
            </span>
            {date && (
              <span className="flex items-center gap-1.5">
                <RiCalendarLine className="text-primary-400" />
                {date}
              </span>
            )}
          </div>

          <Link
            to={`/blog/${id}`}
            aria-label={`Read more: ${title}`}
            className="flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm font-medium
                       transition-all duration-200 group/link"
          >
            Read more
            <RiArrowRightLine className="transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
const truncate = (text, len) =>
  text.length > len ? text.slice(0, len).trimEnd() + '…' : text;

const estimateReadTime = (text) => {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

export default BlogCard;
