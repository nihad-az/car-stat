import React from "react";
import { CarData } from "./types";

interface CarCardProps {
  carData: CarData | null;
  onEdit: () => void;
  index: number;
}

const CarCard: React.FC<CarCardProps> = ({ carData, onEdit, index }) => {
  if (!carData || !carData.brand || !carData.automobile) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-all duration-200 h-full flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Car {index + 1}
          </h3>
          <p className="text-gray-500">No car selected</p>
        </div>
        <button
          onClick={onEdit}
          className="mt-4 bg-[#5e45cd] hover:bg-[#4d36b8] text-white px-4 py-3 rounded-lg transition-all duration-200 w-full font-medium focus:outline-none focus:ring-2 focus:ring-[#5e45cd] focus:ring-offset-2"
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
    <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {carData.brand.name}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{cleanName}</p>
            {year !== "N/A" && (
              <p className="text-gray-500 text-xs mt-1">Year: {year}</p>
            )}
          </div>
          {carData.brand.logo && (
            <img
              src={carData.brand.logo}
              alt={`${carData.brand.name} logo`}
              className="w-12 h-12 object-contain"
            />
          )}
        </div>

        {carData.engine && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-2">Engine</h4>
            <p className="text-sm text-gray-600">{cleanEngine}</p>
          </div>
        )}

        {carData.automobile.photos?.[0] && (
          <div className="mb-4">
            <img
              src={carData.automobile.photos[0]}
              alt={carData.automobile.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <button
        onClick={onEdit}
        className="bg-[#5e45cd] hover:bg-[#4d36b8] text-white px-4 py-3 rounded-lg transition-all duration-200 w-full font-medium focus:outline-none focus:ring-2 focus:ring-[#5e45cd] focus:ring-offset-2"
      >
        Change Car
      </button>
    </div>
  );
};

export default CarCard;
