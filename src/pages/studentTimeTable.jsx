// src/pages/StudentTimetable.jsx
const StudentTimetable = () => {
  const schedule = [
    { time: "08:00 - 09:00", subject: "رياضيات", room: "قاعة A1", teacher: "أ. قادري" },
    { time: "09:15 - 10:15", subject: "فيزياء", room: "قاعة B3", teacher: "أ. قادري" }
  ];

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">الجدول الزمني</h2>
        <select className="border rounded px-2 py-1">
          <option>الاثنين</option>
          <option>الثلاثاء</option>
          <option>الأربعاء</option>
        </select>
      </div>
      <div className="space-y-3">
        {schedule.map((s, i) => (
          <div key={i} className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-500">{s.time}</span>
            <span className="font-bold">{s.subject}</span>
            <span>{s.room}</span>
            <span className="text-gray-600">{s.teacher}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default StudentTimetable;
