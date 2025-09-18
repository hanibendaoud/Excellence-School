import Header from "../components/header";
import Footer from "../components/footer";
import Button from "../components/button";
import home_ill from "../assets/home-illu.svg";
import classRooms from "../assets/classrooms.jpg";
import classroom2 from "../assets/classroom2.jpg";
import classroom3 from "../assets/classroom3.jpg";
import video from "../assets/video.mp4";
import localisation from "../assets/localisation.jpg";
import reception from "../assets/reception.jpg";
import youtube from "../assets/2fe57969df892a2b4c651a126c9aaa2051b6280e.png";
import activity1 from "../assets/quran.jpg";
import activity2 from "../assets/takreem.jpg";
import activity3 from "../assets/sorties.jpg";
import activity4 from "../assets/workshops.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const classroomImages = [classRooms, classroom2, classroom3];

  function clickHandle() {
    navigate("/i");
  }

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    const accepter = localStorage.getItem("accepter");

    if (token) {
      if (role === "student") {
        if (accepter === "true") {
          navigate("/student/home", { replace: true });
        } else {
          navigate("/student/waiting", { replace: true });
        }
      } else if (role === "admin") {
        navigate("/admin/requests", { replace: true });
      } else if (role === "teacher") {
        navigate("/teacher/add-course", { replace: true });
      } else {
        navigate("/unauthorized", { replace: true });
      }
    }
  }, [navigate]);

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % classroomImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [classroomImages.length]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="px-4 sm:px-8 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-10" id="home">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">{t("home.welcome")}</h1>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">
              <span className="text-blue-600">{t("home.schoolName")}</span>
            </h1>
            <p className="mb-6 text-gray-700 leading-relaxed text-base sm:text-lg">{t("home.intro")}</p>
            <Button
              style="px-4 py-2 text-sm sm:text-base rounded-full text-white font-semibold 
                bg-gradient-to-r from-orange-500 to-yellow-400 
                hover:from-orange-600 hover:to-yellow-500 
                transform hover:scale-105 
                transition-all duration-300 shadow-md hover:shadow-lg 
                cursor-pointer"
              onClick={clickHandle}
            >
              {t("home.register")}
            </Button>
          </div>

          <div className="flex justify-center">
            <img src={home_ill} alt="Illustration" className="w-full max-w-xs sm:max-w-md" />
          </div>
        </section>

        {/* About Section */}
        <div id="about" className="scroll-mt-20">
          <section className="px-4 sm:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  {t("home.about")} <span className="text-blue-600">{t("home.schoolName")}</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  {t("home.aboutText")}
                </p>
              </div>

              {/* Video Section */}
              <div className="w-full max-w-md mx-auto md:mx-0 md:ml-8">
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <video 
                    src={video} 
                    controls 
                    className="w-full h-48 sm:h-52 object-cover"
                    poster={youtube}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="mt-3 text-gray-600 text-sm text-center md:text-left">
                  {t("home.videoDescription")}
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <ClassroomFeatureCard
              images={classroomImages}
              currentIndex={currentImageIndex}
              setCurrentIndex={setCurrentImageIndex}
              title={t("home.features.classrooms.title")}
              desc={t("home.features.classrooms.desc")}
            />
            <FeatureCard
              img={reception}
              title={t("home.features.reception.title")}
              desc={t("home.features.reception.desc")}
            />
            <FeatureCard
              img={localisation}
              title={t("home.features.location.title")}
              desc={t("home.features.location.desc")}
              link={t("home.features.location.link")}
            />
          </section>
        </div>

        {/* Activities Section */}
        <section className="px-4 sm:px-6 py-12 sm:py-16 scroll-mt-20" id="activities">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">{t("home.schoolName")}</h2>
            <p className="text-orange-600 font-medium">{t("home.activitiesTitle")}</p>
            <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 via-orange-500 to-yellow-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ActivityCard img={activity1} text={t("home.activities.quran")} />
            <ActivityCard img={activity2} text={t("home.activities.awards")} />
            <ActivityCard img={activity3} text={t("home.activities.trips")} />
            <ActivityCard img={activity4} text={t("home.activities.workshops")} />
          </div>
        </section>
      </main>

      <Footer id="contact" />
    </div>
  );
}

// New component for classroom image carousel
const ClassroomFeatureCard = ({ images, currentIndex, setCurrentIndex, title, desc }) => (
  <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition">
    <div className="relative">
      <img 
        src={images[currentIndex]} 
        alt={title} 
        className="h-48 w-full object-cover transition-opacity duration-500" 
      />
      
      {/* Dots indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
    
    <div className="px-5 pb-5 text-center">
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed break-words">{desc}</p>
    </div>
  </div>
);

// Updated FeatureCard with consistent image height
const FeatureCard = ({ img, title, desc, link }) => (
  <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition">
    <img src={img} alt={title} className="h-48 w-full object-cover" />
    <div className="px-5 pb-5 text-center">
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed break-words">{desc}</p>
      {link && (
        <a
          href="https://maps.app.goo.gl/kZLJ6dLJsUu7sYzW9"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm font-medium inline-block mt-2"
        >
          {link}
        </a>
      )}
    </div>
  </div>
);

const ActivityCard = ({ img, text }) => (
  <div className="bg-white shadow-lg rounded-2xl overflow-hidden text-center">
    <img src={img} alt={text} className="w-full h-48 sm:h-56 object-cover" />
    <p className="py-3 font-medium text-gray-800">{text}</p>
  </div>
);

export default Home;