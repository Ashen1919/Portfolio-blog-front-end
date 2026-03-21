import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  RiArrowLeftLine,
  RiCalendarLine,
  RiUserLine,
  RiTimeLine,
  RiEditLine,
  RiDeleteBinLine,
} from 'react-icons/ri';
import useFetch from '../hooks/useFetch';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const BlogDetail = () => {
  const { id }                        = useParams();
  const navigate                      = useNavigate();
  const { isAuthenticated, user }     = useAuth();
  const [deleting, setDeleting]       = useState(false);

  // Spring Boot endpoint: GET /api/posts/{id}
  const { data: post, loading, error } = useFetch(`/api/posts/${id}`);

  if (loading) return <Spinner fullPage />;

  if (error || !post) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4 pt-20">
        <p className="text-xl text-gray-400">{error || 'Post not found'}</p>
        <Link to="/blog" className="btn-secondary">← Back to Blog</Link>
      </div>
    );
  }

  /* ── Normalise fields from Spring Boot PostDTO ─────────────────────────── */
  const title     = post.title     || 'Untitled';
  const content   = post.content   || post.body    || '';
  const author    = post.author    || post.authorName || post.username || 'Anonymous';
  const authorId  = post.authorId  || post.userId;
  const category  = post.category  || post.tag     || 'General';
  const rawDate   = post.createdAt || post.publishedAt || post.date;
  const date      = rawDate
    ? new Date(rawDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const readTime  = Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));

  /* ── Ownership check: show edit/delete only if user is the author ──────── */
  const isOwner = isAuthenticated && (user?.username === author || user?.id === authorId || user?.sub === author);

  /* ── Delete handler ────────────────────────────────────────────────────── */
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeleting(true);
    try {
      // Spring Boot endpoint: DELETE /api/posts/{id}
      await axiosInstance.delete(`/posts/${id}`);
      toast.success('Post deleted successfully');
      navigate('/blog');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete post';
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <Link
          to="/blog"
          id="blogdetail-back-btn"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-400 text-sm
                     font-medium transition-colors duration-200 mb-10 group"
        >
          <RiArrowLeftLine className="transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Link>

        {/* Article header */}
        <article>
          <header className="mb-10">
            <span className="tag mb-4 inline-block">{category}</span>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              {title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 pb-6 border-b border-white/5">
              <span className="flex items-center gap-1.5">
                <RiUserLine className="text-primary-400" />
                <span className="text-gray-300 font-medium">{author}</span>
              </span>
              {date && (
                <span className="flex items-center gap-1.5">
                  <RiCalendarLine className="text-primary-400" />
                  {date}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <RiTimeLine className="text-primary-400" />
                {readTime} min read
              </span>

              {/* Owner actions */}
              {isOwner && (
                <div className="ml-auto flex items-center gap-2">
                  <Link
                    to={`/blog/${id}/edit`}
                    id="blogdetail-edit-btn"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary-500/30
                               text-primary-400 hover:bg-primary-500/10 text-xs font-medium transition-all"
                  >
                    <RiEditLine /> Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    id="blogdetail-delete-btn"
                    className="btn-danger text-xs py-1.5 px-3"
                  >
                    {deleting ? 'Deleting…' : <><RiDeleteBinLine /> Delete</>}
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div
            className="prose prose-invert prose-lg max-w-none
                       prose-headings:font-display prose-headings:text-white
                       prose-p:text-gray-300 prose-p:leading-relaxed
                       prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-white prose-code:text-primary-300
                       prose-code:bg-dark-600 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                       prose-blockquote:border-primary-500 prose-blockquote:text-gray-400"
          >
            {/* If content is HTML render as innerHTML, else render as plain text paragraphs */}
            {content.startsWith('<') ? (
              // eslint-disable-next-line react/no-danger
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              content.split('\n').map((para, i) =>
                para.trim() ? <p key={i}>{para}</p> : <br key={i} />
              )
            )}
          </div>

          {/* Author card */}
          <div className="mt-16 glass p-6 flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-700 flex items-center justify-center text-white text-xl font-bold font-display">
              {author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Written by</p>
              <p className="text-white font-semibold">{author}</p>
              <p className="text-gray-400 text-sm mt-1">
                Thank you for reading. Stay curious and keep learning.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
