import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import wave from '../assets/wave.svg'
import logo from '../assets/logo.svg'
export default function Register() {
  const navigate= useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    academicLevel: "",
    subjects: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
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
            Join Us Today!
          </h2>

          <p className="text-gray-600 max-w-md">
            Create an account to view the lessons published by teachers and the
            latest news about the school.
          </p>
      </div>


      <div >
        <h2 className="text-xl font-semibold text-[#FF5722] mb-6">
          Let’s get started
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
            />
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <FaPhone className="absolute right-3 top-4 text-gray-400" />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-3 rounded-md pr-10"
              />
            </div>
            <input
              type="text"
              name="academicLevel"
              placeholder="Academic Level"
              value={formData.academicLevel}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
            />
          </div>

          <input
            type="text"
            name="subjects"
            placeholder="Choose the subjects you want to study"
            value={formData.subjects}
            onChange={handleChange}
            className="w-full border p-3 rounded-md"
          />
<div className="relative">
              <FaLock className="absolute right-3 top-4 text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-md"
          />
</div>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <span className="text-orange-500 cursor-pointer" onClick={()=>{
              navigate('/login')
            }}>Log in</span>
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
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);


}
