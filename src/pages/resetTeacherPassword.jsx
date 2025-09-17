import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import wave from "../assets/wave.svg";
import logo from "../assets/logo.svg";

export default function ResetPasswordTeacher() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://excellenceschool.onrender.com/Reset_your_passwordteacher",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      if (!response.ok) throw new Error(`Server error ${response.status}`);
      await response.json();
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://excellenceschool.onrender.com/Reset_your_password2teacher",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, verificationCode: formData.code }),
        }
      );

      if (!response.ok) throw new Error(`Server error ${response.status}`);
      await response.json();
      setStep(3);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }
    try {
      const response = await fetch(
        "https://excellenceschool.onrender.com/Reset_your_password3teacher",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.newPassword }),
        }
      );

      if (!response.ok) throw new Error(`Server error ${response.status}`);
      await response.json();
      navigate("/teacher/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <img src={wave} alt="wave" className="absolute top-0 right-0 w-[28rem] md:w-[36rem] z-0 pointer-events-none select-none" />
      <img src={wave} alt="wave" className="absolute bottom-0 left-0 w-[28rem] md:w-[36rem] rotate-180 z-0 pointer-events-none select-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-4xl gap-8">
        <div className="md:w-1/2 flex flex-col items-center justify-center text-center p-6 font-['Inria_Serif']">
          <img src={logo} alt="Excellence School logo" className="w-[30%] mb-4" />
          <p className="text-2xl font-bold">Excellence School</p>
          <p className="text-gray-600 mb-6 text-lg">مدرسة التميز الخاصة</p>
        </div>

        <div className="w-full md:w-1/2">
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold text-[#2196F3] mb-6">
                Reset your password
              </h2>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="relative">
                  <FaEnvelope className="absolute right-3 top-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-md pr-10"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/teacher/login")}
                    className="w-1/2 border py-3 rounded-md font-medium hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-gradient-to-r from-blue-400 to-blue-500 py-3 rounded-md text-white font-medium hover:opacity-90 transition"
                  >
                    Next
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold text-[#2196F3] mb-6">
                Enter confirmation code
              </h2>
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div className="flex justify-center gap-2">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={formData.code[i] || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        const newCode = formData.code.split("");
                        newCode[i] = value;
                        setFormData({ ...formData, code: newCode.join("") });
                        if (value && i < 5) e.target.nextSibling?.focus();
                      }}
                      className="w-12 h-12 border rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/2 border py-3 rounded-md font-medium hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-gradient-to-r from-blue-400 to-blue-500 py-3 rounded-md text-white font-medium hover:opacity-90 transition"
                  >
                    Next
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold text-[#2196F3] mb-6">
                Set a new password
              </h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="relative">
                  <FaLock className="absolute right-3 top-4 text-gray-400" />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-md pr-10"
                    required
                  />
                </div>
                <div className="relative">
                  <FaLock className="absolute right-3 top-4 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-md pr-10"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/2 border py-3 rounded-md font-medium hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-gradient-to-r from-blue-400 to-blue-500 py-3 rounded-md text-white font-medium hover:opacity-90 transition"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
