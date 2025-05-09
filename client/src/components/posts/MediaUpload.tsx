import { useState, useRef } from 'react';
import { X, Image, Film, Upload } from 'lucide-react';

interface MediaUploadProps {
  onMediaChange: (files: FileList | null) => void;
  existingMedia?: Array<{
    _id: string;
    type: string;
    url: string;
  }>;
  onRemoveExistingMedia?: (id: string) => void;
}

const MediaUpload = ({ onMediaChange, existingMedia = [], onRemoveExistingMedia }: MediaUploadProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      // Create preview URLs for selected files
      const newPreviewUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
      
      // Pass files to parent component
      onMediaChange(files);
    }
  };
  
  const handleRemovePreview = (index: number) => {
    // Remove preview URL
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Notify parent component
    onMediaChange(null);
  };
  
  const handleRemoveExisting = (id: string) => {
    if (onRemoveExistingMedia) {
      onRemoveExistingMedia(id);
    }
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Media (Images/Videos)
      </label>
      
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Images or videos (max 5 files)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            max={5}
          />
        </label>
      </div>
      
      {/* Display existing media */}
      {existingMedia.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Current Media:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {existingMedia.map(media => (
              <div key={media._id} className="relative">
                {media.type === 'image' ? (
                  <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:5000${media.url}`}
                      alt="Media preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 bg-gray-800 bg-opacity-50 text-white p-1 rounded-br">
                      <Image size={16} />
                    </div>
                  </div>
                ) : (
                  <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <Film size={24} className="text-gray-500" />
                    <div className="absolute top-0 left-0 bg-gray-800 bg-opacity-50 text-white p-1 rounded-br">
                      <Film size={16} />
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveExisting(media._id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Display preview of new files */}
      {previewUrls.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">New Media:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                {url.startsWith('blob:') && (
                  <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
                    {url.includes('video') ? (
                      <div className="flex items-center justify-center h-full">
                        <Film size={24} className="text-gray-500" />
                      </div>
                    ) : (
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemovePreview(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;