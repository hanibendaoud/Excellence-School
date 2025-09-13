import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import logo from "../assets/logo.svg";
import wave from "../assets/wave.svg";

const StudentWaiting = () => {
  const navigate = useNavigate();
  const { auth, logout, login } = useAuth();
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Auto-refresh to check acceptance status every 30 seconds
  useEffect(() => {
    const checkAcceptanceStatus = async () => {
      if (!auth?.email) return;

      try {
        setCheckingStatus(true);
        const response = await fetch("https://excellenceschool.onrender.com/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: auth.email, password: auth.mdp }) // You might need a better endpoint
        });

        if (response.ok) {
          const data = await response.json();
          const isAccepted = data.accepeter || data.user.accepeter;
          
          if (isAccepted) {
            // Update auth with new acceptance status
            login({
              ...auth,
              accepter: true
            });
            navigate("/student/home");
          }
        }
      } catch (error) {
        console.error("Error checking acceptance status:", error);
      } finally {
        setCheckingStatus(false);
      }
    };

    // Check immediately
    checkAcceptanceStatus();

    // Set up interval to check every 30 seconds
    const interval = setInterval(checkAcceptanceStatus, 30000);

    return () => clearInterval(interval);
  }, [auth?.email, navigate, login, auth]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleRefresh = async () => {
    if (!auth?.email) return;
    
    try {
      setCheckingStatus(true);
      const response = await fetch("https://excellenceschool.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: auth.email, password: auth.mdp }) 
      });

      if (response.ok) {
        const data = await response.json();
        const isAccepted = data.accepeter || data.user.accepeter;
        
        if (isAccepted) {
          login({
            ...auth,
            accepter: true
          });
          navigate("/student/home");
        } else {
          // Show a message that they're still pending
          alert("Your application is still being reviewed. Please wait for approval.");
        }
      }
    } catch (error) {
      console.error("Error checking status:", error);
      alert("Error checking your status. Please try again later.");
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-orange-50 to-white">
      {/* Background waves */}
      <img 
        src={wave} 
        alt="wave background" 
        className="absolute top-0 right-0 w-[28rem] md:w-[36rem] pointer-events-none select-none z-0 opacity-30"
      />
      <img 
        src={wave} 
        alt="wave background" 
        className="absolute bottom-0 left-0 w-[28rem] md:w-[36rem] rotate-180 pointer-events-none select-none z-0 opacity-30"
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Logo and School Info */}
        <div className="mb-8">
          <img 
            src={logo} 
            alt="Excellence School logo" 
            className="w-24 h-24 mx-auto mb-4 animate-pulse"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Excellence School</h1>
          <p className="text-gray-600 text-lg">مدرسة التميز الخاصة</p>
        </div>

        {/* Waiting Message */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-orange-500 animate-spin" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Application Under Review
            </h2>
            
            <p className="text-gray-600 mb-4">
              Welcome! Your registration has been submitted successfully and is currently being reviewed by our admin team.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <strong>What's Next:</strong>
                  </p>
                  <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                    <li>Our admin will review your subjects and assign teachers</li>
                    <li>You'll receive access to your dashboard once approved</li>
                    <li>This page will automatically refresh when you're accepted</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Student Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Your Information:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Email:</strong> {auth?.email}</p>
              <p><strong>Academic Level:</strong> {auth?.level}</p>
              <p><strong>Status:</strong> <span className="text-orange-600">Pending Approval</span></p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRefresh}
              disabled={checkingStatus}
              className={`flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium transition-colors ${
                checkingStatus ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
              }`}
            >
              {checkingStatus ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Checking...
                </div>
              ) : (
                "Check Status Now"
              )}
            </button>
            
            <button
              onClick={handleLogout}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Auto-refresh info */}
        <p className="text-sm text-gray-500">
          This page automatically checks your status every 30 seconds
        </p>
      </div>
    </div>
  );
};

export default StudentWaiting;