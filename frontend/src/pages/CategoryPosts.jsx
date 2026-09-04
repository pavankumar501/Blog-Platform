import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';

export default function CategoryPosts() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      const [postsRes, catRes] = await Promise.all([
        axios.get(`/api/posts?category=${slug}`),
        axios.get(`/api/categories/${slug}`)
      ]);
      setPosts(postsRes.data.posts);
      setCategory(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <Link to="/posts" className="text-primary-500 hover:text-primary-600 text-sm font-medium">&larr; All Stories</Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">{category?.name || 'Category'}</h1>
        {category?.description && <p className="text-gray-500 mt-2">{category.description}</p>}
        <p className="text-gray-400 text-sm mt-2">{posts.length} stories</p>
      </div>

      {posts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No stories in this category yet</p>
          <Link to="/write" className="text-primary-500 hover:text-primary-600 text-sm font-medium mt-2 inline-block">Write the first one!</Link>
        </div>
      )}
    </div>
  );
}
