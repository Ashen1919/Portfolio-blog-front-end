import { useState } from 'react';
import { RiSearchLine, RiArticleLine } from 'react-icons/ri';
import useFetch from '../hooks/useFetch';
import BlogCard from '../components/BlogCard';
import Spinner from '../components/Spinner';

/* ── Pagination controls ─────────────────────────────────────────────────────── */
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        id="pagination-prev-btn"
        className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white
                   hover:border-primary-500/40 disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all duration-200 text-sm"
      >
        ← Prev
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i)}
          id={`pagination-page-${i + 1}-btn`}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
            i === page
              ? 'bg-primary-600 text-white shadow-glow-sm'
              : 'border border-white/10 text-gray-400 hover:text-white hover:border-primary-500/40'
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        id="pagination-next-btn"
        className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white
                   hover:border-primary-500/40 disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all duration-200 text-sm"
      >
        Next →
      </button>
    </nav>
  );
};

const PAGE_SIZE = 20;

const Blog = () => {
  const [page,   setPage]   = useState(0);
  const [search, setSearch] = useState('');

  // Spring Boot endpoint: GET /api/posts?page=0&size=9
  // Adjust 'size' / field names to match your Page<PostDTO> response
  const { data, loading, error, refetch } = useFetch('/api/posts/allPosts', { page, size: PAGE_SIZE });

  // Normalise response — Spring Boot Page object or plain array
  const posts      = Array.isArray(data) ? data : data?.content      ?? [];
  const totalPages = Array.isArray(data) ? 1    : data?.totalPages   ?? 1;
  const totalPosts = Array.isArray(data) ? posts.length : data?.totalElements ?? posts.length;

  // Client-side search filter
  const filtered = search.trim()
    ? posts.filter(
        (p) =>
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          (p.content || p.body || '').toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch({ page: newPage, size: PAGE_SIZE });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <span className="tag mb-4 inline-block">All Posts</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Explore the Blog
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">
            {totalPosts > 0
              ? `${totalPosts} article${totalPosts !== 1 ? 's' : ''} covering a wide range of topics`
              : 'Browse all articles'}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md mb-12">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
          <input
            type="search"
            id="blog-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts…"
            aria-label="Search posts"
            className="form-input pl-11"
          />
        </div>

        {/* States */}
        {loading && (
          <div className="flex justify-center py-32">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <div className="text-center py-32">
            <RiArticleLine className="mx-auto text-5xl text-gray-700 mb-4" />
            <p className="text-xl text-gray-400 mb-2">Failed to load posts</p>
            <p className="text-sm text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => refetch({ page, size: PAGE_SIZE })}
              className="btn-primary"
              id="blog-retry-btn"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32">
                <RiArticleLine className="mx-auto text-5xl text-gray-700 mb-4" />
                <p className="text-xl text-gray-400">
                  {search ? `No posts found for "${search}"` : 'No posts yet'}
                </p>
              </div>
            )}

            {!search && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
