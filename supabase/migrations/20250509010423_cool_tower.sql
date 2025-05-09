/*
  # Create comments table and indexes

  1. New Tables
    - `comments`
      - `id` (int, primary key, auto increment)
      - `content` (text, required)
      - `authorId` (int, foreign key to users)
      - `postId` (int, foreign key to posts)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)
  2. Foreign Keys
    - `authorId` references `users(id)`
    - `postId` references `posts(id)`
*/

CREATE TABLE IF NOT EXISTS comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  content TEXT NOT NULL,
  authorId INT NOT NULL,
  postId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX idx_comments_author ON comments(authorId);
CREATE INDEX idx_comments_post ON comments(postId);