"use client";

import { useEffect, useState } from "react";

export function FeaturesSection() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const features = [
    {
      icon: "📊",
      title: "Advanced Analytics",
      description:
        "Deep dive into performance metrics, fuel efficiency, and technical specifications with interactive charts and graphs.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Get instant comparisons with our optimized database of thousands of car models and their detailed specifications.",
    },
    {
      icon: "🛡️",
      title: "Reliable Data",
      description:
        "All data is sourced from official manufacturers and verified by automotive experts to ensure accuracy.",
    },
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
      <div className="container mx-auto max-w-6xl">
        {/* heading */}
        <div className="text-center mb-16">
          <h2
            className={`text-3xl sm:text-4xl font-bold mb-4 theme-transition ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Why Choose{" "}
            <span
              className={`theme-transition ${
                isDarkMode ? "text-purple-400" : "text-[#5e45cd]"
              }`}
            >
              CarStat
            </span>
            ?
          </h2>
          <p
            className={`text-xl max-w-2xl mx-auto theme-transition ${
              isDarkMode ? "text-gray-300" : "text-gray-900"
            }`}
          >
            We provide the most comprehensive car comparison platform with
            cutting-edge features.
          </p>
        </div>

        {/* features flexbox */}
        <div className="flex flex-wrap gap-6 justify-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex-1 min-w-[250px] max-w-sm rounded-xl p-6 text-center theme-transition
                         hover:shadow-xl hover:scale-105
                         border transition-all duration-500 ${
                           isDarkMode
                             ? "bg-gray-800 shadow-gray-900/50 hover:shadow-gray-900/70 border-gray-700"
                             : "bg-white shadow-lg hover:shadow-xl border-gray-200"
                         }`}
            >
              <div
                className={`mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-4 theme-transition ${
                  isDarkMode ? "bg-purple-600/20" : "bg-[#5e45cd]/10"
                }`}
              >
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3
                className={`text-lg font-semibold mb-2 theme-transition ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`text-sm theme-transition ${
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
