import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import wave from "../assets/wave.svg"; 
import logo from "../assets/logo.svg"; 

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    // TODO: call API or auth logic here
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

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute right-3 top-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded-md pr-10"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute right-3 top-4 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border p-3 rounded-md pr-10"
              />
            </div>

            <p className="text-right text-sm text-gray-500 cursor-pointer hover:underline" onClick={()=>{
              navigate('/resetPassword')
            }}>
              Forgot password?
            </p>

            <div className="flex gap-4">
              <button
                type="button"
                className="w-1/2 border py-3 rounded-md font-medium hover:bg-gray-100 transition"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-gradient-to-r from-orange-400 to-orange-500 py-3 rounded-md text-white font-medium hover:opacity-90 transition"
              >
                Log in
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <span
              className="text-orange-500 cursor-pointer hover:underline"
              onClick={() => navigate("/signUp")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
