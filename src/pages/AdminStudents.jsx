import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState("");
  const [subjectData, setSubjectData] = useState({
    subject: "",
    teacher: "",
    day: "",
    timing: "",
    classrom: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Options state
  const [materials, setMaterials] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [timings, setTimings] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const BASE_URL = "https://excellenceschool.onrender.com";

  // Arabic Days
  const DAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

  // Fetch initial data
  useEffect(() => {
    fetchStudents();
    fetchMaterials();
    fetchClassrooms();
    fetchTimings();
    fetchTeachers();
  }, []);

  // 🔹 Fetch Students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/getstudents`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Materials (subjects)
  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getmaterials`);
      const data = await response.json();
      setMaterials(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  // 🔹 Fetch Classrooms
  const fetchClassrooms = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getclassroom`);
      const data = await response.json();
      setClassrooms(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  // 🔹 Fetch Timings
  const fetchTimings = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getteming`);
      const data = await response.json();
      setTimings(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.error("Error fetching timings:", error);
    }
  };

  // 🔹 Fetch Teachers
  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getallteacher`);
      const data = await response.json();
      if (data && Array.isArray(data.date)) {
        setTeachers(data.date);
      } else {
        setTeachers([]);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
    }
  };

  // 🔹 Modal Controls
  const openSubjectModal = (studentEmail) => {
    setSelectedStudentEmail(studentEmail);
    setSubjectData({
      subject: "",
      teacher: "",
      day: "",
      timing: "",
      classrom: "",
    });
    setShowSubjectModal(true);
  };

  const closeSubjectModal = () => {
    setShowSubjectModal(false);
    setSelectedStudentEmail("");
    setSubjectData({
      subject: "",
      teacher: "",
      day: "",
      timing: "",
      classrom: "",
    });
  };

  const handleSubjectInputChange = (field, value) => {
    setSubjectData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 🔹 Add Subject
  const handleAddSubject = async () => {
    if (!subjectData.subject || !subjectData.teacher || !subjectData.day || !subjectData.timing || !subjectData.classrom) {
      alert("⚠️ Please fill in all fields before adding the subject.");
      return;
    }

    try {
      setSubmitting(true);
      console.log("📤 Adding subject:", { email: selectedStudentEmail, ...subjectData });

      const response = await fetch(`${BASE_URL}/addsubject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selectedStudentEmail, ...subjectData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchStudents();
      alert(`✅ Subject "${subjectData.subject}" added successfully for ${selectedStudentEmail}!`);
      closeSubjectModal();
    } catch (err) {
      console.error("Error adding subject:", err);
      alert("❌ Failed to add subject. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔹 Delete Student
  const handleDelete = async (email) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const response = await fetch(`${BASE_URL}/deletestudent`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setStudents((prev) => prev.filter((s) => s.email !== email));
      alert("✅ Student deleted successfully");
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("❌ Failed to delete student. Please try again.");
    }
  };

  // 🔹 Filter Students
  const filtered = students.filter(
    (s) =>
      `${s.firstname} ${s.lastname}`.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 UI States
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">{error}</div>
        <button
          onClick={fetchStudents}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center border rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 outline-none"
        />
        <button className="p-2 bg-gray-100">
          <Search className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Students List */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {search ? "No students found matching your search." : "No students available."}
        </div>
      ) : (
        filtered.map((student) => (
          <div
            key={student._id}
            className="p-4 border rounded-lg bg-white shadow-sm flex flex-col gap-3"
          >
            {/* Basic Info */}
            <div className="flex justify-between items-center">
              <p className="font-bold text-gray-800">
                {student.firstname} {student.lastname}
              </p>
              <p className="text-sm text-gray-600">{student.phonenumber}</p>
            </div>
            <p className="text-sm text-gray-500">{student.academiclevel}</p>
            <p className="text-sm text-gray-500 italic">{student.email}</p>

            {/* Display existing subjects */}
            {student.subjects && student.subjects.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Current Subjects:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {student.subjects.map((subj, idx) => (
                    <div key={idx} className="bg-blue-50 p-2 rounded text-sm">
                      <p className="font-medium">{subj.subject}</p>
                      <p className="text-gray-600">Teacher: {subj.teacher}</p>
                      <p className="text-gray-600">{subj.day} - {subj.timing}</p>
                      <p className="text-gray-600">Room: {subj.classrom}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => openSubjectModal(student.email)}
                className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
              >
                Add Subject
              </button>
              <button
                onClick={() => handleDelete(student.email)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* Add Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Add New Subject</h3>
              <button
                onClick={closeSubjectModal}
                className="text-gray-400 hover:text-gray-600"
                disabled={submitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Subject Select */}
              <select
                className="border rounded px-2 py-1 w-full"
                value={subjectData.subject}
                onChange={(e) => handleSubjectInputChange("subject", e.target.value)}
              >
                <option value="">اختر المادة</option>
                {materials.map((m, i) => (
                  <option key={i} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Teacher Select */}
              <select
                className="border rounded px-2 py-1 w-full"
                value={subjectData.teacher}
                onChange={(e) => handleSubjectInputChange("teacher", e.target.value)}
              >
                <option value="">اختر المعلم</option>
                {teachers.length > 0 ? (
                  teachers.map((t) => (
                    <option key={t._id} value={t.fullname}>
                      {t.fullname}
                    </option>
                  ))
                ) : (
                  <option disabled>⚠️ لم يتم تحميل المعلمين</option>
                )}
              </select>

              {/* Classroom */}
              <select
                className="border rounded px-2 py-1 w-full"
                value={subjectData.classrom}
                onChange={(e) => handleSubjectInputChange("classrom", e.target.value)}
              >
                <option value="">اختر القاعة</option>
                {classrooms.map((room, i) => (
                  <option key={i} value={room}>
                    {room}
                  </option>
                ))}
              </select>

              {/* Timing */}
              <select
                className="border rounded px-2 py-1 w-full"
                value={subjectData.timing}
                onChange={(e) => handleSubjectInputChange("timing", e.target.value)}
              >
                <option value="">اختر الوقت</option>
                {timings.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* Day */}
              <select
                className="border rounded px-2 py-1 w-full"
                value={subjectData.day}
                onChange={(e) => handleSubjectInputChange("day", e.target.value)}
              >
                <option value="">اختر اليوم</option>
                {DAYS_AR.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 p-4 border-t">
              <button
                onClick={closeSubjectModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                إلغاء
              </button>
              <button
                onClick={handleAddSubject}
                className="flex-1 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? "جاري الإضافة..." : "إضافة المادة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
