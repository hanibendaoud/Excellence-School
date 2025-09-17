import { useEffect, useState  } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import wave from "../assets/wave.svg"; 
import logo from "../assets/logo.svg"; 
import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const {auth, login, setLoading, loading} = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    
    const body = {
      email: formData.email,
      password: formData.password,
    };
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("https://excellenceschool.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json(); 
      
      if (!response.ok) {
        throw new Error(data.message || `Server error ${response.status}`);
      }
      
      console.log("Login success:", data);
      
      const teacher = data.user.subjects && data.user.subjects.length > 0 
        ? data.user.subjects[0].teacher 
        : null;

      login({
        accessToken: data.token,                 
        email: data.user.email,                  
        role: data.msg,                         
        level: data.user.academiclevel || data.user.subjects[0]?.academiclevel,
        teacher: teacher,
        id: data.user._id,
        accepter: data.accepeter || data.user.accepeter,
        mdp:formData.password,
        fullname:`${data.user.firstname} ${data.user.lastname}`
      });

      if (data.msg === "student") {
        const isAccepted = data.accepeter || data.user.accepeter;
        if (isAccepted) {
          navigate("/student/home");
        } else {
          navigate("/student/waiting");
        }
      } else if (data.msg === "teacher") {
        navigate("/teacher/home");
      } else {
        navigate("/"); 
      }
      
    } catch (err) {
      console.error("Login failed:", err.message);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Auth state:", auth);
  }, [auth]);

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

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-8">
        
        <div className="md:w-1/2 flex flex-col items-center justify-center text-center p-6 font-['Inria_Serif']">
          <img 
            src={logo} 
            alt="Excellence School logo" 
            className="w-[30%] mb-4"
          />

          <p className="text-2xl font-bold">Excellence School</p>
          <p className="text-gray-600 mb-6 text-lg">مدرسة التميز الخاصة</p>
          <h2 className="text-3xl text-orange-500 font-bold mb-4">
            Welcome Back!
          </h2>

          <p className="text-gray-600 max-w-md">
            Log in to access your account, explore lessons, and stay updated 
            with the latest school news.
          </p>
        </div>

        <div className="md:w-1/2 p-6">
          <h2 className="text-xl font-semibold text-[#FF5722] mb-6">
            Log in to your account
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute right-3 top-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                autoComplete="off"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute right-3 top-4 text-gray-400" />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border p-3 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <p className="text-right text-sm text-gray-500 cursor-pointer hover:underline" 
              onClick={() => navigate('/resetPassword')}>
              Forgot password?
            </p>

            <div className="flex gap-4">
              <button
                type="button"
                className="w-1/2 border py-3 rounded-md font-medium hover:bg-gray-100 transition"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-1/2 flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-500 py-3 rounded-md text-white font-medium transition
                  ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 animate-spin text-white"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Log in"
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <span
              className="text-orange-500 cursor-pointer hover:underline"
              onClick={() => navigate("/signUp")}
            >
              Sign up
            </span>
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
  Are you a teacher or admin?{" "}
  <span
    className="text-blue-500 cursor-pointer hover:underline"
    onClick={() => navigate("/teacherLogin")}
  >
    Log in here
  </span>
</p>
        </div>
      </div>
    </div>
  );
};

export default Login;