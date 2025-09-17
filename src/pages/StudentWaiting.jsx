// src/pages/StudentWaiting.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.svg";
import wave from "../assets/wave.svg";

const StudentWaiting = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { auth, logout, login } = useAuth();
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [email, setEmail] = useState(auth?.email || "");
  const [password, setPassword] = useState(auth?.mdp || "");

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  const checkAcceptanceStatus = async (inputEmail = email, inputPassword = password) => {
    if (!inputEmail || !inputPassword) return;

    try {
      setCheckingStatus(true);
      const response = await fetch("https://excellenceschool.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputEmail, password: inputPassword })
      });

      if (response.ok) {
        const data = await response.json();
        const isAccepted = data.accepeter || data.user.accepeter;

        if (isAccepted) {
          login({ ...auth, email: inputEmail, mdp: inputPassword, accepter: true });
          navigate("/student/home");
        } else {
          alert(t("studentWaiting.messages.pending"));
        }
      }
    } catch (error) {
      console.error(t("studentWaiting.errors.checkStatus"), error);
      alert(t("studentWaiting.errors.tryLater"));
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    // Auto-refresh every 30s
    const interval = setInterval(() => checkAcceptanceStatus(email, password), 30000);
    return () => clearInterval(interval);
  }, [email, password]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
  <div className="h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-orange-50 to-white">
    {/* Decorative Waves */}
    <img src={wave} alt="wave" className="absolute top-0 right-0 w-64 md:w-80 pointer-events-none select-none z-0 opacity-20" />
    <img src={wave} alt="wave" className="absolute bottom-0 left-0 w-64 md:w-80 rotate-180 pointer-events-none select-none z-0 opacity-20" />

    {/* Content Container */}
    <div className="relative z-10 w-full max-w-3xl h-full flex flex-col justify-center items-center text-center">
      
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <select
          className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="ar">العربية</option>
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl px-6 py-4 w-full max-w-xl">
        {/* Logo and Title */}
        <div className="mb-4">
          <img src={logo} alt={t("studentWaiting.labels.logoAlt")} className="w-16 h-16 mx-auto mb-2 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-800">{t("studentWaiting.labels.schoolName")}</h1>
          <p className="text-gray-600 text-sm">{t("studentWaiting.labels.schoolSubtitle")}</p>
        </div>

        {/* Email & Password */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-3">
          <input
            type="email"
            placeholder={t("studentWaiting.labels.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-1/2 text-sm"
          />
          <input
            type="password"
            placeholder={t("studentWaiting.labels.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-1/2 text-sm"
          />
        </div>

        {/* Check Button */}
        <button
          onClick={() => checkAcceptanceStatus(email, password)}
          disabled={checkingStatus}
          className={`w-full sm:w-auto px-6 py-2 bg-orange-500 text-white rounded font-medium text-sm transition-colors ${checkingStatus ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"}`}
        >
          {checkingStatus ? t("studentWaiting.buttons.checking") : t("studentWaiting.buttons.checkStatus")}
        </button>

        {/* Review Message */}
        <div className="mt-4 text-left">
          <h2 className="text-lg font-semibold text-gray-800">{t("studentWaiting.titles.underReview")}</h2>
          <p className="text-sm text-gray-600">{t("studentWaiting.messages.welcome")}</p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-2 text-sm text-blue-700 rounded">
            <p className="font-bold">{t("studentWaiting.labels.nextStepsTitle")}</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>{t("studentWaiting.labels.nextSteps.adminReview")}</li>
              <li>{t("studentWaiting.labels.nextSteps.dashboardAccess")}</li>
              <li>{t("studentWaiting.labels.nextSteps.autoRefresh")}</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mt-3 text-sm text-gray-600">
            <p><strong>{t("studentWaiting.labels.email")}:</strong> {email}</p>
            <p><strong>{t("studentWaiting.labels.level")}:</strong> {auth?.level}</p>
            <p><strong>{t("studentWaiting.labels.status")}:</strong> <span className="text-orange-600">{t("studentWaiting.labels.pendingApproval")}</span></p>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto text-sm"
          >
            {t("studentWaiting.buttons.logout")}
          </button>
        </div>
      </div>

      {/* Auto Refresh Info */}
      <p className="mt-3 text-xs text-gray-500">{t("studentWaiting.messages.autoRefreshInfo")}</p>
    </div>
  </div>
);

};

export default StudentWaiting;
