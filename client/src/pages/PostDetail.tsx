import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import CommentForm from "../components/posts/CommentForm";
import CommentList from "../components/posts/CommentList";
import { formatDistanceToNow } from "../utils/dateUtils";
import { Heart, ArrowLeft, Edit, Trash2, User, Loader } from "lucide-react";
import type { Post, Comment } from "../utils/interfaces";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get<Post>(
          `http://localhost:5000/api/posts/${id}`
        );
        setPost(res.data);
        setComments(res.data.comments || []);
        setLikesCount(res.data.likes.length);

        // Check if user has liked the post
        if (user) {
          setLiked(res.data.likes.includes(user._id));
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post. Please try again later.");
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      toast.info("Please login to like posts");
      return;
    }

    try {
      if (liked) {
        await axios.delete(`http://localhost:5000/api/likes/${id}`);
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        await axios.post(`http://localhost:5000/api/likes/${id}`);
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
        await axios.delete(`http://localhost:5000/api/posts/${id}`);
        toast.success("Post deleted successfully");
        navigate("/");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete post");
      }
    }
  };

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleCommentDeleted = (deletedCommentId: string) => {
    setComments((prev) =>
      prev.filter((comment) => comment._id !== deletedCommentId)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin mr-2" size={24} />
        <span>Loading post...</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error || "Post not found"}</span>
        <Link to="/" className="block mt-4 text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className=" mx-auto max-w-2xl">
      <div className="mb-6 ">
        <Link
          to="/"
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Posts</span>
        </Link>
      </div>

      <div className="card">
        <div className="flex items-center mb-4">
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
              {formatDistanceToNow(
                post && post.createdAt ? post.createdAt : ""
              )}
            </p>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

        <div className="mb-6 whitespace-pre-line">{post.content}</div>

        {post.media && post.media.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {post.media.map((item, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                {item.type === "image" ? (
                  <img
                    src={`http://localhost:5000${item.url}`}
                    alt={`Post media ${index + 1}`}
                    className="w-full h-auto"
                  />
                ) : (
                  <video
                    src={`http://localhost:5000${item.url}`}
                    controls
                    className="w-full h-auto"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
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
          </div>

          {isAdmin() && user && post.author._id === user._id && (
            <div className="flex space-x-4">
              <Link
                to={`/edit-post/${post._id}`}
                className="btn-secondary flex items-center"
              >
                <Edit size={16} className="mr-1" />
                <span>Edit</span>
              </Link>

              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-200 flex items-center"
              >
                <Trash2 size={16} className="mr-1" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <CommentForm postId={post._id} onCommentAdded={handleCommentAdded} />
        <CommentList
          comments={comments}
          onCommentDeleted={handleCommentDeleted}
        />
      </div>
    </div>
  );
};

export default PostDetail;
