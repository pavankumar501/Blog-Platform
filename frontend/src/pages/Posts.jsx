import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';

export default function Posts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || '-createdAt';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', currentPage);
        params.set('limit', '12');
        if (currentCategory) params.set('category', currentCategory);
        if (currentSearch) params.set('search', currentSearch);
        params.set('sort', currentSort);

        const [postsRes, catsRes] = await Promise.all([
          axios.get(`/api/posts?${params.toString()}`),
          axios.get('/api/categories')
        ]);
        setPosts(postsRes.data.posts);
        setTotal(postsRes.data.total);
        setPages(postsRes.data.pages);
        setCategories(catsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, currentCategory, currentSearch, currentSort]);

  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => updateParams('category', '')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${!currentCategory ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  All Topics
                </button>
                {categories.map(cat => (
                  <button
                    key={cat._id}
                    onClick={() => updateParams('category', cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex justify-between ${currentCategory === cat.slug ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-gray-400 text-xs">{cat.postCount}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Sort by</h3>
              <select
                value={currentSort}
                onChange={(e) => updateParams('sort', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-300"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="-views">Most Viewed</option>
                <option value="-likes">Most Liked</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentSearch ? `Results for "${currentSearch}"` : currentCategory ? categories.find(c => c.slug === currentCategory)?.name || 'Posts' : 'All Stories'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{total} stories found</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-500"></div>
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              {pages > 1 && (
                <div className="flex justify-center space-x-2 mt-8">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => updateParams('page', page.toString())}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition ${currentPage === page ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No stories found</p>
              <Link to="/" className="text-primary-500 hover:text-primary-600 text-sm font-medium mt-2 inline-block">Go back home</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
