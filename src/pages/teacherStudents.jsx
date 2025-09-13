import { useState, useEffect } from "react";

const baseUrl = "https://excellenceschool.onrender.com";

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const teacherEmail = localStorage.getItem("email");

  // 🔹 Fetch students
  const fetchStudents = async () => {
    if (!teacherEmail) {
      alert("⚠️ Teacher email not found. Please log in again.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/getstudentt?email=${encodeURIComponent(teacherEmail)}`
      );
      const data = await response.json();
      console.log("📌 Students response:", data);
      setStudents(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete a student
  const handleDelete = async (studentId) => {
    if (!window.confirm("هل تريد حذف هذا الطالب؟")) return;

    try {
      const response = await fetch(`${baseUrl}/deletestudentt`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: teacherEmail,
          studentId: studentId,
        }),
      });

      if (response.ok) {
        alert("✅ تم حذف الطالب بنجاح");
        // refresh list from backend to stay in sync
        fetchStudents();
      } else {
        const errText = await response.text();
        alert("❌ فشل حذف الطالب: " + errText);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("❌ خطأ أثناء حذف الطالب");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-4">قائمة الطلاب</h2>

      {loading && <p>⏳ جارٍ تحميل الطلاب...</p>}

      {!loading && students.length === 0 && (
        <p className="text-gray-500">لا يوجد طلاب حاليا</p>
      )}

      {students.map((student) => (
        <div
          key={student._id}
          className="flex justify-between items-center border p-3 rounded-lg mb-2"
        >
          <div className="flex flex-col">
            <span className="font-medium">
              {student.firstname} {student.lastname}
            </span>
            <span className="text-sm text-gray-500">
              {student.academiclevel} – {student.email}
            </span>
          </div>
          <button
            onClick={() => handleDelete(student._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            حذف
          </button>
        </div>
      ))}
    </div>
  );
};

export default TeacherStudents;
