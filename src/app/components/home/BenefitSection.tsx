"use client";

import { useEffect, useState } from "react";

export function BenefitsSection() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const benefits = [
    "Compare two cars head-to-head with detailed stats and visuals",
    "See which car wins automatically through our built-in calculator",
    "Explore in-depth comparisons of performance, design, and efficiency",
    "Compare up to four cars at once with our bulk comparison tool",
    "Quickly identify strengths and weaknesses across multiple models",
    "Share or revisit your latest comparisons anytime on CarStat",
  ];

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
    <section
      className={`py-20 px-4 sm:px-6 lg:px-8 theme-transition ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="container mx-auto max-w-4xl">
        {/* heading */}
        <div className="text-center mb-16">
          <h2
            className={`text-3xl sm:text-4xl font-bold mb-4 theme-transition ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Everything You Need to Make the{" "}
            <span
              className={`theme-transition ${
                isDarkMode ? "text-purple-400" : "text-[#5e45cd]"
              }`}
            >
              Right Choice
            </span>
          </h2>
          <p
            className={`text-xl theme-transition ${
              isDarkMode ? "text-gray-300" : "text-gray-900"
            }`}
          >
            Our platform gives you all the tools and data you need for confident
            car buying decisions.
          </p>
        </div>

        {/* benefits list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <span
                className={`text-xl mt-0.5 theme-transition ${
                  isDarkMode ? "text-purple-400" : "text-[#5e45cd]"
                }`}
              >
                ✔
              </span>
              <p
                className={`theme-transition ${
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
