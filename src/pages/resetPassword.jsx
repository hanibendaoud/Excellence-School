import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import wave from "../assets/wave.svg";
import logo from "../assets/logo.svg";

export default function ResetPassword() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (formData.newPassword !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      console.log("Password reset:", formData);
      navigate("/login");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <img
        src={wave}
        alt="wave background"
        className="absolute top-0 right-0 w-[28rem] md:w-[36rem] pointer-events-none select-none z-0"
      />
      <img
        src={wave}
        alt="wave background"
        className="absolute bottom-0 left-0 w-[28rem] md:w-[36rem] rotate-180 pointer-events-none select-none z-0"
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-4xl gap-8">
        <div className="md:w-1/2 flex flex-col items-center justify-center text-center p-6 font-['Inria_Serif']">
          <img src={logo} alt="Excellence School logo" className="w-[30%] mb-4" />
          <p className="text-2xl font-bold">Excellence School</p>
          <p className="text-gray-600 mb-6 text-lg">مدرسة التميز الخاصة</p>
        </div>

        <div className="w-full md:w-1/2">
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold text-[#FF5722] mb-6">
                Reset your password
              </h2>
              <p className="text-gray-600 mb-4">
                Enter your email to receive a verification code and reset your
                password.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    onClick={() => navigate("/login")}
                    className="w-1/2 border py-3 rounded-md font-medium hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-gradient-to-r from-orange-400 to-orange-500 py-3 rounded-md text-white font-medium hover:opacity-90 transition"
                  >
                    Next
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold text-[#FF5722] mb-6">
                Enter confirmation code
              </h2>
              <p className="text-gray-600 mb-4">
                Enter the confirmation code you received in{" "}
                <span className="font-medium">{formData.email}</span>
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-6 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="border p-3 text-center rounded-md"
                      onChange={(e) => {
                        const newCode = formData.code.split("");
                        newCode[i] = e.target.value;
                        setFormData({ ...formData, code: newCode.join("") });
                      }}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-500">
                  Didn’t get the code?{" "}
                  <span className="text-orange-500 cursor-pointer">
                    Resend new code
                  </span>
                </p>

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
                    className="w-1/2 bg-gradient-to-r from-orange-400 to-orange-500 py-3 rounded-md text-white font-medium hover:opacity-90 transition"
                  >
                    Next
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold text-[#FF5722] mb-6">
                Set a new password
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-1/2 bg-gradient-to-r from-orange-400 to-orange-500 py-3 rounded-md text-white font-medium hover:opacity-90 transition"
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
