import React from "react";
import Logo from "../Logo.jsx";
import { NavLink } from "react-router-dom";
import { Link } from "react-scroll";

const Footer = () => {
  return (
    <footer className="bg-white shadow dark:bg-gray-900 mt-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <NavLink
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <Logo className="w-20 lg:w-24" logoChoice={2} />{" "}
            {/* Fixed width for Logo */}
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              SalesSphere
            </span>
          </NavLink>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <Link
                to="About"
                smooth={true}
                duration={500}
                offset={-50}
                className="hover:underline me-4 md:me-6 cursor-pointer"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="Benefits"
                smooth={true}
                duration={500}
                offset={-100}
                className="hover:underline me-4 md:me-6 cursor-pointer"
              >
                Benefits
              </Link>
            </li>
            <li>
              <Link
                to="Mobile"
                smooth={true}
                duration={500}
                offset={100}
                className="hover:underline me-4 md:me-6 cursor-pointer"
              >
                Mobile App
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <NavLink
            to="/"
            className="hover:underline dark:text-blue-400"
            onClick={() => window.scrollTo(0, 0)}
          >
            SalesSphere™
          </NavLink>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
