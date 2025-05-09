/*
  # Create users table and indexes

  1. New Tables
    - `users`
      - `id` (int, primary key, auto increment)
      - `name` (varchar, required)
      - `email` (varchar, unique, required)
      - `password` (varchar, required)
      - `role` (enum: 'user', 'admin', default: 'user')
      - `profilePicture` (varchar, nullable)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)
  2. Security
    - Unique index on email to prevent duplicates
*/

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  profilePicture VARCHAR(255) DEFAULT '',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);