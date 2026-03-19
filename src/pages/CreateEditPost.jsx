import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { RiSaveLine, RiArrowLeftLine } from 'react-icons/ri';
import axiosInstance from '../api/axiosInstance';
import Spinner from '../components/Spinner';

/**
 * CreateEditPost — handles both creating and editing a blog post.
 * Used for:
 *   POST  /api/posts          (create — mode="create")
 *   PUT   /api/posts/{id}     (update — mode="edit", route expects :id param)
 */
const CreateEditPost = ({ mode = 'create' }) => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ title: '', content: '', category: '' });
  const [fetching, setFetching] = useState(mode === 'edit');
  const [saving, setSaving]     = useState(false);

  /* Load existing post when editing */
  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    setFetching(true);
    axiosInstance
      .get(`/posts/${id}`)
      .then(({ data }) => {
        setForm({
          title:    data.title    || '',
          content:  data.content  || data.body || '',
          category: data.category || data.tag  || '',
        });
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Could not load post';
        toast.error(msg);
        navigate('/blog');
      })
      .finally(() => setFetching(false));
  }, [id, mode, navigate]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim())   { toast.error('Title is required');   return; }
    if (!form.content.trim()) { toast.error('Content is required'); return; }

    setSaving(true);
    const toastId = toast.loading(mode === 'edit' ? 'Updating post…' : 'Publishing post…');
    try {
      if (mode === 'edit') {
        // Spring Boot endpoint: PUT /api/posts/{id}
        await axiosInstance.put(`/posts/${id}`, form);
        toast.success('Post updated! ✏️', { id: toastId });
        navigate(`/blog/${id}`);
      } else {
        // Spring Boot endpoint: POST /api/posts
        const { data } = await axiosInstance.post('/posts', form);
        toast.success('Post published! 🚀', { id: toastId });
        navigate(`/blog/${data.id || ''}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      toast.error(msg, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (fetching) return <Spinner fullPage />;

  return (
    <div className="min-h-screen bg-dark-900 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <button
          id="createpost-back-btn"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-400 text-sm
                     font-medium transition-colors duration-200 mb-10 group"
        >
          <RiArrowLeftLine className="transition-transform group-hover:-translate-x-1" />
          {mode === 'edit' ? 'Back to post' : 'Back to blog'}
        </button>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-10">
          {mode === 'edit' ? 'Edit Post' : 'Write a New Post'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6" id="createpost-form">
          {/* Title */}
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium text-gray-300 mb-1.5">
              Post Title *
            </label>
            <input
              id="post-title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="An eye-catching headline…"
              required
              className="form-input text-lg font-display"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="post-category" className="block text-sm font-medium text-gray-300 mb-1.5">
              Category <span className="text-gray-600">(optional)</span>
            </label>
            <input
              id="post-category"
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Technology, Travel, Opinion…"
              className="form-input"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="post-content" className="block text-sm font-medium text-gray-300 mb-1.5">
              Content *
            </label>
            <textarea
              id="post-content"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Start writing your story here…"
              required
              rows={18}
              className="form-input resize-y leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              id="createpost-submit-btn"
              disabled={saving}
              className="btn-primary px-8 py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RiSaveLine />
              {saving
                ? mode === 'edit' ? 'Updating…' : 'Publishing…'
                : mode === 'edit' ? 'Save Changes' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary px-6 py-3 text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditPost;
