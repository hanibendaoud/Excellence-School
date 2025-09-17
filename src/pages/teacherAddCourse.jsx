import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const baseUrl = "https://excellenceschool.onrender.com";

const TeacherAddCourse = () => {
  const { t } = useTranslation();

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
      alert(t("teacherAddCourse.errors.levels"));
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
      alert(t("teacherAddCourse.errors.fillFields"));
      return;
    }

    // Get teacher email from localStorage (saved at login)
    const teacherEmail = localStorage.getItem("email");

    if (!teacherEmail) {
      alert(t("teacherAddCourse.errors.noEmail"));
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
        alert(t("teacherAddCourse.success.added"));
        setForm({ title: "", level: "", type: "", file: null });
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
      } else {
        alert(t("teacherAddCourse.errors.failed"));
      }
    } catch (error) {
      console.error("Error uploading course:", error);
      alert(t("teacherAddCourse.errors.network"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">
        {t("teacherAddCourse.title")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course Title */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder={t("teacherAddCourse.form.courseTitle")}
          className="w-full p-3 border rounded-lg"
        />

        {/* Level Select */}
        <select
          name="level"
          value={form.level}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">{t("teacherAddCourse.form.selectLevel")}</option>
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
          <option value="">{t("teacherAddCourse.form.selectType")}</option>
          <option value="Pdf">PDF</option>
          <option value="Video">{t("teacherAddCourse.form.video")}</option>
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
          {loading
            ? t("teacherAddCourse.actions.uploading")
            : t("teacherAddCourse.actions.add")}
        </button>
      </form>
    </div>
  );
};

export default TeacherAddCourse;
