import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./button";
import logo from "../assets/logo.svg";

export default function Header() {
  const navigate = useNavigate()
  const sections = ["home", "about", "activities", "contact"];
  const [active, setActive] = useState("home");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScroll = (e, id) => {
    e.preventDefault();

    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    setActive(id);
  };

  
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-8 shadow-sm bg-white">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Excellence School" className="w-20 h-20" />
        <div className="leading-tight">
          <h1 className="text-lg font-bold">Excellence</h1>
          <h1 className="text-lg font-bold">School</h1>
        </div>
      </div>

      <nav>
        <ul className="flex items-center gap-8 text-sm font-medium">
          {sections.map((id) => (
            <li key={id} className="relative">
              <a
                href={`#${id}`}
                onClick={(e) => handleScroll(e, id)}
                className={`hover:text-orange-500 transition ${
                  active === id ? "text-orange-500" : "text-gray-700"
                }`}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
              {active === id && (
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-orange-400 to-yellow-400"></span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex gap-6">
                <Button style="px-4 py-2 rounded-full font-semibold 
                        shadow-md hover:shadow-lg 
                        cursor-pointer border-black-300"
                        onClick={()=>navigate('/login')}>
                  Login
                </Button>
                <Button style="px-4 py-2 rounded-full text-white font-semibold 
                        bg-gradient-to-r from-orange-500 to-yellow-400 
                        hover:from-orange-600 hover:to-yellow-500 
                        transform hover:scale-105 
                        transition-all duration-300 shadow-md hover:shadow-lg 
                        cursor-pointer"
                        onClick={()=>navigate('/signUp')}>
                  Sign Up
                </Button>
      </div>

    </header>
  );
}
