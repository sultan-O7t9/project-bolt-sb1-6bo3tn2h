import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import MediaUpload from "../components/posts/MediaUpload";
import { Save, Loader } from "lucide-react";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { title, content } = formData;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMediaChange: (files: FileList | null) => void = (files) => {
    setMediaFiles(files);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

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

      // Send request
      const res = await axios.post(
        "http://localhost:5000/api/posts",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Post created successfully");
      navigate(`/posts/${res.data._id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(
        ((error as AxiosError).response?.data as { message: string }).message ||
          "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

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

          <MediaUpload onMediaChange={handleMediaChange} />

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-secondary mr-4"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2" size={20} />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="mr-2" size={20} />
                  <span>Create Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
