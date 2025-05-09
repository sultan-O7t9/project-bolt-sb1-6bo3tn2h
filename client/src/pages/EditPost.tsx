import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import MediaUpload from "../components/posts/MediaUpload";
import { Save, Loader } from "lucide-react";
import type { Media } from "../utils/interfaces";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
  const [existingMedia, setExistingMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null as unknown as string);

  const { title, content } = formData;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);

        setFormData({
          title: res.data.title,
          content: res.data.content,
        });

        setExistingMedia(res.data.media || []);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post. Please try again later.");
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMediaChange: (files: FileList | null) => void = (files) => {
    setMediaFiles(files);
  };

  const handleRemoveExistingMedia = (mediaId: string) => {
    setExistingMedia((prev) => prev.filter((media) => media._id !== mediaId));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      // Create FormData object
      const formDataObj = new FormData();
      formDataObj.append("title", title);
      formDataObj.append("content", content);

      // Add media files if any
      if (mediaFiles) {
        for (let i = 0; i < mediaFiles.length; i++) {
          formDataObj.append("media", mediaFiles[i]);
        }
      }

      // Add IDs of media to keep
      const keepMediaIds = existingMedia.map((media) => media._id);
      if (keepMediaIds.length > 0) {
        formDataObj.append("keepMedia", keepMediaIds.join(","));
      }

      // Send request
      await axios.put(`http://localhost:5000/api/posts/${id}`, formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post updated successfully");
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error(
        ((error as AxiosError).response?.data as { message: string })
          ?.message || "Failed to update post"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin mr-2" size={24} />
        <span>Loading post...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative "
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className=" mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={
                handleChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>
              }
              className="input-field"
              placeholder="Write your post content here..."
              rows={8}
              required
            />
          </div>

          <MediaUpload
            onMediaChange={handleMediaChange}
            existingMedia={existingMedia}
            onRemoveExistingMedia={handleRemoveExistingMedia}
          />

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => navigate(`/posts/${id}`)}
              className="btn-secondary mr-4"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader className="animate-spin mr-2" size={20} />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="mr-2" size={20} />
                  <span>Update Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
