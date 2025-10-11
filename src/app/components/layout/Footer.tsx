"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleEmailClick = (subject: string = "CarStat Inquiry") => {
    const email = "hello@nihad.az";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoLink;
  };

  const openExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <footer
      className={`border-t theme-transition ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Brand */}
          <div className="md:col-span-2">
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

          {/* Socials */}
          <div>
            <h4
              className={`font-semibold mb-4 theme-transition ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Socials
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() =>
                    openExternalLink(
                      "https://www.linkedin.com/in/nihad-ibrahimli/"
                    )
                  }
                  className={`theme-transition hover:text-[#5e45cd] dark:hover:text-purple-400 cursor-pointer ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  LinkedIn
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    openExternalLink("https://github.com/nihad-az")
                  }
                  className={`theme-transition hover:text-[#5e45cd] dark:hover:text-purple-400 cursor-pointer ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  GitHub
                </button>
              </li>
              <li>
                <button
                  onClick={() => openExternalLink("https://nihad.az/")}
                  className={`theme-transition hover:text-[#5e45cd] dark:hover:text-purple-400 cursor-pointer ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  Portfolio
                </button>
              </li>
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
              <li>
                <button
                  onClick={() => handleEmailClick("CarStat Contact")}
                  className={`theme-transition hover:text-[#5e45cd] dark:hover:text-purple-400 cursor-pointer ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleEmailClick("CarStat Issue Report")}
                  className={`theme-transition hover:text-[#5e45cd] dark:hover:text-purple-400 cursor-pointer ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  Report Issue
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    openExternalLink("https://github.com/nihad-az/car-stat")
                  }
                  className={`theme-transition hover:text-[#5e45cd] dark:hover:text-purple-400 cursor-pointer ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  View Source Code
                </button>
              </li>
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
