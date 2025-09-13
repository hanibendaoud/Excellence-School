// src/pages/StudentLessons.jsx
import { useEffect, useState } from "react";
import { FileText, Youtube } from "lucide-react";
import useAuth from "../hooks/useAuth";

const StudentLessons = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth || !auth.id) {
      setLoading(false);
      return;
    }

    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://excellenceschool.onrender.com/getsubjects/${auth.id}`
        );
        if (!res.ok) throw new Error("Server error " + res.status);
        const data = await res.json();
        setSubjects(data || []);
        console.log('all subjects')
        console.log(data)
      } catch {
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [auth?.id]);

  const fetchLessons = async (teacher, level) => {
    if (!teacher || !level) return;

    setLessonsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const url = `https://excellenceschool.onrender.com/getlessons/${teacher}/${level}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Server Error ${response.status}`);
      }

      const result = await response.json();
      setLessons(result || []);
      console.log('info about each subject \n',result)
    } catch {
      setLessons([]);
    } finally {
      setLessonsLoading(false);
    }
  };

  useEffect(() => {
    if (!subjects.length || selectedIndex < 0 || selectedIndex >= subjects.length) return;

    const selectedSubject = subjects[selectedIndex];
    const teacher = selectedSubject?.teacher;
    const level = auth?.level;

    if (teacher && level) {
      fetchLessons(teacher, level);
    }
  }, [selectedIndex, subjects, auth?.level]);

  const handleSubjectSelect = (index) => {
    setSelectedIndex(index);
    setLessons([]); // Clear previous lessons
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-1 bg-white shadow rounded-xl p-4 space-y-3">
        <h2 className="font-bold mb-2">المواد و الأساتذة</h2>

        {loading ? (
          <p className="text-gray-500">جاري التحميل...</p>
        ) : subjects.length > 0 ? (
          subjects.map((s, i) => (
            <div
              key={s._id}
              onClick={() => handleSubjectSelect(i)}
              className={`p-2 border rounded cursor-pointer transition ${
                i === selectedIndex
                  ? "bg-orange-100 border-orange-400"
                  : "hover:bg-gray-100"
              }`}
            >
              <p className="font-semibold">{s.subject}</p>
              <p className="text-sm text-gray-500"> {s.teacher}   : الأستاذ </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">لا توجد مواد</p>
        )}
      </div>

      <div className="col-span-2 bg-white shadow rounded-xl p-4 space-y-3">
        <h2 className="font-bold mb-2">الدروس</h2>

        {lessonsLoading ? (
          <p className="text-gray-500">جاري تحميل الدروس...</p>
        ) : lessons.length > 0 ? (
          lessons.map((l) => (
            <div
              key={l._id}
              className="flex items-center gap-3 bg-purple-200 p-3 rounded-lg"
            >
              {l.type === "video" ? (
                <Youtube className="w-5 h-5 text-red-500" />
              ) : (
                <FileText className="w-5 h-5 text-blue-600" />
              )}
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-blue-600 transition-colors"
              >
                {l.title}
              </a>
              <span className="text-sm text-gray-500">{l.level}</span>
            </div>
          ))
        ) : subjects.length > 0 && selectedIndex >= 0 ? (
          <p className="text-gray-500">لا توجد دروس متاحة لهذا الأستاذ</p>
        ) : (
          <p className="text-gray-500">اختر مادة لعرض الدروس</p>
        )}
      </div>
    </div>
  );
};

export default StudentLessons;
