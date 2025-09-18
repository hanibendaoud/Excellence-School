import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  Bell,
  User,
  LogOut,
  Home,
  Calendar,
  BookOpen,
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

const StudentDashboard = () => {
  const { t, i18n } = useTranslation();
  const { logout, auth } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: "home", label: t("studentDashboard.nav.home"), icon: Home },
    { to: "timetable", label: t("studentDashboard.nav.timetable"), icon: Calendar },
    { to: "lessons", label: t("studentDashboard.nav.lessons"), icon: BookOpen },
    { to: "discussion", label: t("studentDashboard.nav.discussion"), icon: MessageCircle },
  ];

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);

    // Gestion RTL si arabe
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
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
      <aside className="hidden md:flex w-52 h-screen bg-white shadow-lg flex-col border-r border-gray-200 fixed top-0 left-0 z-30">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col items-center gap-2">
            <img src={logo} alt="Logo" className="w-14 h-14" />
            <div className="text-center">
              <h1 className="font-bold text-sm text-gray-800 leading-tight">Excellence School</h1>
              <p className="text-[10px] text-gray-500 font-medium">{t("studentDashboard.portal")}</p>
            </div>
          </div>
        </div>

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
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="px-4 py-3 border-t border-gray-100 flex flex-col gap-3">
          <LanguageSelector />
          <button
            onClick={logout}
            className="group flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">{t("studentDashboard.logout")}</span>
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
              <h1 className="font-bold text-sm text-gray-800">Excellence School</h1>
              <p className="text-xs text-gray-500">{t("studentDashboard.portal")}</p>
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
                `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
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

        <div className="px-4 py-3 border-t border-gray-100 flex flex-col gap-3">
          <LanguageSelector />
          <button
            onClick={() => {
              logout();
              closeMobileMenu();
            }}
            className="group flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t("studentDashboard.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-52">
        <header className="sticky top-0 z-20 h-16 bg-white shadow-sm border-b border-gray-200">
          <div className="h-full flex items-center justify-between px-4 md:px-6">
            <button onClick={toggleMobileMenu} className="md:hidden">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-gray-800">
                {t("studentDashboard.welcome")}
              </h2>
              <p className="text-sm text-gray-500">{t("studentDashboard.manage")}</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 text-sm">{auth.fullname || "..."}</p>
                  <p className="text-xs text-gray-500">{auth.level || t("studentDashboard.noLevel")}</p>
                </div>
              </div>
            </div>
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

export default StudentDashboard;
