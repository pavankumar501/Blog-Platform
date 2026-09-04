const express = require('express');
const Comment = require('../models/Comment');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, parentComment: null })
      .populate('author', 'name avatar')
      .sort('-createdAt');
    const allComments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name avatar')
      .sort('-createdAt');
    const commentTree = comments.map(comment => {
      const replies = allComments.filter(c => c.parentComment && c.parentComment.toString() === comment._id.toString());
      return { ...comment.toObject(), replies };
    });
    res.json(commentTree);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { postId, content, parentComment } = req.body;
    const comment = new Comment({
      post: postId,
      author: req.user._id,
      content,
      parentComment: parentComment || null
    });
    await comment.save();
    await comment.populate('author', 'name avatar');
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    const index = comment.likes.indexOf(req.user._id);
    if (index === -1) {
      comment.likes.push(req.user._id);
    } else {
      comment.likes.splice(index, 1);
    }
    await comment.save();
    res.json({ likes: comment.likes.length, liked: index === -1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Comment.deleteMany({ parentComment: req.params.id });
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
