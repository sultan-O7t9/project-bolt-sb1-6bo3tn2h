import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import PostCard from "../components/posts/PostCard";
import { User, Loader } from "lucide-react";
import type { Post } from "../utils/interfaces";

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        // For admin users, fetch their own posts
        if (user && user.role === "admin") {
          const res = await axios.get("http://localhost:5000/api/posts");
          // Filter posts by the current user
          const userPosts = res.data.filter(
            (post: Post) => post.author._id === user._id
          );
          setPosts(userPosts);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
        toast.error("Failed to load your posts");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  const handlePostDelete = (deletedPostId: string) => {
    setPosts(posts.filter((post) => post._id !== deletedPostId));
  };

  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card mb-6 mx-auto max-w-2xl">
        <div className="flex items-center">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-6">
            <User size={40} className="text-gray-500" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="mt-1 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {user.role === "admin" ? "Admin" : "User"}
            </p>
          </div>
        </div>
      </div>

      {user.role === "admin" && (
        <div className="mt-8 mx-auto max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Your Posts</h2>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader className="animate-spin mr-2" size={24} />
              <span>Loading your posts...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-gray-600">
                You haven't created any posts yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6 mx-auto max-w-2xl">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onDelete={handlePostDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
