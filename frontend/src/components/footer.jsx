import {
  FaInstagram,
  FaFacebook,
  FaPinterest,
  FaLinkedin,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../images/logo6.png";

const Footer = () => {
  return (
    <footer className="bg-BgKhaki text-BgFont py-8 px-4 md:py-12 md:px-6">
      <div className="container mx-auto grid grid-cols-3 gap-2 lg:gap-8 text-left">
        {/* Menu Section */}
        <div>
          {/* <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">MENU</h3>*/}
          <ul className="space-y-2 md:space-y-3">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/aboutus" className="hover:underline">
                About Us
              </Link>
            </li>
            <li className="hidden md:block">
              <Link to="/Gallery" className="hover:underline">
                Gallery
              </Link>
            </li>

            <li>
              <Link to="/Menu" className="hover:underline">
                Menu of Food
              </Link>
            </li>
            <li>
              <Link to="/FAQ" className="hover:underline">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Center Section (Logo or Branding) */}
        <div className="border-t border-BgKhakiDark md:border-t-0 md:border-l md:border-r md:px-6 flex flex-col items-center">
          <img
            src={logo}
            alt="I Said Yes Logo"
            className="w-24 h-auto mb-4 md:w-32"
          />
          <p className="text-xs md:text-sm mb-4 hidden md:block">
            Your ultimate wedding planner to make your big day unforgettable.
          </p>
          <p className="text-xs">© 2025 I SAID YES. All Rights Reserved.</p>
        </div>

        {/* Contact Section */}
        <div>
          {/* <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">CONTACT</h3>*/}
          <p className="mb-2 text-sm md:text-base">
            Email:{" "}
            <a href="mailto:info@isaidyes.com" className="hover:underline">
              info@isaidyes.com
            </a>
          </p>
          <p className="mb-4 text-sm md:mb-6 md:text-base">
            Phone: +49 (555) 123-4567
          </p>
          <div className="flex justify-center md:justify-start space-x-3 text-lg md:text-2xl">
            <a href="#" className="hover:text-BgPinkDark">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-BgPinkDark">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-BgPinkDark">
              <FaPinterest />
            </a>
            <a href="#" className="hover:text-BgPinkDark">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="mt-4 md:mt-8 text-center text-xs md:text-sm border-t border-BgKhakiDark pt-4 md:pt-6">
        <a href="#impressum" className="hover:underline mx-2 md:mx-4">
          Impressum
        </a>
        <a href="#privacy" className="hover:underline mx-2 md:mx-4">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
