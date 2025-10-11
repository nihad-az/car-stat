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
              className={`flex-1 min-w-[250px] max-w-sm rounded-xl p-6 text-center
                         transform transition-all duration-1000 ease-out
                         border relative overflow-hidden
                         hover:scale-[1.02] hover:shadow-2xl
                         ${
                           isDarkMode
                             ? "bg-gray-800 shadow-lg border-gray-700 hover:shadow-purple-500/10 hover:border-purple-400/20"
                             : "bg-white shadow-lg border-gray-200 hover:shadow-[#5e45cd]/10 hover:border-[#5e45cd]/20"
                         }`}
            >
              {/* Subtle glow effect */}
              <div
                className={`absolute inset-0 rounded-xl opacity-0 transition-all duration-1000 ease-out
                            bg-gradient-to-br from-transparent via-transparent
                            ${
                              isDarkMode
                                ? "to-purple-500/5 group-hover:opacity-100"
                                : "to-[#5e45cd]/5 group-hover:opacity-100"
                            }`}
              ></div>

              {/* Very subtle border glow */}
              <div
                className={`absolute inset-0 rounded-xl opacity-0 transition-all duration-1000 ease-out
                            border-2 border-transparent
                            ${
                              isDarkMode
                                ? "group-hover:opacity-100 group-hover:border-purple-400/10"
                                : "group-hover:opacity-100 group-hover:border-[#5e45cd]/10"
                            }`}
              ></div>

              <div className="relative z-10 group">
                <div
                  className={`mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-700 ease-out
                              ${
                                isDarkMode
                                  ? "bg-purple-600/20 group-hover:bg-purple-600/30"
                                  : "bg-[#5e45cd]/10 group-hover:bg-[#5e45cd]/20"
                              }`}
                >
                  <span className="text-2xl transition-transform duration-700 ease-out group-hover:scale-110">
                    {feature.icon}
                  </span>
                </div>
                <h3
                  className={`text-lg font-semibold mb-2 transition-colors duration-700 ease-out ${
                    isDarkMode
                      ? "text-white group-hover:text-purple-300"
                      : "text-gray-900 group-hover:text-[#5e45cd]"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-sm transition-colors duration-700 ease-out ${
                    isDarkMode
                      ? "text-gray-300 group-hover:text-gray-200"
                      : "text-gray-900 group-hover:text-gray-700"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
