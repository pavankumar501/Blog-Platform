import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0, totalLikes: 0 });
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      const [postsRes, catsRes] = await Promise.all([
        axios.get('/api/posts?limit=100'),
        axios.get('/api/categories')
      ]);
      const allPosts = postsRes.data.posts;
      setPosts(allPosts);
      setCategories(catsRes.data);
      setStats({
        totalPosts: allPosts.length,
        totalViews: allPosts.reduce((sum, p) => sum + (p.views || 0), 0),
        totalLikes: allPosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0)
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axios.delete(`/api/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/categories', newCategory);
      setCategories([...categories, res.data]);
      setNewCategory({ name: '', description: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await axios.delete(`/api/categories/${catId}`);
      setCategories(categories.filter(c => c._id !== catId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  const tabs = [
    { id: 'stats', label: 'Overview' },
    { id: 'posts', label: 'Posts' },
    { id: 'categories', label: 'Categories' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 max-w-md">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          {activeTab === 'stats' && (
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Total Views</p>
                <p className="text-3xl font-bold text-primary-600">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Total Likes</p>
                <p className="text-3xl font-bold text-red-500">{stats.totalLikes.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Posts Management */}
          {activeTab === 'posts' && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-semibold text-gray-900">All Posts ({posts.length})</h2>
                <Link to="/write" className="px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-medium hover:bg-primary-600 transition">+ New Post</Link>
              </div>
              <div className="divide-y divide-gray-50">
                {posts.map(post => (
                  <div key={post._id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-4">
                      <Link to={`/posts/${post.slug}`} className="text-sm font-medium text-gray-900 hover:text-primary-600 truncate block">{post.title}</Link>
                      <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                        <span>{post.author?.name}</span>
                        <span>{post.views || 0} views</span>
                        <span>{post.likes?.length || 0} likes</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${post.published ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/write/${post._id}`} className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">Edit</Link>
                      <button onClick={() => handleDeletePost(post._id)} className="px-3 py-1 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Management */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-2xl border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Add Category</h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Category name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-300"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-300"
                  />
                  <button type="submit" className="px-6 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition">Add</button>
                </div>
              </form>

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {categories.map(cat => (
                    <div key={cat._id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                      <div>
                        <Link to={`/category/${cat.slug}`} className="text-sm font-medium text-gray-900 hover:text-primary-600">{cat.name}</Link>
                        <p className="text-xs text-gray-400 mt-0.5">{cat.description} &middot; {cat.postCount} posts</p>
                      </div>
                      <button onClick={() => handleDeleteCategory(cat._id)} className="px-3 py-1 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
