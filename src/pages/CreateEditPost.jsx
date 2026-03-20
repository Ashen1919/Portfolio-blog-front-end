import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
  RiSaveLine, RiArrowLeftLine,
  RiBold, RiItalic, RiUnderline, RiStrikethrough,
  RiH1, RiH2, RiH3,
  RiListUnordered, RiListOrdered,
  RiDoubleQuotesL, RiCodeLine, RiCodeBoxLine,
  RiAlignLeft, RiAlignCenter, RiAlignRight,
  RiImageAddLine, RiSeparator, RiCloseLine,
} from 'react-icons/ri';
import axiosInstance from '../api/axiosInstance';
import Spinner from '../components/Spinner';

// ── Toolbar Button ─────────────────────────────────────────────────────────────
const ToolbarBtn = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded text-sm transition-colors duration-150
      ${active
        ? 'bg-primary-600 text-white'
        : 'text-gray-400 hover:text-white hover:bg-white/10'}
      disabled:opacity-30 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

// ── Editor Toolbar ─────────────────────────────────────────────────────────────
const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) =>
        editor.chain().focus().setImage({ src: ev.target.result }).run();
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-white/10 bg-dark-800 rounded-t-xl">
      <ToolbarBtn title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}><RiH1 /></ToolbarBtn>
      <ToolbarBtn title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}><RiH2 /></ToolbarBtn>
      <ToolbarBtn title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}><RiH3 /></ToolbarBtn>
      <div className="w-px h-5 bg-white/10 mx-1" />
      <ToolbarBtn title="Bold"          onClick={() => editor.chain().focus().toggleBold().run()}        active={editor.isActive('bold')}      ><RiBold /></ToolbarBtn>
      <ToolbarBtn title="Italic"        onClick={() => editor.chain().focus().toggleItalic().run()}      active={editor.isActive('italic')}    ><RiItalic /></ToolbarBtn>
      <ToolbarBtn title="Underline"     onClick={() => editor.chain().focus().toggleUnderline().run()}   active={editor.isActive('underline')} ><RiUnderline /></ToolbarBtn>
      <ToolbarBtn title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()}      active={editor.isActive('strike')}    ><RiStrikethrough /></ToolbarBtn>
      <div className="w-px h-5 bg-white/10 mx-1" />
      <ToolbarBtn title="Align left"   onClick={() => editor.chain().focus().setTextAlign('left').run()}   active={editor.isActive({ textAlign: 'left' })}  ><RiAlignLeft /></ToolbarBtn>
      <ToolbarBtn title="Align center" onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })}><RiAlignCenter /></ToolbarBtn>
      <ToolbarBtn title="Align right"  onClick={() => editor.chain().focus().setTextAlign('right').run()}  active={editor.isActive({ textAlign: 'right' })} ><RiAlignRight /></ToolbarBtn>
      <div className="w-px h-5 bg-white/10 mx-1" />
      <ToolbarBtn title="Bullet list"  onClick={() => editor.chain().focus().toggleBulletList().run()}  active={editor.isActive('bulletList')} ><RiListUnordered /></ToolbarBtn>
      <ToolbarBtn title="Ordered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}><RiListOrdered /></ToolbarBtn>
      <div className="w-px h-5 bg-white/10 mx-1" />
      <ToolbarBtn title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}><RiDoubleQuotesL /></ToolbarBtn>
      <ToolbarBtn title="Inline code" onClick={() => editor.chain().focus().toggleCode().run()}      active={editor.isActive('code')}      ><RiCodeLine /></ToolbarBtn>
      <ToolbarBtn title="Code block"  onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} ><RiCodeBoxLine /></ToolbarBtn>
      <ToolbarBtn title="Divider"     onClick={() => editor.chain().focus().setHorizontalRule().run()}                                     ><RiSeparator /></ToolbarBtn>
      <div className="w-px h-5 bg-white/10 mx-1" />
      <ToolbarBtn title="Insert image" onClick={insertImage}><RiImageAddLine /></ToolbarBtn>
    </div>
  );
};

