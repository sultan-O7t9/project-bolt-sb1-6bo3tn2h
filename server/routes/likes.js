import express from 'express';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/likes/:postId
// @desc    Like a post
// @access  Private
router.post('/:postId', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if the post has already been liked by this user
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }
    
    // Add user to likes array
    post.likes.push(req.user._id);
    await post.save();
    
    res.json({ message: 'Post liked', likes: post.likes });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/likes/:postId
// @desc    Unlike a post
// @access  Private
router.delete('/:postId', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if the post has been liked by this user
    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Post has not yet been liked' });
    }
    
    // Remove user from likes array
    post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString());
    await post.save();
    
    res.json({ message: 'Post unliked', likes: post.likes });
  } catch (error) {
    next(error);
  }
});

export default router;