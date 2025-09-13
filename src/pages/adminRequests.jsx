import { useState, useEffect } from "react";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [levels, setLevels] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [timings, setTimings] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = "https://excellenceschool.onrender.com";

  useEffect(() => {
    fetchRequests();
    fetchLevels();
    fetchClassrooms();
    fetchTimings();
    fetchMaterials();
    fetchTeachers();
  }, []);

  // 🔹 Fetch Requests
  const fetchRequests = async () => {
    try {
      const response = await fetch(`${baseUrl}/getstudents2`);
      const data = await response.json();
      console.log("📌 getstudents2 response:", data);
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Levels
  const fetchLevels = async () => {
    try {
      const response = await fetch(`${baseUrl}/getlevels`);
      const data = await response.json();
      console.log("📌 getlevels response:", data);
      setLevels(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  // 🔹 Fetch Classrooms
  const fetchClassrooms = async () => {
    try {
      const response = await fetch(`${baseUrl}/getclassroom`);
      const data = await response.json();
      console.log("📌 getclassroom response:", data);
      setClassrooms(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  // 🔹 Fetch Timings
  const fetchTimings = async () => {
    try {
      const response = await fetch(`${baseUrl}/getteming`);
      const data = await response.json();
      console.log("📌 getteming response:", data);
      setTimings(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.error("Error fetching timings:", error);
    }
  };

  // 🔹 Fetch Materials
  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${baseUrl}/getmaterials`);
      const data = await response.json();
      console.log("📌 getmaterials response:", data);
      setMaterials(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  // 🔹 Fetch Teachers
  const fetchTeachers = async () => {
  console.log("📌 fetchTeachers CALLED");
  try {
    const response = await fetch(`${baseUrl}/getallteacher`);
    console.log("📡 Response status:", response.status);
    const data = await response.json();
    console.log("📌 getallteacher response:", data);

    if (data && Array.isArray(data.date)) {
      console.log("📌 Teachers from API:", data.date);
      setTeachers(data.date);
    } else {
      console.warn("⚠️ No teachers found in response");
      setTeachers([]);
    }
  } catch (error) {
    console.error("❌ Error fetching teachers:", error);
    setTeachers([]);
  }
};



// 🔹 Accept Student
const handleAccept = async (studentEmail, selectedSubjects) => {
  try {
    // Filter subjects that have all required info
    const validSubjects = selectedSubjects.filter(
      (s) => s.teacher && s.classrom && s.timing && s.day
    );

    if (validSubjects.length === 0) {
      alert("⚠️ Please assign at least one subject with full details before accepting.");
      return;
    }

    console.log("📤 Sending accept data:", { email: studentEmail, subjects: validSubjects });

    const response = await fetch(`${baseUrl}/accepeterstudent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: studentEmail, subjects: validSubjects }),
    });

    if (response.ok) {
      alert(`✅ Student ${studentEmail} accepted successfully`);
      setRequests((prev) => prev.filter((r) => r.email !== studentEmail));
    } else {
      const err = await response.text();
      console.error("❌ Server error:", err);
      alert("Error accepting student");
    }
  } catch (error) {
    console.error("Error accepting student:", error);
    alert("Error accepting student");
  }
};


  // 🔹 Reject Student
  const handleReject = async (studentEmail) => {
    if (!window.confirm(`Reject student ${studentEmail}?`)) return;

    try {
      const response = await fetch(`${baseUrl}/deletestudent`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: studentEmail }),
      });

      if (response.ok) {
        alert(`Student ${studentEmail} rejected`);
        setRequests((prev) => prev.filter((r) => r.email !== studentEmail));
      } else {
        alert("Error rejecting student");
      }
    } catch (error) {
      console.error("Error rejecting student:", error);
      alert("Error rejecting student");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading requests...</div>;
  }

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <div className="text-center p-4 text-gray-500">No pending requests</div>
      ) : (
        requests.map((req) => (
          <RequestCard
            key={req._id}
            req={req}
            levels={levels}
            classrooms={classrooms}
            timings={timings}
            materials={materials}
            teachers={teachers}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ))
      )}
    </div>
  );
};

// 🔹 RequestCard Component
const RequestCard = ({ req, classrooms, timings, teachers, onAccept, onReject }) => {
  const [selectedSubjects, setSelectedSubjects] = useState(
    req.subjects?.map((s) => ({
      ...s,
      day: "",
      teacher: "",
      classrom: "",
      timing: "",
    })) || []
  );

  const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
;

  const updateSubject = (index, field, value) => {
    const updated = [...selectedSubjects];
    updated[index][field] = value;
    setSelectedSubjects(updated);
  };

  const handleAcceptClick = () => {
    onAccept(req.email, selectedSubjects);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <p className="font-bold text-gray-800">
          {req.firstname} {req.lastname}
        </p>
        <p className="text-sm text-gray-600">{req.phonenumber}</p>
      </div>
      <p className="text-sm text-gray-500">{req.academiclevel}</p>

      {selectedSubjects.map((subj, idx) => (
        <div key={subj._id || idx} className="border p-2 rounded-lg space-y-2">
          <p className="font-semibold text-gray-700">{subj.subject}</p>

          {/* Teacher Select */}
<select
  className="border rounded px-2 py-1 w-full"
  value={subj.teacher}
  onChange={(e) => updateSubject(idx, "teacher", e.target.value)}
>
  <option value="">Select Teacher</option>
  {Array.isArray(teachers) && teachers.length > 0 ? (
    teachers.map((t) => (
      <option key={t._id} value={t.fullname}>
        {t.fullname}
      </option>
    ))
  ) : (
    <option disabled>⚠️ No teachers loaded</option>
  )}
</select>


          {/* Classroom */}
          <select
            className="border rounded px-2 py-1 w-full"
            value={subj.classrom}
            onChange={(e) => updateSubject(idx, "classrom", e.target.value)}
          >
            <option value="">Select Classroom</option>
            {classrooms.map((room, i) => (
              <option key={i} value={room}>
                {room}
              </option>
            ))}
          </select>

          {/* Timing */}
          <select
            className="border rounded px-2 py-1 w-full"
            value={subj.timing}
            onChange={(e) => updateSubject(idx, "timing", e.target.value)}
          >
            <option value="">Select Timing</option>
            {timings.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Day */}
          <select
            className="border rounded px-2 py-1 w-full"
            value={subj.day}
            onChange={(e) => updateSubject(idx, "day", e.target.value)}
          >
            <option value="">Select Day</option>
            {daysOfWeek.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div className="flex gap-2">
        <button
          onClick={handleAcceptClick}
          className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
        >
          Accept
        </button>
        <button
          onClick={() => onReject(req.email)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default AdminRequests;
