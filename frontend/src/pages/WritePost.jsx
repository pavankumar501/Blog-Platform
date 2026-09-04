import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function WritePost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', featuredImage: '', category: '', tags: '', published: true
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadCategories();
    if (id) loadPost();
  }, [id, user]);

  const loadCategories = async () => {
    const res = await axios.get('/api/categories');
    setCategories(res.data);
  };

  const loadPost = async () => {
    try {
      const res = await axios.get(`/api/posts`);
      const post = res.data.posts.find(p => p._id === id);
      if (post) {
        setForm({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || '',
          featuredImage: post.featuredImage || '',
          category: post.category?._id || '',
          tags: post.tags?.join(', ') || '',
          published: post.published
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      if (id) {
        await axios.put(`/api/posts/${id}`, payload);
      } else {
        const res = await axios.post('/api/posts', payload);
        navigate(`/posts/${res.data.slug}`);
        return;
      }
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{id ? 'Edit Story' : 'Write a New Story'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Story title..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 bg-transparent border-none focus:outline-none focus:ring-0"
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-300"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="React, JavaScript, Web Dev"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={form.featuredImage}
            onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea
            rows={2}
            placeholder="Brief description of your story..."
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-300 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML supported)</label>
          <textarea
            rows={20}
            placeholder="Write your story here... HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt; are supported."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-300 resize-y min-h-[400px] font-mono"
            required
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4 text-primary-500 rounded focus:ring-primary-300"
            />
            <span className="text-sm text-gray-700">Publish immediately</span>
          </label>
          <div className="flex space-x-3">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-primary-500 text-white rounded-full text-sm font-medium hover:bg-primary-600 disabled:opacity-50 transition"
            >
              {loading ? 'Saving...' : id ? 'Update Story' : 'Publish Story'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
