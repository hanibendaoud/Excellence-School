import { Outlet, NavLink } from "react-router-dom";
import {
  Users,
  BookOpen,
  FileText,
  UserCog,
  UserCheck,
  LogOut,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/useAuth";
import logo from "../assets/logo.svg";
import { useState } from "react";
const AdminDashboard = () => {
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "en");
  
  const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
];

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


  const navItems = [
    { to: "requests", label: t("dashboard.requests"), icon: UserCheck },
    { to: "students", label: t("dashboard.students"), icon: Users },
    { to: "teachers", label: t("dashboard.teachers"), icon: UserCog },
    { to: "publications", label: t("dashboard.publications"), icon: FileText },
    {
      to: "teacher-account",
      label: t("dashboard.teacher_account"),
      icon: BookOpen,
    },
    { to: "settings", label: t("dashboard.settings"), icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-lg flex flex-col border-r border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col items-center gap-2">
            <img src={logo} alt="Excellence School" className="w-12 h-12" />
            <div className="text-center">
              <h1 className="font-bold text-sm text-gray-800 leading-tight">
                Excellence School
              </h1>
              <p className="text-[10px] text-gray-500 font-medium">
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm truncate">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={logout}
            className="group flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">{t("dashboard.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-gray-800">
              {t("dashboard.welcome_admin")}
            </h2>
            <p className="text-sm text-gray-500">{t("dashboard.manage")}</p>
          </div>

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
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 min-h-0 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
