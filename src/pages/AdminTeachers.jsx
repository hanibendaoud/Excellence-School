import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const AdminTeachers = () => {
  const { t } = useTranslation();

  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
        alert(t("teachersManagement.errors.fetch"));
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      alert(t("teachersManagement.errors.network"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (teacher) => {
    const confirmDelete = window.confirm(
      t("teachersManagement.confirmDelete.text", { name: teacher.fullname })
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        "https://excellenceschool.onrender.com/deleteteacher",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: teacher.email }),
        }
      );

      if (response.ok) {
        setTeachers((prev) => prev.filter((t) => t._id !== teacher._id));
        alert(t("teachersManagement.success.deleted"));
      } else {
        alert(t("teachersManagement.errors.delete"));
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert(t("teachersManagement.errors.networkDelete"));
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
        <p className="text-gray-600">{t("teachersManagement.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* Search Bar */}
      <div className="flex items-center border rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder={t("teachersManagement.search.placeholder")}
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
              onClick={() => handleDelete(teacher)}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              {t("teachersManagement.actions.delete")}
            </button>
          </div>
        </div>
      ))}

      {filtered.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">{t("teachersManagement.noTeachers")}</p>
        </div>
      )}
    </div>
  );
};

export default AdminTeachers;
