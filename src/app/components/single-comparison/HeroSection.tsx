import React, { useState, useEffect } from "react";

export default function CarComparison() {
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
    <div
      className={`theme-transition ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      {/* Hero Section with Gradient */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className={`absolute inset-0 theme-transition ${
            isDarkMode
              ? "bg-gradient-to-br from-blue-400/20 via-purple-400/10 to-blue-500/30"
              : "bg-gradient-to-br from-blue-200/20 via-purple-200/10 to-blue-300/30"
          }`}
        ></div>
        <div
          className={`absolute inset-0 animate-pulse theme-transition ${
            isDarkMode
              ? "bg-gradient-to-tr from-transparent via-purple-400/10 to-blue-400/20"
              : "bg-gradient-to-tr from-transparent via-purple-200/10 to-blue-200/20"
          }`}
        ></div>
        <div className="relative container mx-auto max-w-6xl text-center">
          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-balance mb-4 sm:mb-6 theme-transition ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Single{" "}
            <span
              className={`theme-transition ${
                isDarkMode ? "text-purple-400" : "text-[#5e45cd]"
              }`}
            >
              Comparison
            </span>
          </h1>
          <p
            className={`text-lg sm:text-xl text-pretty max-w-2xl mx-auto mb-6 sm:mb-8 theme-transition ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Compare two cars side by side with detailed specifications and
            performance metrics
          </p>
        </div>
      </section>
    </div>
  );
}
