import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments/post/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to load comments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setLoading(true);
    try {
      await axios.post('/api/comments', {
        postId,
        content: content.trim(),
        parentComment: replyTo
      });
      setContent('');
      setReplyTo(null);
      fetchComments();
    } catch (err) {
      console.error('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`/api/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error('Failed to delete');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const CommentItem = ({ comment, depth = 0 }) => (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="bg-white rounded-xl p-4 mb-3 border border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 text-sm font-medium">{comment.author?.name?.charAt(0)}</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900">{comment.author?.name}</span>
              <span className="text-xs text-gray-400 ml-2">{formatDate(comment.createdAt)}</span>
            </div>
          </div>
          {user && (user._id === comment.author?._id || user.role === 'admin') && (
            <button onClick={() => handleDelete(comment._id)} className="text-gray-400 hover:text-red-500 text-xs">Delete</button>
          )}
        </div>
        <p className="text-gray-700 text-sm mt-3 leading-relaxed">{comment.content}</p>
        {user && depth === 0 && (
          <button onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)} className="text-xs text-primary-500 hover:text-primary-600 mt-2 font-medium">
            {replyTo === comment._id ? 'Cancel reply' : 'Reply'}
          </button>
        )}
      </div>
      {comment.replies?.map(reply => (
        <CommentItem key={reply._id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {replyTo && (
            <div className="flex items-center justify-between bg-primary-50 rounded-lg px-4 py-2 mb-3">
              <span className="text-sm text-primary-600">Replying to a comment</span>
              <button type="button" onClick={() => setReplyTo(null)} className="text-xs text-primary-400 hover:text-primary-600">Cancel</button>
            </div>
          )}
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary-600 text-sm font-medium">{user.name?.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-300 resize-none transition"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!content.trim() || loading}
                  className="px-5 py-2 bg-primary-500 text-white text-sm font-medium rounded-full hover:bg-primary-600 disabled:opacity-50 transition"
                >
                  {loading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-gray-500 text-sm mb-8 bg-gray-50 rounded-xl p-4 text-center">
          <a href="/login" className="text-primary-500 hover:text-primary-600 font-medium">Log in</a> to leave a comment
        </p>
      )}

      <div className="space-y-1">
        {comments.map(comment => (
          <CommentItem key={comment._id} comment={comment} />
        ))}
        {comments.length === 0 && (
          <p className="text-center text-gray-400 py-8">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
}
