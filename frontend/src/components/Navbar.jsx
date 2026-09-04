import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/posts?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">BlogHub</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-full text-sm focus:outline-none focus:border-primary-300 focus:bg-white transition"
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/write" className="px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-medium hover:bg-primary-600 transition">
                  Write
                </Link>
                <div className="relative">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary-500">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">{user.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Profile</Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
                      )}
                      <hr className="my-1" />
                      <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-500">Log in</Link>
                <Link to="/register" className="px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-medium hover:bg-primary-600 transition">Get started</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <form onSubmit={handleSearch} className="mb-3">
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm" />
            </form>
            {user ? (
              <div className="space-y-2">
                <Link to="/write" className="block px-3 py-2 bg-primary-500 text-white rounded-lg text-center text-sm" onClick={() => setMenuOpen(false)}>Write</Link>
                <Link to="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setMenuOpen(false)}>Profile</Link>
                {user.role === 'admin' && <Link to="/admin" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setMenuOpen(false)}>Admin</Link>}
                <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setMenuOpen(false)}>Log in</Link>
                <Link to="/register" className="block px-3 py-2 bg-primary-500 text-white rounded-lg text-center text-sm" onClick={() => setMenuOpen(false)}>Get started</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
