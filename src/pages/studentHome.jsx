import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const StudentHome = () => {
  const [data, setData] = useState([]);
  const { t } = useTranslation();

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
    } catch {
      // you can show an alert or toast if needed
    }
  };

  useEffect(() => {
    announcements();
  }, []);

  return (
    <div className="space-y-6">
      {data.length === 0 ? (
        <p className="text-center text-gray-500">{t("studentHome.noAnnouncements")}</p>
      ) : (
        data.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-lg rounded-2xl p-5 space-y-4 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Title */}
            <p className="text-right text-lg font-semibold text-gray-800 break-words line-clamp-2 leading-snug">
              {item.title}
            </p>

            {/* Image */}
            {item.path && item.type === "image" && (
  <img
    src={item.path}
    alt="announcement"
    className="w-full max-h-[500px] object-contain rounded-lg border bg-gray-50"
  />
)}

{/* Video */}
{item.path && item.type === "video" && (
  <video
    src={item.path}
    controls
    className="w-full max-h-[500px] rounded-lg border object-contain bg-black"
  >
    {t("studentHome.noVideoSupport")}
  </video>
)}

            {/* Fallback File */}
            {item.path && !["image", "video"].includes(item.type) && (
              <a
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm hover:text-blue-800 transition-colors"
              >
                {t("studentHome.downloadFile")}
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StudentHome;
