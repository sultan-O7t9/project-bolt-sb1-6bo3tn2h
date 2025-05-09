import express from 'express';
import { body, validationResult } from 'express-validator';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/comments
// @desc    Create a new comment
// @access  Private
router.post('/', 
  protect, 
  [
    body('content', 'Comment content is required').notEmpty(),
    body('postId', 'Post ID is required').notEmpty()
  ], 
  async (req, res, next) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content, postId } = req.body;
      
      // Check if post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      // Create comment
      const comment = await Comment.create({
        content,
        author: req.user._id,
        post: postId
      });
      
      // Add comment to post
      post.comments.push(comment._id);
      await post.save();
      
      // Populate author details
      await comment.populate('author', 'name profilePicture');
      
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/comments/post/:postId
// @desc    Get all comments for a post
// @access  Public
router.get('/post/:postId', async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: -1 })
      .populate('author', 'name profilePicture');
    
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author of the comment or an admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    // Remove comment from post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id }
    });
    
    await comment.deleteOne();
    
    res.json({ message: 'Comment removed' });
  } catch (error) {
    next(error);
  }
});

export default router;