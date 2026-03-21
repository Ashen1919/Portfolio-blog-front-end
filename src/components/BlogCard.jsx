import { Link } from 'react-router-dom';
import { RiCalendarLine, RiUserLine, RiArrowRightLine, RiTimeLine } from 'react-icons/ri';
import { stripHtml } from '../api/postFormData';

const BlogCard = ({ post, featured = false }) => {
  const id       = post.id;
  const title    = post.title || 'Untitled Post';
  const excerpt  = truncate(stripHtml(post.content || '', 40));
  const author   = post.author?.username || 'Anonymous';
  const category = post.category?.name || 'General';
  const readTime = estimateReadTime(post.content || '');
  const tags     = post.tags || [];
  const rawDate  = post.createdAt;
  const date     = rawDate ? new Date(rawDate).toLocaleDateString('en-US', {
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

        {/* Category + Read time */}
        <div className="flex items-center justify-between mb-3">
          <span className="tag">{category}</span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <RiTimeLine /> {readTime} min read
          </span>
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
        <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">
          {excerpt}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <span
                key={tag.id}
                className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-gray-400 border border-white/10"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

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