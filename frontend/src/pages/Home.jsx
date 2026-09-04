import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, latest, cats] = await Promise.all([
          axios.get('/api/posts?featured=true&limit=3'),
          axios.get('/api/posts?limit=8'),
          axios.get('/api/categories')
        ]);
        setFeaturedPosts(featured.data.posts);
        setLatestPosts(latest.data.posts);
        setCategories(cats.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Share Your Story<br />with the World
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed">
              BlogHub is a community of writers, thinkers, and creators sharing ideas that matter.
              Discover stories about technology, travel, food, health, and everything in between.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/posts" className="px-8 py-3 bg-white text-primary-600 rounded-full font-semibold hover:bg-primary-50 transition shadow-lg">
                Start Reading
              </Link>
              <Link to="/write" className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition">
                Write a Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Stories</h2>
            <Link to="/posts" className="text-primary-500 hover:text-primary-600 text-sm font-medium">See all &rarr;</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post, i) => (
              <PostCard key={post._id} post={post} featured={i === 0} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Stories</h2>
            <Link to="/posts" className="text-primary-500 hover:text-primary-600 text-sm font-medium">View all &rarr;</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestPosts.slice(0, 8).map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Explore Topics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className="group p-6 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition text-center"
            >
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 transition">
                <span className="text-xl">
                  {cat.name === 'Technology' && '💻'}
                  {cat.name === 'Lifestyle' && '🌿'}
                  {cat.name === 'Travel' && '✈️'}
                  {cat.name === 'Food' && '🍽️'}
                  {cat.name === 'Health' && '🧘'}
                  {cat.name === 'Business' && '💼'}
                  {cat.name === 'Education' && '📚'}
                  {cat.name === 'Entertainment' && '🎬'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{cat.postCount} posts</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to share your story?</h2>
          <p className="text-primary-100 mb-8 text-lg">Join thousands of writers on BlogHub and reach readers around the world.</p>
          <Link to="/register" className="inline-block px-8 py-3 bg-white text-primary-600 rounded-full font-semibold hover:bg-primary-50 transition shadow-lg">
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
