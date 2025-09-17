import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "./button";
import logo from "../assets/logo.svg";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
];

export default function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const sections = ["home", "about", "activities", "contact"];
  const [active, setActive] = useState("home");
  const [lang, setLang] = useState(i18n.language || "en");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScroll = (e, id) => {
    e.preventDefault();

    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    setActive(id);
  };

  const handleChangeLang = (code) => {
    i18n.changeLanguage(code);
    setLang(code);
    localStorage.setItem("lang", code);

    // For Arabic, switch to RTL
    if (code === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = code;
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-8 shadow-sm bg-white">
      <div className="flex items-center gap-2">
        <img src={logo} alt={t("home.schoolName")} className="w-20 h-20" />
        <div className="leading-tight">
          <h1 className="text-lg font-bold">{t("home.welcome")}</h1>
          <h1 className="text-lg font-bold">{t("home.schoolName")}</h1>
        </div>
      </div>

      <nav>
        <ul className="flex items-center gap-8 text-sm font-medium">
          {sections.map((id) => (
            <li key={id} className="relative">
              <a
                href={`#${id}`}
                onClick={(e) => handleScroll(e, id)}
                className={`hover:text-orange-500 transition ${
                  active === id ? "text-orange-500" : "text-gray-700"
                }`}
              >
                {t(`nav.${id}`) || id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
              {active === id && (
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-orange-400 to-yellow-400"></span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-6">
        {/* Language Selector */}
        <div className="flex items-center gap-3 border rounded-full px-3 py-1 select-none">
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => handleChangeLang(code)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition
                ${
                  lang === code
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              aria-label={`Switch language to ${label}`}
              title={`Switch language to ${label}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Auth Buttons */}
        <Button
          style="px-4 py-2 rounded-full font-semibold 
                 shadow-md hover:shadow-lg 
                 cursor-pointer border-black-300"
          onClick={() => navigate("/login")}
        >
          {t("header.login")}
        </Button>
        <Button
          style="px-4 py-2 rounded-full text-white font-semibold 
                 bg-gradient-to-r from-orange-500 to-yellow-400 
                 hover:from-orange-600 hover:to-yellow-500 
                 transform hover:scale-105 
                 transition-all duration-300 shadow-md hover:shadow-lg 
                 cursor-pointer"
          onClick={() => navigate("/signUp")}
        >
          {t("header.signUp")}
        </Button>
      </div>
    </header>
  );
}
