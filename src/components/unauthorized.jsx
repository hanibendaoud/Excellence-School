import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/useAuth";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/");
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <div className="text-red-500 text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("unauthorized.title")}</h1>
        <p className="text-gray-600 mb-6">{t("unauthorized.message")}</p>
        
        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            {t("unauthorized.go_back")}
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            {t("unauthorized.go_home")}
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            {t("unauthorized.logout")}
          </button>
        </div>

        {/* Language Selector */}
        <div className="mt-6">
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
      </div>
    </div>
  );
};

export default Unauthorized;
