"use client";

import { useEffect, useState } from "react";

export function HeroSection() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled on component mount
    setIsDarkMode(document.documentElement.classList.contains("dark"));

    // Listen for theme changes
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

  const scrollToCTA = () => {
    const ctaSection = document.getElementById("cta-section");
    if (ctaSection) {
      ctaSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features-section");
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section
      className={`relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden theme-transition ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 to-purple-50"
      }`}
    >
      {/* background gradients */}
      <div
        className={`absolute inset-0 theme-transition ${
          isDarkMode
            ? "bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-blue-800/20"
            : "bg-gradient-to-br from-blue-100/50 via-purple-100/30 to-blue-200/50"
        }`}
      ></div>
      <div
        className={`absolute inset-0 theme-transition ${
          isDarkMode
            ? "bg-gradient-to-tr from-transparent via-purple-600/10 to-blue-700/10 animate-pulse"
            : "bg-gradient-to-tr from-transparent via-purple-100/20 to-blue-100/30 animate-pulse"
        }`}
      ></div>

      {/* content */}
      <div className="relative container mx-auto max-w-4xl text-center">
        <h1
          className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 theme-transition ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Compare Cars Like a{" "}
          <span
            className={`theme-transition ${
              isDarkMode ? "text-purple-400" : "text-[#5e45cd]"
            }`}
          >
            Pro
          </span>
        </h1>
        <p
          className={`text-xl mb-12 max-w-2xl mx-auto theme-transition ${
            isDarkMode ? "text-gray-300" : "text-gray-900"
          }`}
        >
          Get detailed statistics, performance metrics, and side-by-side
          comparisons to make the perfect car buying decision.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={scrollToCTA}
            className={`h-12 px-8 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center cursor-pointer theme-transition ${
              isDarkMode
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-[#5e45cd] hover:bg-[#4b38a8] text-white"
            }`}
          >
            Start Comparing Now
          </button>
          <button
            onClick={scrollToFeatures}
            className={`h-12 px-8 font-semibold border rounded-lg transition-all duration-300 flex items-center justify-center cursor-pointer theme-transition ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                : "bg-white hover:bg-gray-100 text-gray-900 border-gray-300"
            }`}
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
