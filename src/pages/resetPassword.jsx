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
const handleEmailSubmit = async (e)=>{
  e.preventDefault();

  try{
    const response = await fetch("https://excellenceschool.onrender.com/Reset_your_password",
      {
        method : "POST",
        headers :  {"Content-Type" : "application/json"},
        body : JSON.stringify({email : formData.email})
      }
    )
    if (!response.ok){
      throw new Error(`Server error ${response.status}`)
    }
    const data = response.json();
    console.log(data)
    setStep(2)
  }catch(err){
    console.log(err)
  }
}
const handleCodeSubmit = async (e)=>{

  e.preventDefault();
  const payload = {email: formData.email, verificationCode: formData.code.toString()};
console.log('Sending payload:', payload);
console.log('Email type:', typeof formData.email);
console.log('Code type:', typeof formData.code);
console.log('Code value:', formData.code);
  console.log({email: formData.email , verificationCode :formData.code})
  try{
    const response = await fetch("https://excellenceschool.onrender.com/Reset_your_password2",{
      method : "POST",
      headers :  {"Content-Type":"application/json"},
      body : JSON.stringify({email: formData.email , verificationCode : formData.code})
    })
    if (!response.ok){
      throw new Error(`Serve error ${response.status}`)
    }
    
    const data = await response.json()
    console.log(data)
    setStep(3)
  }catch(err){
    console.log(err)
  }
}
const handlePasswordSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = { email: formData.email, password: formData.newPassword };
    console.log("Submitting payload:", payload);

    const response = await fetch('https://excellenceschool.onrender.com/Reset_your_password3', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text(); // capture backend error
      throw new Error(`Server error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Server response:", data);

    navigate('/login');
  } catch (err) {
    console.error("Password reset failed:", err);
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
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="relative">
                  <FaEnvelope className="absolute right-3 top-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    autoComplete="off"
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
              <form onSubmit={handleCodeSubmit} className="space-y-4">
      {/* OTP Inputs */}
      <div className="flex justify-center gap-2">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            value={formData.code[i] || ""}
            className="w-12 h-12 border rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              if (!value && i > 0) {
                e.target.previousSibling?.focus();
              }
              const newCode = formData.code.split("");
              newCode[i] = value;
              setFormData({ ...formData, code: newCode.join("") });
              if (value && i < 5) {
                e.target.nextSibling?.focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !formData.code[i] && i > 0) {
                e.preventDefault();
                e.target.previousSibling?.focus();
              }
            }}
          />
        ))}
      </div>

      {/* Resend link */}
      <p className="text-sm text-gray-500">
        Didn’t get the code?{" "}
        <span
          className="text-orange-500 cursor-pointer hover:underline"
          onClick={() => console.log("Resend new code")}
        >
          Resend new code
        </span>
      </p>

      {/* Buttons */}
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
