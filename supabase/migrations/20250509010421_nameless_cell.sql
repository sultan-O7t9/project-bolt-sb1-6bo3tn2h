/*
  # Create posts table and indexes

  1. New Tables
    - `posts`
      - `id` (int, primary key, auto increment)
      - `title` (varchar, required)
      - `content` (text, required)
      - `authorId` (int, foreign key to users)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)
  2. Foreign Keys
    - `authorId` references `users(id)`
*/

CREATE TABLE IF NOT EXISTS posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  authorId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_author ON posts(authorId);