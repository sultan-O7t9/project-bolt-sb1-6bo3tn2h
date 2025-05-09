import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { Send } from "lucide-react";
import type { Comment } from "../../utils/interfaces";

interface CommentFormProps {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}

const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.info("Please login to comment");
      return;
    }

    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post("http://localhost:5000/api/comments", {
        content,
        postId,
      });

      onCommentAdded(res.data);
      setContent("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p>Please login to comment on this post.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-start">
        <textarea
          className="input-field flex-grow"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          className="btn-primary flex items-center"
          disabled={isSubmitting}
        >
          <Send size={16} className="mr-1" />
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
