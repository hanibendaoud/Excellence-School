import { useEffect, useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import wave from "../assets/wave.svg";
import logo from "../assets/logo.svg";
import { OptionsContext } from "../Context/optionsContext";

export default function Register() {
  const navigate = useNavigate();

  // Controls whether we are in signup or confirmation step
  const [success, setSuccess] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { levels, subjects } = useContext(OptionsContext);

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    academicLevel: "",
    subjects: [], // multiple subjects
    password: "",
    confirmPassword: "",
    code: "",
  });


  const [error, setError] = useState("");



  // Handle change
  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (name === "subjects") {
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setFormData({ ...formData, subjects: selected });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
  };

  // ===================== REGISTER =====================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0][0-9]{9}$/;


    if (!emailRegex.test(formData.email)) {
      return setError("Please enter a valid email address.");
    }
    if (!phoneRegex.test(formData.phone)) {
      return setError("Phone number must be 10 digits starting with 0.");
    }
    if (!formData.academicLevel) {
      return setError("Please select your academic level.");
    }
    if (!formData.subjects.length) {
      return setError("Please select at least one subject.");
    }
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }

    try {
      const bod = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        phonenumber: formData.phone,
        academiclevel: formData.academicLevel,
        password: formData.password,
        subjects: formData.subjects.map((s) => ({
          subject: s,
          teacher: "",
          classroom: "",
          timing: "",
          day: "",
        })),
      };

      const response = await fetch(
        "https://excellenceschool.onrender.com/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bod),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Server error ${response.status}: ${errorData}`);
      }

      await response.json();
      setSuccess(true);
    } catch (err) {
      console.error("Register error:", err);
      setError("Registration failed. Please try again.");
    }
  };

  // ===================== CONFIRM CODE =====================
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
      subjects: formData.subjects.map((s) => ({
        subject: s,
        teacher: "",
        classroom: "",
        timing: "",
        day: "",
      })),
      verificationCode: formData.code.toString(),
    };

    try {
      const response = await fetch(
        "https://excellenceschool.onrender.com/Confirm_your_account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error && Array.isArray(errorData.error)) {
          const errorMessages = errorData.error
            .map((err) => `${err.path}: ${err.msg}`)
            .join("; ");
          setError(errorMessages);
        } else {
          setError(
            `Server error ${response.status}: ${
              errorData.message || "Unknown error"
            }`
          );
        }
        return;
      }

      await response.json();
      setIsVerified(true);
      navigate("/dashboard");
    } catch (err) {
      console.error("Confirm error:", err);
      setError("Account confirmation failed. Please try again.");
    }
  };

  // ===================== JSX =====================
  return (
    <div className="h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <img
        src={wave}
        alt="wave"
        className="absolute top-0 right-0 w-[28rem] md:w-[36rem] z-0"
      />
      <img
        src={wave}
        alt="wave"
        className="absolute bottom-0 left-0 w-[28rem] md:w-[36rem] rotate-180 z-0"
      />

      {/* ===================== CONFIRM ===================== */}
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
            <div className="mb-4 p-3 bg-red-100 border text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="flex justify-center gap-2">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={formData.code[i] || ""}
                  className="w-12 h-12 border rounded-md text-center text-lg"
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    const newCode = formData.code.split("");
                    newCode[i] = value;
                    setFormData({ ...formData, code: newCode.join("") });
                    if (value && i < 5) e.target.nextSibling?.focus();
                  }}
                />
              ))}
            </div>

            <p className="text-sm text-gray-500">
              Didn’t get the code?{" "}
              <span
                className="text-orange-500 cursor-pointer hover:underline"
                onClick={() => console.log("Resend new code")}
              >
                Resend
              </span>
            </p>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="w-1/2 border py-3 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-gradient-to-r from-orange-400 to-orange-500 py-3 rounded-md text-white font-medium hover:opacity-90"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ===================== REGISTER ===================== */
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-8">
          {/* Left */}
          <div className="md:w-1/2 text-center p-6">
            <img src={logo} alt="logo" className="w-[30%] mb-4 mx-auto" />
            <p className="text-2xl font-bold">Excellence School</p>
            <p className="text-gray-600 mb-6 text-lg">مدرسة التميز الخاصة</p>
            <h2 className="text-3xl text-orange-500 font-bold mb-4">
              Join Us Today!
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Create an account to view lessons and the latest school news.
            </p>
          </div>

          {/* Right */}
          <div className="md:w-1/2 w-full">
  <h2 className="text-lg font-semibold text-[#FF5722] mb-3">
    Let’s get started
  </h2>

  {error && (
    <div className="mb-3 p-2 bg-red-100 border text-red-600 rounded-md text-sm">
      {error}
    </div>
  )}

  <form className="space-y-2.5" onSubmit={handleRegisterSubmit}>
    {/* Names */}
    <div className="grid grid-cols-2 gap-2.5">
      <input
        autoComplete="off"
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        className="w-full border p-2 rounded-md text-sm"
      />
      <input
        autoComplete="off"
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        className="w-full border p-2 rounded-md text-sm"
      />
    </div>

    {/* Email */}
    <div className="relative">
      <FaEnvelope className="absolute right-2.5 top-3 text-gray-400 text-sm" />
      <input
        autoComplete="off"
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border p-2 rounded-md pr-8 text-sm"
      />
    </div>

    {/* Phone */}
    <div className="relative">
      <FaPhone className="absolute right-2.5 top-3 text-gray-400 text-sm" />
      <input
        autoComplete="off"
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className="w-full border p-2 rounded-md pr-8 text-sm"
      />
    </div>

    {/* Academic Level */}
    <select
      name="academicLevel"
      value={formData.academicLevel}
      onChange={handleChange}
      className="w-full border p-2 rounded-md text-sm"
    >
      <option value="">Select Academic Level</option>
      {levels.map((l, idx) => (
        <option key={idx} value={l}>
          {l}
        </option>
      ))}
    </select>

    {/* Subjects */}
    <div>
  <p className="mb-1.5 font-medium text-sm">Select Subjects:</p>
  <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto border rounded-md p-1.5 text-sm">
    {subjects.map((s, idx) => (
      <label key={idx} className="flex items-center gap-1.5">
        <input
          type="checkbox"
          value={s}
          checked={formData.subjects.includes(s)}
          onChange={(e) => {
            if (e.target.checked) {
              setFormData({
                ...formData,
                subjects: [...formData.subjects, s],
              });
            } else {
              setFormData({
                ...formData,
                subjects: formData.subjects.filter((sub) => sub !== s),
              });
            }
          }}
          className="w-3.5 h-3.5"
        />
        {s}
      </label>
    ))}
  </div>
</div>

    {/* Passwords */}
    <div className="relative">
      <FaLock className="absolute right-2.5 top-3 text-gray-400 text-sm" />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full border p-2 rounded-md text-sm"
      />
    </div>
    <div className="relative">
      <FaLock className="absolute right-2.5 top-3 text-gray-400 text-sm" />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="w-full border p-2 rounded-md text-sm"
      />
    </div>

    {/* Login link */}
    <p className="text-center text-xs text-gray-500">
      Already have an account?{" "}
      <span
        className="text-orange-500 cursor-pointer"
        onClick={() => navigate("/login")}
      >
        Log in
      </span>
    </p>

    {/* Buttons */}
    <div className="flex gap-2.5">
      <button
        type="button"
        className="w-1/2 border py-2 rounded-md hover:bg-gray-100 text-sm"
        onClick={() => navigate("/")}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="w-1/2 bg-gradient-to-r from-orange-400 to-orange-500 py-2 rounded-md text-white font-medium text-sm hover:opacity-90"
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
