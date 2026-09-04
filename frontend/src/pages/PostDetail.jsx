import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`/api/posts/${slug}`);
      setPost(res.data);
      setLikeCount(res.data.likes?.length || 0);
      if (user) {
        setLiked(res.data.likes?.includes(user._id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await axios.post(`/api/posts/${post._id}/like`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axios.delete(`/api/posts/${post._id}`);
      window.location.href = '/posts';
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
        <Link to="/posts" className="text-primary-500 hover:text-primary-600 mt-4 inline-block">Browse all posts</Link>
      </div>
    );
  }

  const readTime = Math.max(1, Math.ceil(post.content?.replace(/<[^>]*>/g, '').split(/\s+/).length / 200));
  const date = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <article className="animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {post.category && (
            <Link to={`/category/${post.category.slug}`} className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full mb-4 hover:bg-primary-100 transition">
              {post.category.name}
            </Link>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">{post.title}</h1>
          <p className="text-lg text-gray-500 mb-6">{post.excerpt}</p>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium">{post.author?.name?.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{post.author?.name}</p>
                <p className="text-xs text-gray-400">{date} &middot; {readTime} min read &middot; {post.views} views</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLike}
                disabled={!user}
                className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition ${liked ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <svg className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} viewBox="0 0 20 20" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>{likeCount}</span>
              </button>
              {user && (user._id === post.author?._id || user.role === 'admin') && (
                <div className="flex space-x-2">
                  <Link to={`/write/${post._id}`} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition">Edit</Link>
                  <button onClick={handleDelete} className="px-3 py-2 bg-red-50 text-red-500 rounded-full text-sm hover:bg-red-100 transition">Delete</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <img src={post.featuredImage} alt={post.title} className="w-full rounded-2xl shadow-lg object-cover max-h-[500px]" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="prose text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
            {post.tags.map(tag => (
              <Link key={tag} to={`/posts?search=${encodeURIComponent(tag)}`} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-primary-50 hover:text-primary-600 transition">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Author Box */}
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 text-xl font-bold">{post.author?.name?.charAt(0)}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Written by</p>
              <p className="font-bold text-gray-900">{post.author?.name}</p>
              {post.author?.bio && <p className="text-sm text-gray-500 mt-1">{post.author.bio}</p>}
            </div>
          </div>
        </div>

        {/* Comments */}
        <CommentSection postId={post._id} />
      </div>
    </article>
  );
}
