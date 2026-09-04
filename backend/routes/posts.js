const express = require('express');
const Post = require('../models/Post');
const Category = require('../models/Category');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, tag, search, sort = '-createdAt', featured, trending } = req.query;
    const query = { published: true };
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    if (featured === 'true') query.featured = true;
    let sortOption = sort;
    if (trending === 'true') sortOption = '-views';
    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Post.countDocuments(query);
    res.json({ posts, total, pages: Math.ceil(total / limit), currentPage: parseInt(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/trending', async (req, res) => {
  try {
    const posts = await Post.find({ published: true })
      .populate('author', 'name avatar')
      .populate('category', 'name slug')
      .sort('-views')
      .limit(5);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const posts = await Post.find({ published: true, featured: true })
      .populate('author', 'name avatar')
      .populate('category', 'name slug')
      .sort('-createdAt')
      .limit(5);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar bio')
      .populate('category', 'name slug');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.views += 1;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, content, excerpt, featuredImage, category, tags, published } = req.body;
    const post = new Post({
      title, content, excerpt, featuredImage, category, tags, published,
      author: req.user._id
    });
    await post.save();
    if (category) {
      await Category.findByIdAndUpdate(category, { $inc: { postCount: 1 } });
    }
    await post.populate('author', 'name avatar');
    await post.populate('category', 'name slug');
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const oldCategory = post.category;
    Object.assign(post, req.body);
    await post.save();
    if (category && category !== oldCategory?.toString()) {
      if (oldCategory) await Category.findByIdAndUpdate(oldCategory, { $inc: { postCount: -1 } });
      await Category.findByIdAndUpdate(category, { $inc: { postCount: 1 } });
    }
    await post.populate('author', 'name avatar');
    await post.populate('category', 'name slug');
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (post.category) {
      await Category.findByIdAndUpdate(post.category, { $inc: { postCount: -1 } });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const index = post.likes.indexOf(req.user._id);
    if (index === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: index === -1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
