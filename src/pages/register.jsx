import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import wave from "../assets/wave.svg";
import logo from "../assets/logo.svg";
export default function Register() {
  const navigate = useNavigate();
  // Controls whether we are in signup or confirmation step
  const [success, setSuccess] = useState(false);
  const [isVerified , setIsVerified] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    academicLevel: "",
    subjects: "",
    password: "",
    confirmPassword: "",
    code: "", 
  });

  const [focus, setFocus] = useState({});
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // clear error when user types
  };

  const handleFocus = (field) => {
    setFocus((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocus((prev) => ({ ...prev, [field]: false }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Regex patterns
    const nameRegex = /^[A-Za-z]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0][0-9]{9}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

    // Validation checks
    if (!nameRegex.test(formData.firstName)) {
      return setError("First name must be at least 2 letters, letters only.");
    }
    if (!nameRegex.test(formData.lastName)) {
      return setError("Last name must be at least 2 letters, letters only.");
    }
    if (!emailRegex.test(formData.email)) {
      return setError("Please enter a valid email address.");
    }
    if (!phoneRegex.test(formData.phone)) {
      return setError("Phone number must be 10 digits starting with 0.");
    }
    if (!formData.academicLevel) {
      return setError("Please select your academic level.");
    }
    if (!formData.subjects) {
      return setError("Please select at least one subject.");
    }
    if (!passwordRegex.test(formData.password)) {
      return setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
    }
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }
    try {
  console.log('Sending email:', formData.email);
  const bod = {
  firstname: formData.firstName,
  lastname: formData.lastName,
  email: formData.email,
  phonenumber: formData.phone,
  academiclevel: formData.academicLevel,
  password: formData.password,
  subjects: [{
    subject: formData.subjects, 
    teacher: "",
    classroom: "", 
    timing: "",
    day: "",
  }],
};
  const response = await fetch("https://excellenceschool.onrender.com/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bod)
  });
  
  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.text();
    console.log('Backend error response:', errorData);
    throw new Error(`Server error ${response.status}: ${errorData}`);
  }
  
  const data = await response.json();
  console.log("User registered:", data);
  setSuccess(true);
  
} catch (err) {
  console.error("Fetch error:", err);
  setError("Registration failed. Please try again.");
}
  };

const handleCodeSubmit = async (e) => {
  e.preventDefault();
  if (formData.code.length !== 6) {
    return setError("Please enter the 6-digit confirmation code.");
  }
const body = {
  firstname: formData.firstName,
  lastname: formData.lastName,
  email: formData.email,
  phonenumber: formData.phone,
  academiclevel: formData.academicLevel,
  password: formData.password,
  subjects: [{
    subject: formData.subjects, 
    teacher: "",
    classroom: "", 
    timing: "",
    day: "",
  }],
  verificationCode: formData.code.toString()
};

  console.log("Sending confirmation data:", body);
  setError("");
  try {
    const response = await fetch("https://excellenceschool.onrender.com/Confirm_your_account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.log('Backend error response:', errorData);
      
      if (errorData.error && Array.isArray(errorData.error)) {
        const errorMessages = errorData.error.map(err => `${err.path}: ${err.msg}`).join('; ');
        setError(errorMessages);
      } else {
        setError(`Server error ${response.status}: ${errorData.message || 'Unknown error'}`);
      }
      return;
    }
    const data = await response.json();
    console.log("Account confirmed:", data);
    setIsVerified(true);
    navigate("/dashboard");
  } catch (err) {
    console.error("Confirmation error:", err);
    setError("Account confirmation failed. Please try again.");
  }
};
  useEffect(()=>{
    console.log(isVerified)
  },[isVerified])
  return (
    <div className="h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background waves */}
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
      {/* ===================== Confirmation Step ===================== */}
      {success ? (
  <div className="relative z-10 w-full max-w-md text-center">
    <h2 className="text-xl font-semibold text-[#FF5722] mb-6">
      Enter confirmation code
    </h2>
    <p className="text-gray-600 mb-4">
      Enter the confirmation code you received in{" "}
      <span className="font-medium">{formData.email}</span>
    </p>
    {error && (
      <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-600 rounded-md text-sm">
        {error}
      </div>
    )}
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
          onClick={() => setSuccess(false)}
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
  </div>
) : (
        /* ===================== Registration Step ===================== */
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-8">
          {/* Left section */}
          <div className="md:w-1/2 flex flex-col items-center justify-center text-center p-6 font-['Inria_Serif']">
            <img
              src={logo}
              alt="Excellence School logo"
              className="w-[30%] mb-4"
            />
            <p className="text-2xl font-bold">Excellence School</p>
            <p className="text-gray-600 mb-6 text-lg">مدرسة التميز الخاصة</p>
            <h2 className="text-3xl text-orange-500 font-bold mb-4">
              Join Us Today!
            </h2>
            <p className="text-gray-600 max-w-md">
              Create an account to view the lessons published by teachers and
              the latest news about the school.
            </p>
          </div>

          {/* Form section */}
          <div className="md:w-1/2 w-full">
            <h2 className="text-xl font-semibold text-[#FF5722] mb-4">
              Let’s get started
            </h2>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <form className="space-y-3 text-base" onSubmit={handleRegisterSubmit}>
              {/* First + Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  autoComplete="off"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={() => handleFocus("firstName")}
                  onBlur={() => handleBlur("firstName")}
                  className="w-full border p-2.5 rounded-md"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  autoComplete="off"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={() => handleFocus("lastName")}
                  onBlur={() => handleBlur("lastName")}
                  className="w-full border p-2.5 rounded-md"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <FaEnvelope className="absolute right-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  autoComplete="off"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                  className="w-full border p-2.5 rounded-md pr-8"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <FaPhone className="absolute right-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  autoComplete="off"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => handleFocus("phone")}
                  onBlur={() => handleBlur("phone")}
                  className="w-full border p-2.5 rounded-md pr-8"
                />
              </div>

              {/* Academic Level */}
              <select
                name="academicLevel"
                required
                value={formData.academicLevel}
                onChange={handleChange}
                className={`w-full border p-2.5 rounded-md ${
                  formData.academicLevel ? "text-black" : "text-gray-400"
                }`}
              >
                <option value="">Select Academic Level</option>
                <option value="HighSchool">High School</option>
              </select>

              {/* Subjects */}
              <select
                name="subjects"
                required
                value={formData.subjects}
                onChange={handleChange}
                className={`w-full border p-2.5 rounded-md ${
                  formData.subjects ? "text-black" : "text-gray-400"
                }`}
              >
                <option value="">Select Subject</option>
                <option value="Math">Math</option>
              </select>

              {/* Password */}
              <div className="relative">
                <FaLock className="absolute right-3 top-3.5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="off"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border p-2.5 rounded-md"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <FaLock className="absolute right-3 top-3.5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  autoComplete="off"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border p-2.5 rounded-md"
                />
              </div>

              {/* Login link */}
              <p className="text-center text-xs text-gray-500">
                Already have an account?{" "}
                <span
                  className="text-orange-500 cursor-pointer"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Log in
                </span>
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  className="w-1/2 border py-2.5 rounded-md font-medium hover:bg-gray-100 transition"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-gradient-to-r from-orange-400 to-orange-500 py-2.5 rounded-md text-white font-medium hover:opacity-90 transition"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
