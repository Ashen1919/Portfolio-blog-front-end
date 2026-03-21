import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiArticleLine,
  RiEditLine,
  RiDeleteBinLine,
  RiAddLine,
  RiCalendarLine,
  RiTimeLine,
  RiEyeLine,
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import useFetch from '../hooks/useFetch';
import axiosInstance from '../api/axiosInstance';
import Spinner from '../components/Spinner';
import { stripHtml } from '../api/postFormData';

/* ── Pagination (identical style to Blog.jsx) ───────────────────────────────── */
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [...Array(totalPages)].map((_, i) => i);
  const visible =
    totalPages <= 7
      ? pages
      : [
          ...pages.slice(0, Math.min(page + 1, 3)),
          ...(page > 3 ? ['…'] : []),
          ...pages.slice(Math.max(page - 1, 3), Math.min(page + 2, totalPages - 2)),
          ...(page < totalPages - 4 ? ['…'] : []),
          ...pages.slice(totalPages - 2),
        ].filter((v, i, arr) => arr.indexOf(v) === i);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        id="my-posts-pagination-prev-btn"
        className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white
                   hover:border-primary-500/40 disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all duration-200 text-sm"
      >
        ← Prev
      </button>

      {visible.map((v, idx) =>
        v === '…' ? (
          <span key={`ellipsis-${idx}`} className="text-gray-600 px-1">…</span>
        ) : (
          <button
            key={v}
            onClick={() => onPageChange(v)}
            id={`my-posts-pagination-page-${v + 1}-btn`}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
              v === page
                ? 'bg-primary-600 text-white shadow-glow-sm'
                : 'border border-white/10 text-gray-400 hover:text-white hover:border-primary-500/40'
            }`}
          >
            {v + 1}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        id="my-posts-pagination-next-btn"
        className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white
                   hover:border-primary-500/40 disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all duration-200 text-sm"
      >
        Next →
      </button>
    </nav>
  );
};

/* ── Delete-confirm modal ────────────────────────────────────────────────────── */
const DeleteModal = ({ post, onConfirm, onCancel, deleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
    <div className="bg-dark-800 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-rose-500/10 border border-rose-500/20 mb-6 mx-auto">
        <RiDeleteBinLine className="text-2xl text-rose-400" />
      </div>
      <h2 className="font-display text-xl font-bold text-white text-center mb-2">
        Delete Post?
      </h2>
      <p className="text-gray-400 text-sm text-center mb-8 leading-relaxed">
        Are you sure you want to delete{' '}
        <span className="text-white font-medium">"{post.title}"</span>?
        <br />
        <span className="text-rose-400">This action cannot be undone.</span>
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={deleting}
          id="delete-modal-cancel-btn"
          className="btn-secondary flex-1 justify-center disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          id="delete-modal-confirm-btn"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl
                     bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Deleting…
            </>
          ) : (
            <>
              <RiDeleteBinLine />
              Delete
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);

/* ── My-post card (with Edit / Delete CTA) ───────────────────────────────────── */
const MyPostCard = ({ post, onDeleteClick }) => {
  const navigate = useNavigate();

  const title    = post.title || 'Untitled Post';
  const plainText = stripHtml(post.content || '');
  const excerpt  = plainText.length > 220 ? plainText.slice(0, 220).trimEnd() + '…' : plainText;
  const words    = plainText.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 200));
  const category = post.category?.name || 'General';
  const tags     = post.tags || [];
  const rawDate  = post.createdAt;
  const date     = rawDate
    ? new Date(rawDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : null;

  return (
    <article
      className="card flex flex-col group"
      aria-labelledby={`my-post-title-${post.id}`}
    >
      {/* Colour bar */}
      <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-primary-600 via-purple-500 to-accent-500" />

      <div className="flex flex-col flex-1 p-6">
        {/* Category + read time */}
        <div className="flex items-center justify-between mb-3">
          <span className="tag">{category}</span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <RiTimeLine /> {readTime} min read
          </span>
        </div>

        {/* Title */}
        <h2
          id={`my-post-title-${post.id}`}
          className="font-display text-xl font-bold leading-snug text-white
                     group-hover:text-primary-300 transition-colors duration-200 mb-3"
        >
          {title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">{excerpt}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-gray-400 border border-white/10"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Meta row + actions */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 gap-3 flex-wrap">
          {/* Date */}
          {date && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <RiCalendarLine className="text-primary-400" />
              {date}
            </span>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {/* View */}
            <Link
              to={`/blog/${post.id}`}
              id={`my-post-view-${post.id}-btn`}
              title="View post"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                         border border-white/10 text-gray-400 hover:text-white hover:border-primary-500/40
                         transition-all duration-200"
            >
              <RiEyeLine /> View
            </Link>

            {/* Edit */}
            <button
              onClick={() => navigate(`/blog/${post.id}/edit`)}
              id={`my-post-edit-${post.id}-btn`}
              title="Edit post"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                         border border-primary-500/30 text-primary-400 hover:bg-primary-600
                         hover:text-white hover:border-primary-600 transition-all duration-200"
            >
              <RiEditLine /> Edit
            </button>

            {/* Delete */}
            <button
              onClick={() => onDeleteClick(post)}
              id={`my-post-delete-${post.id}-btn`}
              title="Delete post"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                         border border-rose-500/30 text-rose-400 hover:bg-rose-600
                         hover:text-white hover:border-rose-600 transition-all duration-200"
            >
              <RiDeleteBinLine /> Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ── Main page ───────────────────────────────────────────────────────────────── */
const PAGE_SIZE = 9;

const MyPosts = () => {
  const navigate  = useNavigate();
  const [page,    setPage]    = useState(0);
  const [toDelete, setToDelete] = useState(null);   // post object pending deletion
  const [deleting, setDeleting] = useState(false);

  const { data, loading, error, refetch } = useFetch('/api/posts/my-posts', {
    page,
    size: PAGE_SIZE,
  });

  // Normalise Spring Boot Page<> response
  const posts      = Array.isArray(data) ? data : data?.content      ?? [];
  const totalPages = Array.isArray(data) ? 1    : data?.totalPages   ?? 1;
  const totalPosts = Array.isArray(data) ? posts.length : data?.totalElements ?? posts.length;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch({ page: newPage, size: PAGE_SIZE });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const toastId = toast.loading('Deleting post…');
    try {
      await axiosInstance.delete(`/api/posts/${toDelete.id}`);
      toast.success('Post deleted successfully 🗑️', { id: toastId });
      setToDelete(null);
      // If we just deleted the last post on a page > 0, go back one page
      const newPage = posts.length === 1 && page > 0 ? page - 1 : page;
      setPage(newPage);
      refetch({ page: newPage, size: PAGE_SIZE });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post', {
        id: toastId,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-28 pb-20">
      {/* Delete confirmation modal */}
      {toDelete && (
        <DeleteModal
          post={toDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setToDelete(null)}
          deleting={deleting}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <span className="tag mb-4 inline-block">My Posts</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
              Your Stories
            </h1>
            <p className="text-gray-400 text-lg">
              {loading
                ? 'Loading your posts…'
                : totalPosts > 0
                  ? `${totalPosts} post${totalPosts !== 1 ? 's' : ''} you've written`
                  : "You haven't written anything yet"}
            </p>
          </div>

          {/* Write new post CTA */}
          <Link
            to="/blog/create"
            id="my-posts-create-btn"
            className="btn-primary self-start sm:self-auto inline-flex items-center gap-2 text-sm px-5 py-2.5 whitespace-nowrap"
          >
            <RiAddLine className="text-base" />
            Write a Post
          </Link>
        </div>

        {/* ── Loading ───────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex justify-center py-32">
            <Spinner size="lg" />
          </div>
        )}

        {/* ── Error ─────────────────────────────────────────────────────── */}
        {error && (
          <div className="text-center py-32">
            <RiArticleLine className="mx-auto text-5xl text-gray-700 mb-4" />
            <p className="text-xl text-gray-400 mb-2">Failed to load your posts</p>
            <p className="text-sm text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => refetch({ page, size: PAGE_SIZE })}
              className="btn-primary"
              id="my-posts-retry-btn"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Content ───────────────────────────────────────────────────── */}
        {!loading && !error && (
          <>
            {posts.length > 0 ? (
              <>
                {/* Stats bar */}
                <div className="flex items-center gap-3 mb-8 text-sm text-gray-500">
                  <span>
                    Page{' '}
                    <span className="text-primary-400 font-medium">{page + 1}</span>{' '}
                    of{' '}
                    <span className="text-primary-400 font-medium">{totalPages}</span>
                  </span>
                  <span className="text-white/10">|</span>
                  <span>
                    Showing{' '}
                    <span className="text-white font-medium">{posts.length}</span>{' '}
                    of{' '}
                    <span className="text-white font-medium">{totalPosts}</span>{' '}
                    posts
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <MyPostCard
                      key={post.id}
                      post={post}
                      onDeleteClick={setToDelete}
                    />
                  ))}
                </div>

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              /* ── Empty state ──────────────────────────────────────────── */
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div
                  className="w-24 h-24 rounded-2xl bg-primary-600/10 border border-primary-500/20
                                flex items-center justify-center mb-6"
                >
                  <RiArticleLine className="text-4xl text-primary-400" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white mb-3">
                  No posts yet
                </h2>
                <p className="text-gray-400 max-w-sm mb-8 text-sm leading-relaxed">
                  You haven't published any posts yet. Share your ideas, stories, or
                  expertise with the world!
                </p>
                <Link
                  to="/blog/create"
                  id="my-posts-empty-create-btn"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <RiAddLine />
                  Write Your First Post
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
