import React, { useState, useEffect } from "react";
import { CarData } from "./types";

interface CarCardProps {
  carData: CarData | null;
  onEdit: () => void;
  index: number;
}

const CarCard: React.FC<CarCardProps> = ({ carData, onEdit, index }) => {
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

  if (!carData || !carData.brand || !carData.automobile) {
    return (
      <div
        className={`border-2 border-dashed rounded-xl p-4 sm:p-6 transition-all duration-200 h-full flex flex-col justify-between theme-transition ${
          isDarkMode
            ? "border-gray-600 bg-gray-800 hover:bg-gray-700"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <div>
          <h3
            className={`text-base sm:text-lg font-semibold mb-2 theme-transition ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Car {index + 1}
          </h3>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No car selected
          </p>
        </div>
        <button
          onClick={onEdit}
          className={`mt-4 px-4 py-3 rounded-lg transition-all duration-200 w-full font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 theme-transition text-sm sm:text-base ${
            isDarkMode
              ? "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500"
              : "bg-[#5e45cd] hover:bg-[#4d36b8] text-white focus:ring-[#5e45cd]"
          }`}
        >
          Select Car
        </button>
      </div>
    );
  }

  // Extract year from the automobile name
  const extractYear = (name: string): string => {
    const yearMatch = name.match(/(19|20)\d{2}/);
    return yearMatch ? yearMatch[0] : "N/A";
  };

  // Clean up the model name by removing the year and "Photos, engines & full specs"
  const cleanModelName = (name: string): string => {
    return name
      .replace(/Photos, engines &amp; full specs/g, "")
      .replace(/(19|20)\d{2}[-–]\d{4}/g, "") // Remove year ranges like "1998-2000"
      .replace(/(19|20)\d{2}/g, "") // Remove single years
      .replace(/\s+/g, " ") // Clean up extra spaces
      .trim();
  };

  // Remove HP figures from engine names
  const cleanEngineName = (engineName: string): string => {
    return engineName
      .replace(/\(\d+\s*HP\)/g, "") // Remove (280 HP)
      .replace(/\(\d+\s*BHP\)/g, "") // Remove (280 BHP)
      .replace(/\(\d+\s*Hp\)/g, "") // Remove (280 Hp)
      .replace(/\(\d+\s*Bhp\)/g, "") // Remove (280 Bhp)
      .replace(/\s+/g, " ") // Clean up extra spaces
      .trim();
  };

  const year = extractYear(carData.automobile.name);
  const cleanName = cleanModelName(carData.automobile.name);
  const cleanEngine = carData.engine
    ? cleanEngineName(carData.engine.name)
    : "";

  return (
    <div
      className={`border rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between theme-transition ${
        isDarkMode
          ? "border-gray-700 bg-gray-800 shadow-gray-900/50"
          : "border-gray-200 bg-white shadow-sm"
      }`}
    >
      <div>
        <div className="flex items-start sm:items-center justify-between mb-4 gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg sm:text-xl font-bold theme-transition truncate ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {carData.brand.name}
            </h3>
            <p
              className={`text-sm mt-1 theme-transition line-clamp-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {cleanName}
            </p>
            {year !== "N/A" && (
              <p
                className={`text-xs mt-1 theme-transition ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Year: {year}
              </p>
            )}
          </div>
          {carData.brand.logo && (
            <img
              src={carData.brand.logo}
              alt={`${carData.brand.name} logo`}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain flex-shrink-0"
            />
          )}
        </div>

        {carData.engine && (
          <div
            className={`mb-4 p-3 rounded-lg border theme-transition ${
              isDarkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            <h4
              className={`font-semibold mb-2 text-sm sm:text-base theme-transition ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Engine
            </h4>
            <p
              className={`text-xs sm:text-sm theme-transition line-clamp-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {cleanEngine}
            </p>
          </div>
        )}

        {carData.automobile.photos?.[0] && (
          <div className="mb-4">
            <img
              src={carData.automobile.photos[0]}
              alt={carData.automobile.name}
              className="w-full h-32 sm:h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <button
        onClick={onEdit}
        className={`px-4 py-3 rounded-lg transition-all duration-200 w-full font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 theme-transition text-sm sm:text-base ${
          isDarkMode
            ? "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500"
            : "bg-[#5e45cd] hover:bg-[#4d36b8] text-white focus:ring-[#5e45cd]"
        }`}
      >
        Change Car
      </button>
    </div>
  );
};

export default CarCard;
