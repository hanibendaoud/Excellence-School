// src/pages/StudentTimetable.jsx
import { useState, useEffect } from 'react';
import useAuth from "../hooks/useAuth";
import { useTranslation } from 'react-i18next';

const StudentTimetable = () => {
  const { t } = useTranslation();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('');
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth || !auth.id) {
      setLoading(false);
      return;
    }

    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://excellenceschool.onrender.com/getsubjects/${auth.id}`);
        if (!res.ok) throw new Error(t("studentTimetable.errors.fetchSchedule"));

        const data = await res.json();
        const subjects = Array.isArray(data) ? data : [data];

        setSchedule(subjects);
      } catch (err) {
        console.error(t("studentTimetable.errors.fetchSchedule"), err);
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [auth?.id, t]);

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  // Days fully in Arabic, Monday with hamza
  const days = [
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
    "الأحد"
  ];

  const filteredSchedule = selectedDay
    ? schedule.filter(s => s.day === selectedDay)
    : schedule;

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">{t("studentTimetable.titles.timetable")}</h2>
        <select
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={selectedDay}
          onChange={handleDayChange}
        >
          <option value="">{t("studentTimetable.days.all")}</option>
          {days.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">{t("studentTimetable.messages.loading")}</p>
          </div>
        ) : filteredSchedule.length > 0 ? (
          filteredSchedule.map((s, i) => (
            <div
              key={s._id || `${s.subject}-${s.teacher}-${i}`}
              className="flex justify-between items-center border-b pb-3 mb-3 hover:bg-gray-50 p-2 rounded"
            >
              <div className="flex flex-col">
                <span className="font-bold text-lg">{s.subject || t("studentTimetable.placeholders.notSpecified")}</span>
                <span className="text-gray-600 text-sm">{t("studentTimetable.labels.teacher")}: {s.teacher || t("studentTimetable.placeholders.notSpecified")}</span>
                <span className="text-gray-500 text-sm">{t("studentTimetable.labels.day")}: {s.day || t("studentTimetable.placeholders.notSpecified")}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-gray-500 font-medium">{s.timing || t("studentTimetable.placeholders.notSpecified")}</span>
                <span className="text-gray-400 text-sm">📍 {s.classrom || t("studentTimetable.placeholders.notSpecified")}</span>
              </div>
            </div>
          ))
        ) : auth?.id ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{t("studentTimetable.messages.noClasses")}</p>
            <p className="text-xs text-gray-400 mt-2">{t("studentTimetable.labels.selectedDay")}: {selectedDay || t("studentTimetable.days.all")}</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{t("studentTimetable.messages.loginRequired")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTimetable;
