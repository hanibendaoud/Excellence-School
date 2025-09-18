import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  Users,
  BookOpen,
  LogOut,
  PlusCircle,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/useAuth";
import logo from "../assets/logo.svg";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
];

const TeacherDashboard = () => {
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: "add-course", label: t("dashboard.add_course"), icon: PlusCircle },
    { to: "students", label: t("dashboard.students"), icon: Users },
    { to: "courses", label: t("dashboard.courses"), icon: BookOpen },
    { to: "discussion", label: t("dashboard.discussion"), icon: MessageCircle },
  ];

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);

    if (lang === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = lang;
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const LanguageSelector = () => (
    <div className="flex gap-2 justify-center">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => changeLanguage(code)}
          className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition 
            ${
              i18n.language === code
                ? "bg-orange-500 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen bg-white shadow-lg flex-col border-r border-gray-200 fixed top-0 left-0 z-30">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col items-center gap-3">
            <img src={logo} alt="Excellence School" className="w-16 h-16" />
            <div className="text-center">
              <h1 className="font-bold text-base text-gray-800">
                Excellence School
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Teacher Portal
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="px-4 py-4 border-t border-gray-100 flex flex-col gap-3">
          <LanguageSelector />
          <button
            onClick={logout}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t("dashboard.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <div>
              <h1 className="font-bold text-sm text-gray-800">
                Excellence School
              </h1>
              <p className="text-xs text-gray-500">Teacher Portal</p>
            </div>
          </div>
          <button onClick={closeMobileMenu}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100 flex flex-col gap-3">
          <LanguageSelector />
          <button
            onClick={() => {
              logout();
              closeMobileMenu();
            }}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t("dashboard.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <header className="sticky top-0 z-20 h-16 bg-white shadow-sm border-b border-gray-200">
          <div className="h-full flex items-center justify-between px-4 md:px-6">
            <button onClick={toggleMobileMenu} className="md:hidden">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-gray-800">
                {t("dashboard.welcome_teacher")}
              </h2>
              <p className="text-sm text-gray-500">
                {t("dashboard.teacher_manage")}
              </p>
            </div>

            <LanguageSelector />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
