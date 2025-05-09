# MERN Stack Social Application

A full-stack social media blog application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### User Authentication

- JWT-based authentication
- Role-based authorization (Admin and User roles)
- User registration and login

### Admin Features

- Create, read, update, and delete posts
- Upload images and videos to posts
- View users who liked posts
- Like and comment on posts
- View all comments

### User Features

- View all posts
- Like posts
- Comment on posts

## Tech Stack

### Frontend

- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- React Toastify for notifications
- Lucide React for icons

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Express Validator for input validation

## Getting Started

### Prerequisites

- Node.js
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

### Running the Application

1. Start the backend server:
   ```
   npm run server
   ```
2. Start the frontend development server:
   ```
   npm run dev
   ```

## Project Structure

```
├── server/              # Backend code
│   ├── index.js         # Entry point
│   ├── middleware/      # Middleware functions
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── uploads/         # Uploaded files
├── src/                 # Frontend code
│   ├── components/      # React components
│   ├── context/         # Context providers
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Entry point
└── package.json         # Project dependencies
```