// ── Tag Picker ─────────────────────────────────────────────────────────────────
const TagPicker = ({ allTags, selectedIds, onChange }) => {
  const toggle = (id) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((t) => t !== id)
        : [...selectedIds, id]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allTags.map((tag) => {
        const selected = selectedIds.includes(tag.id);
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.id)}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                        border transition-all duration-150
                        ${selected
                          ? 'bg-primary-600 border-primary-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-primary-500 hover:text-primary-300'}`}
          >
            {selected && <RiCloseLine className="text-xs" />}
            #{tag.name}
          </button>
        );
      })}
      {allTags.length === 0 && (
        <p className="text-xs text-gray-600 italic">No tags available</p>
      )}
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────
const CreateEditPost = ({ mode = 'create' }) => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', categoryId: '', tagIds: [] });
  const [categories, setCategories] = useState([]);
  const [allTags,    setAllTags]    = useState([]);
  const [fetching,   setFetching]   = useState(true);
  const [saving,     setSaving]     = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder: 'Start writing your story here…' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[400px] px-4 py-3 focus:outline-none text-gray-300',
      },
    },
  });

  // ── Fetch categories, tags, and (if editing) the post ────────────────────────
  useEffect(() => {
    if (!editor) return;

    const loadFormData = async () => {
      try {
        // Always fetch categories and tags
        const [catRes, tagRes] = await Promise.all([
          axiosInstance.get('/categories'),
          axiosInstance.get('/tags'),
        ]);
        setCategories(catRes.data);
        setAllTags(tagRes.data);

        // If editing, also fetch the post
        if (mode === 'edit' && id) {
          const { data } = await axiosInstance.get(`/posts/${id}`);
          setForm({
            title:      data.title           || '',
            categoryId: data.category?.id    || '',
            tagIds:     data.tags?.map(t => t.id) || [],
          });
          editor.commands.setContent(data.content || '');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load form data');
        if (mode === 'edit') navigate('/blog');
      } finally {
        setFetching(false);
      }
    };

    loadFormData();
  }, [editor, id, mode, navigate]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required');    return; }
    if (editor.isEmpty)     { toast.error('Content is required');  return; }
    if (!form.categoryId)   { toast.error('Category is required'); return; }

    const payload = {
      title:      form.title,
      content:    editor.getHTML(),
      categoryId: Number(form.categoryId),
      tagIds:     form.tagIds,              // already List<Long>
    };

    setSaving(true);
    const toastId = toast.loading(mode === 'edit' ? 'Updating post…' : 'Publishing post…');
    try {
      if (mode === 'edit') {
        await axiosInstance.put(`/posts/${id}`, payload);
        toast.success('Post updated! ✏️', { id: toastId });
        navigate(`/blog/${id}`);
      } else {
        const { data } = await axiosInstance.post('/posts', payload);
        toast.success('Post published! 🚀', { id: toastId });
        navigate(`/blog/${data.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong', { id: toastId });
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

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium text-gray-300 mb-1.5">
              Post Title *
            </label>
            <input
              id="post-title" type="text" name="title"
              value={form.title} onChange={handleChange}
              placeholder="An eye-catching headline…" required
              className="form-input text-lg font-display"
            />
          </div>

          {/* Category — dropdown from API */}
          <div>
            <label htmlFor="post-category" className="block text-sm font-medium text-gray-300 mb-1.5">
              Category *
            </label>
            <select
              id="post-category"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              className="form-input bg-dark-800"
            >
              <option value="" disabled>Select a category…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags — pill multi-select */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags <span className="text-gray-600">(optional)</span>
            </label>
            <TagPicker
              allTags={allTags}
              selectedIds={form.tagIds}
              onChange={(tagIds) => setForm((f) => ({ ...f, tagIds }))}
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Content *
            </label>
            <div className="rounded-xl border border-white/10 bg-dark-800 overflow-hidden">
              <EditorToolbar editor={editor} />
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit" disabled={saving}
              className="btn-primary px-8 py-3 text-base inline-flex items-center gap-2
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RiSaveLine />
              {saving
                ? mode === 'edit' ? 'Updating…' : 'Publishing…'
                : mode === 'edit' ? 'Save Changes' : 'Publish Post'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-6 py-3 text-base">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEditPost;