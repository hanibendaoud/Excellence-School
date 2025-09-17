import { useNavigate } from "react-router-dom";
import languageImg from "../assets/langue.jpg"; // Replace with correct path
import techImg from "../assets/dawarat.jpg";        // Replace with correct path
import privateImg from "../assets/cours.jpg";  // Replace with correct path
import logo from "../assets/logo.svg";                  

const HomePage = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "دورات تعليمية للغات الأجنبية",
      img: languageImg,
    },
    {
      title: "دورات تكوينية في مجالات متعددة",
      img: techImg,
    },
    {
      title: "الدروس الخصوصية",
      img: privateImg,
      onClick: () => navigate("/signUp"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white p-6">
      {/* Logo and Title */}
      <div className="text-center mb-10">
        <img src={logo} alt="Logo" className="w-20 h-20 mx-auto mb-2" />
        <h1 className="text-2xl font-bold text-gray-800">Excellence School</h1>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden`}
          >
            <img src={card.img} alt={card.title} className="w-full h-48 object-cover" />
            <div className="p-4 text-center">
              <h2 className="text-sm md:text-base font-semibold text-gray-800">{card.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
