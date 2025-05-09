/*
  # Create media table and indexes

  1. New Tables
    - `media`
      - `id` (int, primary key, auto increment)
      - `type` (enum: 'image', 'video')
      - `url` (varchar, required)
      - `postId` (int, foreign key to posts)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)
  2. Foreign Keys
    - `postId` references `posts(id)`
*/

CREATE TABLE IF NOT EXISTS media (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('image', 'video') NOT NULL,
  url VARCHAR(255) NOT NULL,
  postId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX idx_media_post ON media(postId);