// src/pages/StudentLessons.jsx
import { useEffect, useState } from "react";
import { FileText, Youtube } from "lucide-react";
import useAuth from '../hooks/useAuth'

const StudentLessons = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const {auth} = useAuth()

  const fetchLessons = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`https://excellenceschool.onrender.com/getlessons/${auth.teacher}/3AS`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      if (!response.ok) {
        throw new Error(`Server Error ${response.status}`);
      }

      const result = await response.json();
      console.log("Lessons data:", result);

      setSubjects(result.subjects || result);
    } catch (err) {
      console.error("Failed to fetch lessons:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-1 bg-white shadow rounded-xl p-4 space-y-3">
        <h2 className="font-bold mb-2">الاساتذة</h2>
        {loading ? (
          <p className="text-gray-500">جاري التحميل...</p>
        ) : (
          subjects.map((s, i) => (
            <div
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`p-2 border rounded cursor-pointer transition ${
                i === selectedIndex
                  ? "bg-orange-100 border-orange-400"
                  : "hover:bg-gray-100"
              }`}
            >
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-gray-500">{s.teacher}</p>
            </div>
          ))
        )}
      </div>

      <div className="col-span-2 bg-white shadow rounded-xl p-4 space-y-3">
        <h2 className="font-bold mb-2">الدروس</h2>
        {loading ? (
          <p className="text-gray-500">جاري تحميل الدروس...</p>
        ) : subjects.length > 0 ? (
          subjects[selectedIndex]?.lessons?.map((l, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-purple-200 p-3 rounded-lg"
            >
              {l.includes("فيديو") || i === 1 ? (
                <Youtube className="w-5 h-5 text-red-500" />
              ) : (
                <FileText className="w-5 h-5 text-blue-600" />
              )}
              <span>{l}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">لا توجد دروس متاحة</p>
        )}
      </div>
    </div>
  );
};

export default StudentLessons;