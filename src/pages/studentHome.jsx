import { useState, useEffect } from "react";
/* import useAuth from "../hooks/useAuth"; */
const StudentHome = () => {
  const [data, setData] = useState([]);
/*  const {auth} = useAuth() */
  const announcements = async () => {
    try {
      const response = await fetch("https://excellenceschool.onrender.com/getpublication", {
        method: "GET",
        /* headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        }, */
      });

      if (!response.ok) {
        throw new Error(`Server Error ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      setData(result);
    } catch (err) {
      console.error("Failed to fetch announcements:", err.message);
    }
  };

  useEffect(() => {
    announcements();
  }, []);

  return (
    <div className="space-y-4">
      {data.map((item) => (
  <div key={item._id} className="bg-white shadow rounded-xl p-4">
    <p className="text-right">{item.title}</p>
    {item.path && (
      <a
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        شاهد الدرس
      </a>
    )}
  </div>
))}

    </div>
  );
};

export default StudentHome;
