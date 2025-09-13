import { useState } from "react";

const AdminPublications = () => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("image"); // default type

  const handlePublish = async () => {
    if (!content.trim()) return alert("Publication content cannot be empty");
    if (!file) return alert("Please attach a file");

    try {
      const formData = new FormData();
      formData.append("title", content);
      formData.append("type", type); // Add type (image/video)
      formData.append("file", file);

      const response = await fetch("https://excellenceschool.onrender.com/addpublication", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Publication published successfully!");
        setContent("");
        setFile(null);
        document.getElementById("file-input").value = "";
      } else {
        alert("Error publishing publication");
      }
    } catch (error) {
      alert("Failed to publish. Please try again.");
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

    const allowedTypes = type === 'image' ? allowedImageTypes : allowedVideoTypes;

    if (!allowedTypes.includes(selectedFile.type)) {
      alert(`Invalid file type. Please select a valid ${type === 'image' ? 'image' : 'video'} file.`);
      e.target.value = "";
      return;
    }

    const maxSizeMB = 10;
    const maxSize = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  return (
    <div className="space-y-4">
      {/* Publication Type Selector */}
      <div className="space-y-1">
        <label htmlFor="type" className="text-sm font-medium text-gray-700">Publication Type</label>
        <select
          id="type"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setFile(null);
            document.getElementById("file-input").value = "";
          }}
          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>

      {/* Textarea for content */}
      <textarea
        rows="6"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your publication..."
        className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
      />

      {/* File Input */}
      <input
        id="file-input"
        type="file"
        accept={
          type === "image"
            ? "image/jpeg,image/jpg,image/png,image/gif,image/webp"
            : "video/mp4,video/webm,video/ogg"
        }
        onChange={handleFileChange}
        className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
      />

      {/* File Info */}
      {file && (
        <div className="text-sm text-gray-600">
          Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}

      {/* Publish Button */}
      <button
        onClick={handlePublish}
        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
      >
        Publish
      </button>
    </div>
  );
};

export default AdminPublications;
