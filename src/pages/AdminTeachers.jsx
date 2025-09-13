import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // teacher waiting for confirm

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://excellenceschool.onrender.com/getallteacher");
      if (response.ok) {
        const data = await response.json();
        setTeachers(Array.isArray(data.date) ? data.date : []);
      } else {
        setMessage({ type: "error", text: "Failed to fetch teachers" });
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setMessage({ type: "error", text: "Error fetching teachers" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteTeacher = (teacher) => {
    setConfirmDelete(teacher); // store full teacher to show name
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      const response = await fetch(
        "https://excellenceschool.onrender.com/deleteteacher",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: confirmDelete.email }),
        }
      );

      if (response.ok) {
        setTeachers((prev) => prev.filter((t) => t._id !== confirmDelete._id));
        setMessage({ type: "success", text: "Teacher deleted successfully" });
      } else {
        setMessage({ type: "error", text: "Failed to delete teacher" });
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      setMessage({ type: "error", text: "Error deleting teacher" });
    } finally {
      setConfirmDelete(null);
    }
  };
  
  const filtered = Array.isArray(teachers)
    ? teachers.filter((t) =>
        t.fullname?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading teachers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* ✅ Feedback message */}
      {message && (
        <div
          className={`p-2 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center border rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 outline-none"
        />
        <button className="p-2 bg-gray-100">
          <Search className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Teachers List */}
      {filtered.map((teacher) => (
        <div
          key={teacher._id}
          className="p-4 border rounded-lg bg-white shadow-sm flex flex-col gap-3"
        >
          <div className="flex justify-between items-center">
            <p className="font-bold text-gray-800">{teacher.fullname}</p>
            <p className="text-sm text-gray-600">{teacher.phonenumber}</p>
          </div>
          <p className="text-sm text-gray-500">{teacher.specialit}</p>
          <div className="flex gap-2">
            <button
              onClick={() => confirmDeleteTeacher(teacher)}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {filtered.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No teachers found</p>
        </div>
      )}

      {/* ✅ Small popup (not full screen) */}
      {confirmDelete && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white border shadow-lg rounded-lg p-6 w-80 z-50">
          <p className="text-gray-800 font-semibold mb-4">
            Delete <span className="text-red-600">{confirmDelete.fullname}</span>?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirmDelete(null)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeachers;