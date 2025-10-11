"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (systemPrefersDark) {
        document.documentElement.classList.add("dark");
        setIsDarkMode(true);
      } else {
        document.documentElement.classList.remove("dark");
        setIsDarkMode(false);
      }
    }
  }, []);

  const toggleTheme = async () => {
    // Start transition
    setIsTransitioning(true);

    // Add a small delay to show the animation
    await new Promise((resolve) => setTimeout(resolve, 150));

    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }

    // End transition after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 shadow-sm border-b theme-transition ${
        isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      } ${isTransitioning ? "opacity-90" : "opacity-100"}`}
    >
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="cursor-pointer">
            <h1
              className={`text-2xl font-bold transition-colors duration-500 ${
                isDarkMode ? "text-purple-400" : "text-[#5e45cd]"
              }`}
            >
              CarStat
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex justify-center items-center gap-8">
            <li>
              <Link
                href="/"
                className={`transition-all duration-500 hover:text-[#5e45cd] ${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-700"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/single-comparison"
                className={`transition-all duration-500 hover:text-[#5e45cd] ${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-700"
                }`}
              >
                Single Comparison
              </Link>
            </li>
            <li>
              <Link
                href="/bulk-comparison"
                className={`transition-all duration-500 hover:text-[#5e45cd] ${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-700"
                }`}
              >
                Bulk Comparison
              </Link>
            </li>
          </ul>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle with simplified animation */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              } ${isTransitioning ? "scale-95" : "scale-100"}`}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              disabled={isTransitioning}
            >
              {isDarkMode ? (
                // Sun icon with simple fade animation
                <svg
                  className={`w-5 h-5 text-yellow-500 transition-all duration-300 ${
                    isTransitioning
                      ? "opacity-0 scale-75"
                      : "opacity-100 scale-100"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                // Moon icon with simple fade animation
                <svg
                  className={`w-5 h-5 text-gray-700 transition-all duration-300 ${
                    isTransitioning
                      ? "opacity-0 scale-75"
                      : "opacity-100 scale-100"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 transition-all duration-300 ${
                    isDarkMode ? "bg-gray-300" : "bg-gray-600"
                  } ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
                ></span>
                <span
                  className={`w-full h-0.5 transition-all duration-300 ${
                    isDarkMode ? "bg-gray-300" : "bg-gray-600"
                  } ${isMenuOpen ? "opacity-0" : ""}`}
                ></span>
                <span
                  className={`w-full h-0.5 transition-all duration-300 ${
                    isDarkMode ? "bg-gray-300" : "bg-gray-600"
                  } ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <ul
            className={`flex flex-col gap-4 pb-4 pt-4 border-t transition-colors duration-500 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <li>
              <Link
                href="/"
                className={`block py-2 px-4 rounded-lg transition-all duration-500 hover:text-[#5e45cd] cursor-pointer ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/single-comparison"
                className={`block py-2 px-4 rounded-lg transition-all duration-500 hover:text-[#5e45cd] cursor-pointer ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={closeMenu}
              >
                Single Comparison
              </Link>
            </li>
            <li>
              <Link
                href="/bulk-comparison"
                className={`block py-2 px-4 rounded-lg transition-all duration-500 hover:text-[#5e45cd] cursor-pointer ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={closeMenu}
              >
                Bulk Comparison
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
