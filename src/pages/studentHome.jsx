import { useState, useEffect } from "react";

const StudentHome = () => {
  const [data, setData] = useState([]);

  const announcements = async () => {
    try {
      const response = await fetch("https://excellenceschool.onrender.com/getpublication", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Server Error ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch announcements:", err.message);
    }
  };

  useEffect(() => {
    announcements();
  }, []);

  return (
    <div className="space-y-6">
      {data.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد منشورات حالياً</p>
      ) : (
        data.map((item) => (
          <div key={item._id} className="bg-white shadow rounded-xl p-4 space-y-3">
            {/* Title */}
            <p className="text-right text-lg font-semibold text-gray-800">{item.title}</p>

            {/* Image */}
            {item.path && item.type === "image" && (
              <img
                src={item.path}
                alt="announcement"
                className="w-full max-h-[250px] object-contain rounded-md border"
              />
            )}

            {/* Video */}
            {item.path && item.type === "video" && (
              <video
                src={item.path}
                controls
                className="w-full max-h-[250px] rounded-md border object-contain"
              >
                Your browser does not support the video tag.
              </video>
            )}

            {/* Fallback Link */}
            {item.path && !["image", "video"].includes(item.type) && (
              <a
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm"
              >
                تحميل الملف
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StudentHome;
