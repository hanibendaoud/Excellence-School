// src/pages/StudentTimetable.jsx
import { useState, useEffect } from 'react';
import useAuth from "../hooks/useAuth";

const StudentTimetable = () => {
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
        if (!res.ok) throw new Error("Failed to fetch schedule");

        const data = await res.json();
        // If the API gives a single object instead of an array, normalize it
        const subjects = Array.isArray(data) ? data : [data];

        setSchedule(subjects);
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [auth?.id]);

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const days = [
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
    'الأحد'
  ];

  // Filter by selected day if chosen
  const filteredSchedule = selectedDay
    ? schedule.filter(s => s.day === selectedDay)
    : schedule;

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">الجدول الزمني</h2>
        <select
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={selectedDay}
          onChange={handleDayChange}
        >
          <option value="">جميع الأيام</option>
          {days.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">جاري التحميل...</p>
          </div>
        ) : filteredSchedule.length > 0 ? (
          <>
            {filteredSchedule.map((s, i) => (
              <div
                key={s._id || `${s.subject}-${s.teacher}-${i}`}
                className="flex justify-between items-center border-b pb-3 mb-3 hover:bg-gray-50 p-2 rounded"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{s.subject || 'غير محدد'}</span>
                  <span className="text-gray-600 text-sm">الأستاذ: {s.teacher || 'غير محدد'}</span>
                  <span className="text-gray-500 text-sm">اليوم: {s.day || 'غير محدد'}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-gray-500 font-medium">{s.timing || 'غير محدد'}</span>
                  <span className="text-gray-400 text-sm">📍 {s.classrom || 'غير محدد'}</span>
                </div>
              </div>
            ))}
          </>
        ) : auth?.id ? (
          <div className="text-center py-8">
            <p className="text-gray-500">لا توجد حصص لهذا اليوم</p>
            <p className="text-xs text-gray-400 mt-2">اليوم المحدد: {selectedDay || "جميع الأيام"}</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">يرجى تسجيل الدخول لعرض الجدول الزمني</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTimetable;
