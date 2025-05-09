import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "../../utils/dateUtils";
import { useAuth } from "../../context/AuthContext";
import { Heart, MessageCircle, Edit, Trash2, User } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import type { Post } from "../../utils/interfaces";

interface PostCardProps {
  post: Post;

  onDelete: (id: string) => void;
}

const PostCard = ({ post, onDelete }: PostCardProps) => {
  const { user, isAdmin } = useAuth();
  const [liked, setLiked] = useState(
    user ? post.likes.includes(user._id) : false
  );
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const handleLike = async () => {
    if (!user) {
      toast.info("Please login to like posts");
      return;
    }

    try {
      if (liked) {
        await axios.delete(`http://localhost:5000/api/likes/${post._id}`);
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        await axios.post(`http://localhost:5000/api/likes/${post._id}`);
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${post._id}`);
        toast.success("Post deleted successfully");
        onDelete(post._id);
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete post");
      }
    }
  };

  // Truncate content if it's too long
  const truncatedContent =
    post.content.length > 200
      ? post.content.substring(0, 200) + "..."
      : post.content;

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-3">
        {post.author.profilePicture ? (
          <img
            src={`http://localhost:5000${post.author.profilePicture}`}
            alt={post.author.name}
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            <User size={20} className="text-gray-500" />
          </div>
        )}
        <div>
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(post && post.createdAt ? post.createdAt : "")}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{truncatedContent}</p>

      {post.media && post.media.length > 0 && (
        <div className="mb-4">
          {post.media[0].type === "image" ? (
            <img
              src={`http://localhost:5000${post.media[0].url}`}
              alt="Post media"
              className="w-full h-64 object-cover rounded-lg"
            />
          ) : (
            <video
              src={`http://localhost:5000${post.media[0].url}`}
              controls
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          {post.media.length > 1 && (
            <p className="text-sm text-gray-500 mt-1">
              +{post.media.length - 1} more
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center ${
              liked ? "text-red-500" : "text-gray-500"
            } hover:text-red-500`}
          >
            <Heart
              className="mr-1"
              size={18}
              fill={liked ? "currentColor" : "none"}
            />
            <span>{likesCount}</span>
          </button>

          <Link
            to={`/posts/${post._id}`}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <MessageCircle className="mr-1" size={18} />
            <span>{post.comments.length}</span>
          </Link>
        </div>

        {isAdmin() && user && post.author._id === user._id && (
          <div className="flex space-x-2">
            <Link
              to={`/edit-post/${post._id}`}
              className="text-blue-500 hover:text-blue-700"
            >
              <Edit size={18} />
            </Link>

            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <Link
        to={`/posts/${post._id}`}
        className="block mt-3 text-blue-600 hover:underline text-sm"
      >
        Read more
      </Link>
    </div>
  );
};

export default PostCard;
