import { useEffect, useState } from "react";
import { FileText, Video, ChevronLeft, BookOpen } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

const StudentLessons = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [showMobileLessons, setShowMobileLessons] = useState(false); // New state for mobile
  const { auth } = useAuth();
  const { t } = useTranslation();

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
    setShowMobileLessons(true); // Show lessons on mobile
  };

  const handleBackToSubjects = () => {
    setShowMobileLessons(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {/* Subjects Sidebar - Hidden on mobile when lessons are showing */}
      <div className={`${showMobileLessons ? 'hidden md:block' : 'block'} md:col-span-1 bg-white shadow rounded-xl p-4 space-y-3`}>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-orange-500" />
          <h2 className="font-bold text-sm md:text-base">{t("studentLessons.subjectsAndTeachers")}</h2>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">{t("studentLessons.loading")}</p>
        ) : subjects.length > 0 ? (
          <div className="space-y-2">
            {subjects.map((s, i) => (
              <div
                key={s._id}
                onClick={() => handleSubjectSelect(i)}
                className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  i === selectedIndex
                    ? "bg-orange-100 border-orange-400"
                    : "hover:bg-gray-100 border-gray-200"
                }`}
              >
                <p className="font-semibold text-sm md:text-base text-gray-800 truncate">{s.subject}</p>
                <p className="text-xs md:text-sm text-gray-500 truncate">
                  {t("studentLessons.teacherLabel")}: {s.teacher}
                </p>
                <div className="md:hidden mt-2">
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    {t("studentLessons.viewLessons")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-8 md:w-12 h-8 md:h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t("studentLessons.noSubjects")}</p>
          </div>
        )}
      </div>

      {/* Lessons Panel - Full width on mobile when showing lessons */}
      <div className={`${!showMobileLessons ? 'hidden md:block' : 'block'} md:col-span-2 bg-white shadow rounded-xl p-4 space-y-3`}>
        {/* Header with back button for mobile */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBackToSubjects}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-2">
            {subjects[selectedIndex]?.subject && (
              <>
                <FileText className="w-5 h-5 text-purple-500" />
                <div>
                  <h2 className="font-bold text-sm md:text-base">{subjects[selectedIndex]?.subject}</h2>
                  <p className="text-xs text-gray-500">{subjects[selectedIndex]?.teacher}</p>
                </div>
              </>
            )}
            {!subjects[selectedIndex]?.subject && (
              <h2 className="font-bold text-sm md:text-base">{t("studentLessons.lessons")}</h2>
            )}
          </div>
        </div>

        {/* Lessons Content */}
        <div className="space-y-3">
          {lessonsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">{t("studentLessons.loadingLessons")}</p>
            </div>
          ) : lessons.length > 0 ? (
            <div className="space-y-3">
              {lessons.map((l) => (
                <div
                  key={l._id}
                  className="flex items-center gap-3 bg-purple-50 hover:bg-purple-100 p-3 md:p-4 rounded-lg transition-colors duration-200 border border-purple-200"
                >
                  {l.type === "Video" ? (
                    <Video className="w-5 h-5 text-red-500 flex-shrink-0" />
                  ) : (
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-gray-800 hover:text-blue-600 transition-colors text-sm md:text-base block truncate"
                    >
                      {l.title}
                    </a>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{l.level}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {l.type}
                      </span>
                    </div>
                  </div>

                  {/* External link indicator */}
                  <div className="flex-shrink-0">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : subjects.length > 0 && selectedIndex >= 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 md:w-16 h-12 md:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm md:text-base mb-2">{t("studentLessons.noLessonsForTeacher")}</p>
              <p className="text-xs text-gray-400">
                {subjects[selectedIndex]?.teacher} • {subjects[selectedIndex]?.subject}
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 md:w-16 h-12 md:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm md:text-base">{t("studentLessons.selectSubject")}</p>
              <button
                onClick={() => setShowMobileLessons(false)}
                className="md:hidden mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm"
              >
                {t("studentLessons.selectSubject")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentLessons;