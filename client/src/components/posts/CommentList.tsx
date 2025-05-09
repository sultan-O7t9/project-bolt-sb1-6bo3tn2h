import { useState } from "react";
import { formatDistanceToNow } from "../../utils/dateUtils";
import { useAuth } from "../../context/AuthContext";
import { User, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import type { Comment } from "../../utils/interfaces";

interface CommentListProps {
  comments: Comment[];
  onCommentDeleted: (id: string) => void;
}

const CommentList = ({ comments, onCommentDeleted }: CommentListProps) => {
  const { user, isAdmin } = useAuth();
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});

  const toggleExpand = (commentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleDelete = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/comments/${commentId}`);
        onCommentDeleted(commentId);
        toast.success("Comment deleted successfully");
      } catch (error) {
        console.error("Error deleting comment:", error);
        toast.error("Failed to delete comment");
      }
    }
  };

  if (comments.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const isExpanded = expandedComments[comment._id];
        const isLongComment = comment.content.length > 200;
        const displayContent =
          isLongComment && !isExpanded
            ? comment.content.substring(0, 200) + "..."
            : comment.content;

        return (
          <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              {comment.author.profilePicture ? (
                <img
                  src={`http://localhost:5000${comment.author.profilePicture}`}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                  <User size={16} className="text-gray-500" />
                </div>
              )}
              <div className="flex-grow">
                <p className="font-semibold text-sm">{comment.author.name}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(
                    comment && comment.createdAt ? comment.createdAt : ""
                  )}
                </p>
              </div>

              {(user && comment.author._id === user._id) || isAdmin() ? (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              ) : null}
            </div>

            <p className="text-gray-700 whitespace-pre-line">
              {displayContent}
            </p>

            {isLongComment && (
              <button
                onClick={() => toggleExpand(comment._id)}
                className="text-blue-500 text-sm mt-1 hover:underline"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
