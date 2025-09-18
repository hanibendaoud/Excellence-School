import { Mail, Phone, Facebook, Instagram } from "lucide-react";
import logo from '../assets/logo.svg'
export default function Footer(props) {
  return (
    <div id={props.id}>
    <footer className="bg-gradient-to-t from-[#FF5722] to-[#FFFFFF] px-12 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Excellence School"
              className="w-15 h-15"  
            />
            <div className="leading-tight text-black">
              <h1 className="font-bold">Excellence</h1>
              <h1 className="font-bold">School</h1>
            </div>
          </div>
          <p className="text-sm max-w-xs text-black">
            Unlock Opportunities, Secure Your Future.
          </p>
        </div>

        <div className="text-black">
          <h3 className="font-semibold mb-3">Follow Us</h3>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-2">
  <Facebook className="w-5 h-5 text-white" />
  <a
    href="https://www.facebook.com/people/Excellence-School/100095447415943/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-black hover:text-blue-600 hover:underline transition-colors"
  >
    Excellence School
  </a>
</li>

<li className="flex items-center gap-2">
  <Instagram className="w-5 h-5 text-white" />
  <a
    href="https://www.instagram.com/excellence_school_27/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-black hover:text-pink-600 hover:underline transition-colors"
  >
    Excellence School
  </a>
</li>

          </ul>
        </div>

        <div className="text-black">
          <h3 className="font-semibold mb-3">Contact Us</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-white" />
              <a href="mailto:edufund2025@gmail.com" className="hover:underline">
                excellenceschool27@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-white" />
              <span>0657297566 /  0776112565</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
    </div>
  );
}
