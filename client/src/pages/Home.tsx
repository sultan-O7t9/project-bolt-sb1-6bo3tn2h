import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PostCard from "../components/posts/PostCard";
import { Loader } from "lucide-react";
import type { Post } from "../utils/interfaces";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as unknown as string);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostDelete = (deletedPostId: string) => {
    setPosts(posts.filter((post) => post._id !== deletedPostId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin mr-2" size={24} />
        <span>Loading posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6  mx-auto max-w-2xl">
        Recent Posts
      </h1>

      {posts.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-xl text-gray-600">
            No posts yet. Be the first to create a post!
          </p>
        </div>
      ) : (
        <div className="space-y-6 mx-auto max-w-2xl">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handlePostDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
