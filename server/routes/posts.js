import express from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private/Admin
router.post('/', 
  protect, 
  admin, 
  upload.array('media', 5), 
  [
    body('title', 'Title is required').notEmpty(),
    body('content', 'Content is required').notEmpty()
  ], 
  async (req, res, next) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content } = req.body;
      
      // Process uploaded files
      const media = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';
          media.push({
            type: fileType,
            url: `/uploads/${file.filename}`
          });
        }
      }

      // Create post
      const post = await Post.create({
        title,
        content,
        author: req.user._id,
        media
      });

      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name email profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name profilePicture'
        }
      });
    
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/posts/:id
// @desc    Get a post by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name profilePicture'
        }
      });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private/Admin
router.put('/:id', 
  protect, 
  admin, 
  upload.array('media', 5), 
  [
    body('title', 'Title is required').optional().notEmpty(),
    body('content', 'Content is required').optional().notEmpty()
  ], 
  async (req, res, next) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      // Check if user is the author of the post
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this post' });
      }
      
      const { title, content, keepMedia } = req.body;
      
      // Update post fields
      if (title) post.title = title;
      if (content) post.content = content;
      
      // Process uploaded files
      const keepMediaArray = keepMedia ? keepMedia.split(',') : [];
      
      // Filter out media that should be kept
      if (keepMediaArray.length > 0) {
        post.media = post.media.filter(item => keepMediaArray.includes(item._id.toString()));
      } else if (!keepMedia) {
        // If keepMedia is not provided, remove all existing media
        post.media = [];
      }
      
      // Add new media
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';
          post.media.push({
            type: fileType,
            url: `/uploads/${file.filename}`
          });
        }
      }
      
      const updatedPost = await post.save();
      
      res.json(updatedPost);
    } catch (error) {
      next(error);
    }
  }
);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    await post.deleteOne();
    
    res.json({ message: 'Post removed' });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/posts/:id/likes
// @desc    Get users who liked a post
// @access  Private
router.get('/:id/likes', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('likes', 'name email profilePicture');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post.likes);
  } catch (error) {
    next(error);
  }
});

export default router;