"use client";

import { useEffect, useState } from "react";

export function CtaSection() {
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
    <section
      className={`py-20 px-4 sm:px-6 lg:px-8 theme-transition ${
        isDarkMode ? "bg-gray-800" : "bg-gray-50"
      }`}
    >
      <div className="container mx-auto max-w-4xl text-center">
        {/* CTA container with gradient background */}
        <div
          className={`rounded-2xl p-12 shadow-lg relative overflow-hidden theme-transition
                        border transition-all duration-500 ${
                          isDarkMode
                            ? "bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 shadow-gray-900/50"
                            : "bg-gradient-to-br from-blue-50 to-purple-50 border-gray-200 shadow-lg"
                        }`}
        >
          {/* subtle overlay pulse effect */}
          <div
            className={`absolute inset-0 animate-pulse rounded-2xl theme-transition ${
              isDarkMode
                ? "bg-gradient-to-tr from-transparent via-purple-900/20 to-blue-900/20"
                : "bg-gradient-to-tr from-transparent via-purple-100/50 to-blue-100/50"
            }`}
          ></div>

          {/* content */}
          <div className="relative">
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-4 theme-transition ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Ready to Find Your Perfect Car?
            </h2>
            <p
              className={`text-xl mb-8 max-w-2xl mx-auto theme-transition ${
                isDarkMode ? "text-gray-300" : "text-gray-900"
              }`}
            >
              Join thousands of smart car buyers who use CarStat to make
              informed decisions. Start comparing cars today and find the
              perfect match for your needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className={`h-12 px-8 font-semibold text-white rounded-lg transition-all duration-300 flex items-center justify-center theme-transition ${
                  isDarkMode
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-[#5e45cd] hover:bg-[#4b38a8]"
                }`}
              >
                Single Comparison
              </button>

              <button
                className={`h-12 px-8 font-semibold text-white rounded-lg transition-all duration-300 flex items-center justify-center theme-transition ${
                  isDarkMode
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-[#5e45cd] hover:bg-[#4b38a8]"
                }`}
              >
                Bulk Comparison
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
