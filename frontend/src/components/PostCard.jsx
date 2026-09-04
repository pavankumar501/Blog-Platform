import { Link } from 'react-router-dom';

export default function PostCard({ post, featured = false }) {
  const readTime = Math.max(1, Math.ceil(post.content?.replace(/<[^>]*>/g, '').split(/\s+/).length / 200));
  const date = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (featured) {
    return (
      <Link to={`/posts/${post.slug}`} className="group block">
        <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="aspect-video relative overflow-hidden">
            <img
              src={post.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {post.category && (
                <span className="inline-block px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full mb-3">
                  {post.category.name}
                </span>
              )}
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-primary-200 transition">{post.title}</h2>
              <p className="text-gray-200 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <span className="font-medium">{post.author?.name}</span>
                <span>&middot;</span>
                <span>{date}</span>
                <span>&middot;</span>
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/posts/${post.slug}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
        <div className="aspect-video overflow-hidden">
          <img
            src={post.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center space-x-2 mb-3">
            {post.category && (
              <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                {post.category.name}
              </span>
            )}
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-600 transition line-clamp-2">{post.title}</h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 text-xs font-medium">{post.author?.name?.charAt(0)}</span>
              </div>
              <span className="font-medium text-gray-600">{post.author?.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span>{date}</span>
              <span>{readTime} min</span>
              {post.likes && post.likes.length > 0 && (
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 text-red-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  {post.likes.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
