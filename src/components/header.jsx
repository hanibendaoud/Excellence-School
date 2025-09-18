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

    // RTL support for Arabic
    if (code === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = code;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 md:px-8 py-3 gap-4">
        {/* Logo and School Name */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <img src={logo} alt={t("home.schoolName")} className="w-14 h-14 sm:w-20 sm:h-20" />
          <div className="leading-tight">
            <h1 className="text-sm sm:text-base font-bold">{t("home.welcome")}</h1>
            <h1 className="text-sm sm:text-base font-bold">{t("home.schoolName")}</h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-6 md:gap-8 text-sm sm:text-base font-medium">
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

        {/* Right-side Buttons and Language Selector */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap justify-center">
          {/* Language Selector */}
          <div className="flex items-center gap-2 border rounded-full px-2 py-1 sm:px-3 sm:py-1 select-none">
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => handleChangeLang(code)}
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition
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

          {/* Login & Sign Up Buttons */}
          <Button
            style="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold 
                   text-sm sm:text-base shadow-md hover:shadow-lg 
                   cursor-pointer border-black-300"
            onClick={() => navigate("/login")}
          >
            {t("header.login")}
          </Button>
          <Button
            style="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white font-semibold 
                   text-sm sm:text-base bg-gradient-to-r from-orange-500 to-yellow-400 
                   hover:from-orange-600 hover:to-yellow-500 
                   transform hover:scale-105 
                   transition-all duration-300 shadow-md hover:shadow-lg 
                   cursor-pointer"
            onClick={() => navigate("/signUp")}
          >
            {t("header.signUp")}
          </Button>
        </div>
      </div>
    </header>
  );
}
