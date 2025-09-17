import { Outlet, NavLink } from "react-router-dom";
import { Bell, User, LogOut, Home, Calendar, BookOpen, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/useAuth";
import logo from "../assets/logo.svg";

const StudentDashboard = () => {
  const { t, i18n } = useTranslation();
  const { logout, auth } = useAuth();

  const navItems = [
    { to: "home", label: t("studentDashboard.nav.home"), icon: Home },
    { to: "timetable", label: t("studentDashboard.nav.timetable"), icon: Calendar },
    { to: "lessons", label: t("studentDashboard.nav.lessons"), icon: BookOpen },
    { to: "discussion", label: t("studentDashboard.nav.discussion"), icon: MessageCircle },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col border-r border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col items-center gap-3">
            <img src={logo} alt="Excellence School" className="w-20 h-20" />
            <div>
              <h1 className="font-bold text-lg text-gray-800">Excellence School</h1>
              <p className="text-xs text-gray-500 font-medium">{t("studentDashboard.portal")}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg shadow-orange-200"
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

        {/* Language Selector */}
        <div className="px-4 py-3 border-t border-gray-100">
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            defaultValue={i18n.language}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t("studentDashboard.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200">
          <div className="h-full flex items-center justify-between px-6">
            {/* Welcome Message */}
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-gray-800">
                {t("studentDashboard.welcome")}
              </h2>
              <p className="text-sm text-gray-500">{t("studentDashboard.manage")}</p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 text-sm">
                    {auth.fullname || t("studentDashboard.unknown")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {auth.level || t("studentDashboard.noLevel")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
