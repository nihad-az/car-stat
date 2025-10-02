"use client";

import { useEffect, useState } from "react";

const Footer = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(document.documentElement.classList.contains("dark"));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      className={`border-t theme-transition ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand */}
          <div>
            <h3
              className={`text-2xl font-bold mb-4 theme-transition ${
                isDarkMode ? "text-purple-400" : "text-[#5e45cd]"
              }`}
            >
              CarStat
            </h3>
            <p
              className={`mb-4 max-w-sm mx-auto md:mx-0 theme-transition ${
                isDarkMode ? "text-gray-300" : "text-gray-900"
              }`}
            >
              The ultimate destination for car comparisons. Make informed
              decisions with detailed stats and performance insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className={`font-semibold mb-4 theme-transition ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Compare Cars", "Car Reviews", "Brand Directory"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className={`theme-transition hover:text-[#5e45cd] dark:hover:text-purple-400 ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              className={`font-semibold mb-4 theme-transition ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Support
            </h4>
            <ul className="space-y-2">
              {["Help Center", "Contact Us", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className={`theme-transition hover:text-[#5e45cd] dark:hover:text-purple-400 ${
                      isDarkMode ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`border-t mt-10 pt-6 text-center text-sm theme-transition ${
            isDarkMode
              ? "border-gray-700 text-gray-400"
              : "border-gray-200 text-gray-900"
          }`}
        >
          &copy; {new Date().getFullYear()} Nihad Ibrahimli. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
