import Header from "../components/header"
import Footer from "../components/footer"
import Button from "../components/button"
import home_ill from '../assets/home-illu.svg'
import classRooms from '../assets/classrooms.jpg'
import localisation from '../assets/localisation.jpg'
import reception from '../assets/reception.jpg'
import youtube from '../assets/2fe57969df892a2b4c651a126c9aaa2051b6280e.png'
import  activity1  from "../assets/quran.jpg"
import  activity2  from "../assets/takreem.jpg"
import  activity3  from "../assets/sorties.jpg"
import  activity4  from "../assets/workshops.jpg"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
function Home() {
  const navigate = useNavigate();
  function clickHandle(){
    navigate('/register')
  }
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "student") navigate("/student/home", { replace: true });
      else if (role === "admin") navigate("/admin/home", { replace: true });
      else navigate("/unauthorized", { replace: true });
    }
  }, [navigate]);
  return(
    <div className="flex flex-col relative min-h-screen">


  <Header />
  <main className="flex-grow">
  <section className="px-8 py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-10" id="home">
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Welcome to 
      </h1>
      <h1 className="text-3xl font-bold mb-4"><span className="text-blue-600">Excellence School</span></h1>
      <p className="mb-6 text-gray-700 leading-relaxed">
        Excellence School is a private educational institution dedicated to providing
        high-quality learning for all. Inspiring innovation, inclusivity, and academic
        excellence, we empower students to achieve their fullest potential and prepare
        them for a bright future.
      </p>
      <Button
  style="px-4 py-2 rounded-full text-white font-semibold 
        bg-gradient-to-r from-orange-500 to-yellow-400 
        hover:from-orange-600 hover:to-yellow-500 
        transform hover:scale-105 
        transition-all duration-300 shadow-md hover:shadow-lg 
        cursor-pointer"
  onClick={clickHandle}
>
  Register Now
</Button>
    </div>

    <div className="flex justify-center">
      <img src={home_ill} alt="Hero Illustration" className="max-w-md" />
    </div>
  </section>
<div id="about" className="scroll-mt-8">
<section className="px-8 py-16" id="about">
  <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-12">
    <div className="flex flex-col justify-start">
      <h2 className="text-3xl font-bold mb-4">
        About <span className="text-blue-600">Excellence School</span>
      </h2>
      <p className="mb-6 text-gray-700 max-w-xl text-lg leading-relaxed">
        We are a vibrant learning community where education, creativity, and
        diversity come together. Our mission is to inspire students to grow,
        dream, and achieve excellence in every step of their journey.
      </p>
    </div>

    <div className="max-w-sm mx-auto md:mx-0 md:ml-8">
  <div className="relative rounded-xl overflow-hidden shadow-lg">
    <img src={youtube} alt="School Video" className="w-full h-52 object-cover" />
  </div>
  <p className="mt-3 text-gray-600 text-sm text-center md:text-left">
    Discover school life in action through this video.
  </p>
</div>


  </div>
</section>



<section className="px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition">
    <img
      src={classRooms}
      alt="Classroom"
      className="h-36 w-full object-cover"
    />
    <div className="px-5 pb-5 text-center">
      <h3 className="font-semibold text-lg mb-1">Classrooms</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        Modern classrooms that encourage innovation.
      </p>
    </div>
  </div>

  <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition">
    <img
      src={reception}
      alt="Reception"
      className="h-36 w-full object-cover"
    />
    <div className="px-5 pb-5 text-center">
      <h3 className="font-semibold text-lg mb-1">Reception</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        A welcoming reception area ready to guide visitors.
      </p>
    </div>
  </div>

  <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition">
    <img
      src={localisation}
      alt="Map"
      className="h-36 w-full object-cover"
    />
    <div className="px-5 pb-5 text-center">
      <h3 className="font-semibold text-lg mb-1">Visit Us</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-2">
        You will find us in the state of Mostaganem, precisely in the
        municipality of Massra.
      </p>
      <a
        href="https://www.google.com/maps/place/Excellence+school/@35.8359099,0.1563124,15z/data=!4m6!3m5!1s0x1281f721e2c44369:0x628fa6ad49e82b60!8m2!3d35.8364854!4d0.1619777!16s%2Fg%2F11l1n8xt93?entry=ttu&g_ep=EgoyMDI1MDgxMy4wIKXMDSoASAFQAw%3D%3D"
        target="_blank"
        className="text-blue-600 hover:underline text-sm font-medium"
      >
        Open in Google Maps →
      </a>
    </div>
  </div>
</section>
</div>
<section className="py-16 scroll-mt-8" id="activities">
  <div className="text-center mb-10">
    <h2 className="text-3xl font-bold">Excellence School</h2>
    <p className="text-orange-600 font-medium">Discover Our Activities</p>
    <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 via-orange-500 to-yellow-400 mx-auto rounded-full"></div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6">
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden text-center">
      <img src={activity1} alt="دورات تحفيظ قرآنية" className="w-full h-56 object-cover" />
      <p className="py-3 font-medium text-gray-800">دورات تحفيظ قرآنية</p>
    </div>

    <div className="bg-white shadow-lg rounded-2xl overflow-hidden text-center">
      <img src={activity2} alt="تكريم الطلاب الناجحين" className="w-full h-56 object-cover" />
      <p className="py-3 font-medium text-gray-800">تكريم الطلاب الناجحين في شهادة البكالوريا</p>
    </div>

    <div className="bg-white shadow-lg rounded-2xl overflow-hidden text-center">
      <img src={activity3} alt="عمل رحلات جماعية" className="w-full h-56 object-cover" />
      <p className="py-3 font-medium text-gray-800">عمل رحلات جماعية لترفيه أطفالكم</p>
    </div>

    <div className="bg-white shadow-lg rounded-2xl overflow-hidden text-center">
      <img src={activity4} alt="دورات تعليم الفنون" className="w-full h-56 object-cover" />
      <p className="py-3 font-medium text-gray-800">دورات تعليم مختلف الفنون لأطفالكم</p>
    </div>
  </div>
</section>


</main>

  <Footer id="contact"/>
</div>

  )
}

export default Home