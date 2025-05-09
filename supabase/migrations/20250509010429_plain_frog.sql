/*
  # Create post_likes table for many-to-many relationship

  1. New Tables
    - `post_likes`
      - `id` (int, primary key, auto increment)
      - `userId` (int, foreign key to users)
      - `postId` (int, foreign key to posts)
      - `createdAt` (timestamp)
  2. Foreign Keys
    - `userId` references `users(id)`
    - `postId` references `posts(id)`
  3. Unique Constraint
    - Combination of userId and postId must be unique
*/

CREATE TABLE IF NOT EXISTS post_likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  postId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_post_like (userId, postId)
);

CREATE INDEX idx_post_likes_user ON post_likes(userId);
CREATE INDEX idx_post_likes_post ON post_likes(postId);