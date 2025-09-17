import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const baseUrl = "https://excellenceschool.onrender.com";

const TeacherStudents = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const teacherEmail = localStorage.getItem("email");

  // Fetch students
  const fetchStudents = async () => {
    if (!teacherEmail) {
      alert(t("teacherStudents.errors.noEmail"));
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/getstudentt?email=${encodeURIComponent(teacherEmail)}`
      );
      const data = await response.json();
      setStudents(Array.isArray(data) ? data.filter(Boolean) : []);
    } finally {
      setLoading(false);
    }
  };

  // Delete a student
  const handleDelete = async (studentId) => {
    if (!window.confirm(t("teacherStudents.confirmDelete"))) return;

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
        alert(t("teacherStudents.successDelete"));
        fetchStudents(); // refresh list
      } else {
        const errText = await response.text();
        alert(t("teacherStudents.errorDelete") + " " + errText);
      }
    } catch {
      alert(t("teacherStudents.errorGeneric"));
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-4">
        {t("teacherStudents.title")}
      </h2>

      {loading && <p>{t("teacherStudents.loading")}</p>}

      {!loading && students.length === 0 && (
        <p className="text-gray-500">{t("teacherStudents.noStudents")}</p>
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
            {t("teacherStudents.delete")}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TeacherStudents;
