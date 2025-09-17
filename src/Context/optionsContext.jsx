// src/context/OptionsContext.jsx
import { createContext, useState, useEffect } from "react";

export const OptionsContext = createContext();

export const OptionsProvider = ({ children }) => {
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [levelsRes, subjectsRes] = await Promise.all([
          fetch("https://excellenceschool.onrender.com/getlevels"),
          fetch("https://excellenceschool.onrender.com/getmaterials"),
        ]);
        const levelsData = await levelsRes.json();
        const subjectsData = await subjectsRes.json();

        setLevels(Array.isArray(levelsData) ? levelsData.filter(Boolean) : []);
        setSubjects(
          Array.isArray(subjectsData) ? subjectsData.filter(Boolean) : []
        );
      } catch (err) {
        console.error("Error fetching options:", err);
      }
    };

    fetchOptions();
  }, []);

  return (
    <OptionsContext.Provider value={{ levels, subjects }}>
      {children}
    </OptionsContext.Provider>
  );
};
