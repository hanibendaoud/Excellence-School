import { useState, useEffect } from "react";

const baseUrl = "https://excellenceschool.onrender.com";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const teacherEmail = localStorage.getItem("email");

  // 🔹 Fetch courses
  const fetchCourses = async () => {
    if (!teacherEmail) {
      alert("⚠️ Teacher email not found. Please log in again.");
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
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete course
  const handleDelete = async (title) => {
    if (!window.confirm("هل تريد حذف هذا الدرس؟")) return;

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
        alert("✅ تم حذف الدرس بنجاح");
        fetchCourses(); // refresh list
      } else {
        const errText = await response.text();
        alert("❌ فشل حذف الدرس: " + errText);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("❌ خطأ أثناء حذف الدرس");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-4">الدروس المضافة</h2>

      {loading && <p>⏳ جارٍ تحميل الدروس...</p>}

      {!loading && courses.length === 0 && (
        <p className="text-gray-500">لا توجد دروس حاليا</p>
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
            حذف
          </button>
        </div>
      ))}
    </div>
  );
};

export default TeacherCourses;
