import { useState, useEffect } from "react";

const baseUrl = "https://excellenceschool.onrender.com";

const TeacherAddCourse = () => {
  const [form, setForm] = useState({
    title: "",
    level: "",
    type: "",
    file: null,
  });

  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch levels from backend
  const fetchLevels = async () => {
    try {
      const response = await fetch(`${baseUrl}/getlevels`);
      const data = await response.json();
      setLevels(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.level || !form.type || !form.file) {
      alert("⚠️ Please fill all fields and upload a file");
      return;
    }

    // Get teacher email from localStorage (saved at login)
    const teacherEmail = localStorage.getItem("email");

    if (!teacherEmail) {
      alert("⚠️ Teacher email not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("level", form.level);
    formData.append("type", form.type);
    formData.append("file", form.file);
    formData.append("email", teacherEmail);

    try {
      setLoading(true);
      
      const response = await fetch(`${baseUrl}/addcourse`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("✅ Course added successfully!");
        setForm({ title: "", level: "", type: "", file: null });
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        alert("❌ Failed to add course.");
      }
    } catch (error) {
      console.error("Error uploading course:", error);
      alert("❌ Error uploading course. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">Add a New Course</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course Title */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Course Title"
          className="w-full p-3 border rounded-lg"
        />

        {/* Level Select */}
        <select
          name="level"
          value={form.level}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">Select Level</option>
          {levels.map((lvl, index) => (
            <option key={index} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>

        {/* Type Select */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">Select Type</option>
          <option value="Pdf">PDF</option>
          <option value="Video">Video</option>
        </select>

        {/* File Upload */}
        <input
          type="file"
          name="file"
          accept={
            form.type === "Pdf"
              ? ".pdf,.doc,.docx,.ppt,.pptx"
              : form.type === "Video"
              ? "video/*"
              : ".pdf,.doc,.docx,.ppt,.pptx,video/*"
          }
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading ? "Uploading..." : "Add Course"}
        </button>
      </form>
    </div>
  );
};

export default TeacherAddCourse;