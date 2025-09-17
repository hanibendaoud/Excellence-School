import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const baseUrl = "https://excellenceschool.onrender.com";

const TeacherCourses = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const teacherEmail = localStorage.getItem("email");

  // 🔹 Fetch courses
  const fetchCourses = async () => {
    if (!teacherEmail) {
      alert(t("teacherCourses.errors.noEmail"));
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/getcourses?email=${encodeURIComponent(teacherEmail)}`
      );
      const data = await response.json();
      console.log("📌 Courses response:", data);
      setCourses(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert(t("teacherCourses.errors.load"));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete course
  const handleDelete = async (title) => {
    if (!window.confirm(t("teacherCourses.confirm.delete"))) return;

    try {
      const response = await fetch(`${baseUrl}/deletcourse`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: teacherEmail,
          title: title,
        }),
      });

      if (response.ok) {
        alert(t("teacherCourses.success.deleted"));
        fetchCourses(); // refresh list
      } else {
        const errText = await response.text();
        alert(t("teacherCourses.errors.failed") + ": " + errText);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert(t("teacherCourses.errors.network"));
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-4">{t("teacherCourses.title")}</h2>

      {loading && <p>{t("teacherCourses.loading")}</p>}

      {!loading && courses.length === 0 && (
        <p className="text-gray-500">{t("teacherCourses.noCourses")}</p>
      )}

      {courses.map((course) => (
        <div
          key={course._id || course.title}
          className="flex justify-between items-center border p-3 rounded-lg mb-2"
        >
          <div className="flex flex-col">
            <span className="font-medium">{course.title}</span>
            <span className="text-sm text-gray-500">
              {course.level} – {course.type}
            </span>
          </div>
          <button
            onClick={() => handleDelete(course.title)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            {t("teacherCourses.actions.delete")}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TeacherCourses;
