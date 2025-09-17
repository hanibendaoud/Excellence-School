import { Outlet, NavLink } from "react-router-dom";
import { Users, BookOpen, FileText, UserCog, UserCheck, LogOut, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/useAuth";
import logo from '../assets/logo.svg';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const navItems = [
    { to: "requests", label: t("dashboard.requests"), icon: UserCheck },
    { to: "students", label: t("dashboard.students"), icon: Users },
    { to: "teachers", label: t("dashboard.teachers"), icon: UserCog },
    { to: "publications", label: t("dashboard.publications"), icon: FileText },
    { to: "teacher-account", label: t("dashboard.teacher_account"), icon: BookOpen },
    { to: "settings", label: t("dashboard.settings"), icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col border-r border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col items-center gap-3">
            <img src={logo} alt="Excellence School" className="w-20 h-20" />
            <div>
              <h1 className="font-bold text-lg text-gray-800">Excellence School</h1>
              <p className="text-xs text-gray-500 font-medium">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
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

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t("dashboard.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200">
          <div className="h-full flex items-center justify-between px-6">
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-gray-800">{t("dashboard.welcome_admin")}</h2>
              <p className="text-sm text-gray-500">{t("dashboard.manage")}</p>
            </div>

            {/* Language Selector */}
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              defaultValue={i18n.language}
              className="p-2 border rounded"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
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

export default AdminDashboard;
