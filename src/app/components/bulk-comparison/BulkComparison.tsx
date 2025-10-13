"use client";

import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Brand, Automobile, Engine, CarData } from "../single-comparison/types";

// Custom Select Component with Enhanced UX
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  placeholder: string;
  loading?: boolean;
  id?: string;
  className?: string;
}

const CustomSelect = forwardRef<HTMLDivElement, CustomSelectProps>(
  (
    {
      value,
      onChange,
      options,
      disabled = false,
      placeholder,
      loading = false,
      id,
      className = "",
    },
    ref
  ) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

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

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 150);
      }
    }, [isOpen]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      const filteredOptions = getFilteredOptions();

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleOptionSelect(filteredOptions[highlightedIndex].value);
          } else if (filteredOptions.length === 1) {
            handleOptionSelect(filteredOptions[0].value);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;
        case "Tab":
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;
      }
    };

    const getFilteredOptions = () => {
      if (!searchTerm) return options;
      const term = searchTerm.toLowerCase();
      return options.filter((option) =>
        option.label.toLowerCase().includes(term)
      );
    };

    const handleOptionSelect = (selectedValue: string) => {
      onChange(selectedValue);
      setIsOpen(false);
      setSearchTerm("");
      setHighlightedIndex(-1);
    };

    const filteredOptions = getFilteredOptions();
    const selectedOption = options.find((opt) => opt.value === value);

    return (
      <div
        ref={dropdownRef}
        className={`relative ${className}`}
        onKeyDown={handleKeyDown}
      >
        {/* Enhanced Select Button */}
        <button
          type="button"
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={`
            w-full p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl transition-all duration-300 
            text-left flex items-center justify-between group
            focus:outline-none focus:ring-2 focus:ring-inset focus:border-transparent
            hover:scale-[1.02] active:scale-[0.98]
            theme-transition shadow-sm text-sm sm:text-base
            ${
              isDarkMode
                ? "bg-gray-800 border-gray-600 text-white focus:ring-purple-500 hover:border-purple-400"
                : "bg-white border-gray-300 text-gray-900 focus:ring-[#5e45cd] hover:border-[#5e45cd] hover:shadow-md"
            }
            ${
              disabled
                ? "opacity-40 cursor-not-allowed hover:scale-100"
                : "cursor-pointer"
            }
            ${loading ? "opacity-70 cursor-wait" : ""}
            ${
              isOpen
                ? isDarkMode
                  ? "border-purple-400"
                  : "border-[#5e45cd]"
                : ""
            }
          `}
        >
          <div className="flex items-center min-w-0 flex-1">
            {loading && (
              <div
                className={`mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full animate-spin ${
                  isDarkMode
                    ? "border-purple-400 border-t-transparent"
                    : "border-[#5e45cd] border-t-transparent"
                }`}
              />
            )}
            <span
              className={`truncate ${selectedOption ? "" : "text-gray-500"} ${
                loading ? "ml-0" : ""
              }`}
            >
              {loading
                ? "Loading options..."
                : selectedOption
                ? selectedOption.label
                : placeholder}
            </span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-3 flex-shrink-0">
            {value && !loading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                  setSearchTerm("");
                }}
                className={`p-1 rounded-full transition-colors ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                    : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                }`}
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 flex-shrink-0 ${
                isOpen ? "rotate-180 scale-110" : "group-hover:scale-110"
              } ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {/* Enhanced Dropdown Menu */}
        {isOpen && (
          <div
            className={`
            absolute top-full left-0 right-0 z-50 mt-1 sm:mt-2 max-h-60 sm:max-h-80 overflow-auto
            border-2 rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl backdrop-blur-sm
            theme-transition transform origin-top
            ${
              isDarkMode
                ? "bg-gray-800/95 border-gray-600"
                : "bg-white/95 border-gray-200"
            }
            animate-in fade-in-0 zoom-in-95 duration-200
          `}
          >
            {/* Enhanced Search Bar */}
            <div className="p-2 sm:p-3 border-b theme-transition border-gray-200 dark:border-gray-600 sticky top-0 bg-inherit">
              <div className="relative">
                <svg
                  className={`absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  className={`
                    w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border-2 rounded-lg
                    focus:outline-none focus:ring-1 focus:ring-inset transition-all
                    theme-transition
                    ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-400 placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-[#5e45cd] focus:border-[#5e45cd] placeholder-gray-500"
                    }
                  `}
                />
              </div>
            </div>

            {/* Enhanced Options List */}
            <div className="py-1 max-h-40 sm:max-h-56 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div
                  className={`px-3 sm:px-4 py-4 sm:py-6 text-center theme-transition ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <svg
                    className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm font-medium">No options found</div>
                  <div className="text-xs mt-1">Try different search terms</div>
                </div>
              ) : (
                <div className="space-y-0 sm:space-y-1 p-1">
                  {filteredOptions.map((option, index) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleOptionSelect(option.value)}
                      className={`
                        w-full px-3 sm:px-4 py-2 sm:py-3 text-left transition-all duration-200 rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-inset border border-transparent
                        theme-transition group relative overflow-hidden text-sm sm:text-base
                        ${
                          option.value === value
                            ? isDarkMode
                              ? "bg-purple-600/20 text-white border-purple-400/50 focus:ring-purple-500"
                              : "bg-[#5e45cd]/10 text-[#5e45cd] border-[#5e45cd]/30 focus:ring-[#5e45cd]"
                            : isDarkMode
                            ? "hover:bg-gray-700/80 text-white focus:ring-purple-500 hover:border-gray-500"
                            : "hover:bg-gray-50 text-gray-900 focus:ring-[#5e45cd] hover:border-gray-300"
                        }
                        ${
                          index === highlightedIndex && option.value !== value
                            ? isDarkMode
                              ? "bg-gray-700/60 border-gray-500"
                              : "bg-gray-50 border-gray-300"
                            : ""
                        }
                        transform hover:scale-[1.02] active:scale-[0.98]
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate pr-2">
                          {option.label}
                        </span>
                        {option.value === value && (
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Results Count */}
            {searchTerm && filteredOptions.length > 0 && (
              <div
                className={`px-3 sm:px-4 py-2 text-xs border-t theme-transition sticky bottom-0 bg-inherit backdrop-blur-sm ${
                  isDarkMode
                    ? "border-gray-600 text-gray-400 bg-gray-800/95"
                    : "border-gray-200 text-gray-500 bg-white/95"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>
                    {filteredOptions.length} of {options.length}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {Math.round(
                      (filteredOptions.length / options.length) * 100
                    )}
                    %
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

// Enhanced Car Details Component
interface CarDetailsProps {
  carData: CarData | null;
  isDarkMode: boolean;
}

const CarDetails: React.FC<CarDetailsProps> = ({ carData, isDarkMode }) => {
  if (!carData || !carData.brand || !carData.automobile || !carData.engine) {
    return (
      <div
        className={`text-center py-6 sm:py-8 theme-transition rounded-lg sm:rounded-xl border-2 border-dashed ${
          isDarkMode
            ? "text-gray-500 border-gray-600 bg-gray-800/50"
            : "text-gray-400 border-gray-300 bg-gray-50"
        }`}
      >
        <svg
          className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="font-medium text-sm sm:text-base">No car selected</p>
        <p className="text-xs sm:text-sm mt-1">
          Select a vehicle to view details
        </p>
      </div>
    );
  }

  // Extract year from the automobile name
  const extractYear = (name: string): string => {
    const yearMatch = name.match(/(19|20)\d{2}/);
    return yearMatch ? yearMatch[0] : "N/A";
  };

  // Clean up the model name
  const cleanModelName = (name: string): string => {
    return name
      .replace(/Photos, engines &amp; full specs/g, "")
      .replace(/(19|20)\d{2}[-–]\d{4}/g, "")
      .replace(/(19|20)\d{2}/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Extract specifications from engine data
  const getEngineSpecs = () => {
    if (!carData?.engine?.specs) return null;

    const engineSpecs = carData.engine.specs["Engine Specs"];
    if (!engineSpecs) return null;

    return {
      cylinders: engineSpecs["Cylinders:"] || "N/A",
      displacement: engineSpecs["Displacement:"] || "N/A",
      power: engineSpecs["Power:"]
        ? engineSpecs["Power:"].split("\r\n")[0]
        : "N/A",
      torque: engineSpecs["Torque:"]
        ? engineSpecs["Torque:"].split("\r\n")[0]
        : "N/A",
      fuelSystem: engineSpecs["Fuel System:"] || "N/A",
      fuel: engineSpecs["Fuel:"] || "N/A",
    };
  };

  const getPerformanceSpecs = () => {
    if (!carData?.engine?.specs) return null;

    const perfSpecs = carData.engine.specs["Performance Specs"];
    if (!perfSpecs) return null;

    return {
      topSpeed: perfSpecs["Top Speed:"] || "N/A",
      acceleration: perfSpecs["Acceleration 0-62 Mph (0-100 Kph):"] || "N/A",
    };
  };

  const getTransmissionSpecs = () => {
    if (!carData?.engine?.specs) return null;

    const transSpecs = carData.engine.specs["Transmission Specs"];
    if (!transSpecs) return null;

    return {
      driveType: transSpecs["Drive Type:"] || "N/A",
      gearbox: transSpecs["Gearbox:"] || "N/A",
    };
  };

  const getDimensions = () => {
    if (!carData?.engine?.specs) return null;

    const dimSpecs = carData.engine.specs["Dimensions"];
    if (!dimSpecs) return null;

    return {
      length: dimSpecs["Length:"] || "N/A",
      width: dimSpecs["Width:"] || "N/A",
      height: dimSpecs["Height:"] || "N/A",
      wheelbase: dimSpecs["Wheelbase:"] || "N/A",
    };
  };

  const getWeight = () => {
    if (!carData?.engine?.specs) return null;

    const weightSpecs = carData.engine.specs["Weight Specs"];
    if (!weightSpecs) return null;

    return weightSpecs["Unladen Weight:"] || "N/A";
  };

  const year = extractYear(carData.automobile.name);
  const cleanName = cleanModelName(carData.automobile.name);
  const engineSpecs = getEngineSpecs();
  const performanceSpecs = getPerformanceSpecs();
  const transmissionSpecs = getTransmissionSpecs();
  const dimensions = getDimensions();
  const weight = getWeight();

  // Calculate spec completeness score
  const totalSpecs = 10;
  const filledSpecs = [
    engineSpecs?.cylinders,
    engineSpecs?.displacement,
    engineSpecs?.power,
    performanceSpecs?.topSpeed,
    performanceSpecs?.acceleration,
    transmissionSpecs?.driveType,
    transmissionSpecs?.gearbox,
    dimensions?.length,
    dimensions?.width,
    weight,
  ].filter((spec) => spec && spec !== "N/A").length;

  const completenessScore = Math.round((filledSpecs / totalSpecs) * 100);

  return (
    <div
      className={`mt-3 sm:mt-4 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border theme-transition ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Header with completeness indicator */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h4
          className={`font-bold text-sm sm:text-base md:text-lg theme-transition flex items-center ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Vehicle Details
        </h4>
        <div className="flex items-center space-x-2">
          <div
            className={`text-xs px-2 py-1 rounded-full ${
              isDarkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {completenessScore}% complete
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Basic Information Card */}
        <div
          className={`p-3 sm:p-4 rounded-lg border theme-transition ${
            isDarkMode
              ? "bg-gray-700/50 border-gray-600"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <h5
            className={`font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wide flex items-center ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Basic Information
          </h5>
          <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
            {[
              { label: "Brand", value: carData.brand.name },
              { label: "Model", value: cleanName },
              { label: "Year", value: year !== "N/A" ? year : undefined },
              { label: "Engine", value: carData.engine.name },
            ].map(
              (item, index) =>
                item.value && (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1"
                  >
                    <span
                      className={`font-medium theme-transition ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item.label}:
                    </span>
                    <span
                      className={`font-semibold theme-transition text-right max-w-[60%] truncate ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Engine Specifications Card */}
        {engineSpecs && (
          <div
            className={`p-3 sm:p-4 rounded-lg border theme-transition ${
              isDarkMode
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <h5
              className={`font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wide flex items-center ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Engine Specifications
            </h5>
            <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
              {[
                { label: "Cylinders", value: engineSpecs.cylinders },
                { label: "Displacement", value: engineSpecs.displacement },
                { label: "Power", value: engineSpecs.power },
                { label: "Torque", value: engineSpecs.torque },
              ].map(
                (spec, index) =>
                  spec.value !== "N/A" && (
                    <div
                      key={index}
                      className="flex items-center justify-between py-1"
                    >
                      <span
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        {spec.label}:
                      </span>
                      <span
                        className={`font-medium text-right max-w-[60%] truncate ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {spec.value}
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>
        )}

        {/* Photo Count */}
        {carData.automobile.photos && carData.automobile.photos.length > 0 && (
          <div
            className={`p-2 sm:p-3 rounded-lg border theme-transition text-center ${
              isDarkMode
                ? "bg-purple-600/20 border-purple-500/30"
                : "bg-[#5e45cd]/10 border-[#5e45cd]/20"
            }`}
          >
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                <span className="font-semibold">
                  {carData.automobile.photos.length}
                </span>{" "}
                photos available
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Card Container Component
// Enhanced Card Container Component - UPDATED: Make entire card clickable when empty
interface CardContainerProps {
  carData: CarData | null;
  index: number;
  onEdit: () => void;
  isDarkMode: boolean;
}

const CardContainer: React.FC<CardContainerProps> = ({
  carData,
  index,
  onEdit,
  isDarkMode,
}) => {
  return (
    <div
      onClick={!carData ? onEdit : undefined}
      className={`relative rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 hover:border-purple-500/50 hover:shadow-purple-500/10"
          : "bg-white border-gray-200 hover:border-[#5e45cd]/50 hover:shadow-gray-200"
      } ${!carData ? "cursor-pointer" : ""}`}
    >
      {/* Card Header */}
      <div
        className={`p-4 border-b ${
          isDarkMode
            ? "border-gray-700 bg-gray-800/50"
            : "border-gray-200 bg-gray-50"
        } rounded-t-xl`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                isDarkMode
                  ? "bg-purple-600 text-white"
                  : "bg-[#5e45cd] text-white"
              }`}
            >
              {index + 1}
            </div>
            <div>
              <h3
                className={`font-bold text-sm sm:text-base ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {carData ? carData.brand?.name : `Car ${index + 1}`}
              </h3>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {carData
                  ? carData?.automobile?.name
                      .replace(/Photos, engines &amp; full specs/g, "")
                      .trim()
                  : "Not selected"}
              </p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {carData ? (
          <div className="space-y-3">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {carData?.engine?.specs?.["Engine Specs"]?.["Power:"] && (
                <div
                  className={`p-2 rounded-lg text-center ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div
                    className={`font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {
                      carData.engine.specs["Engine Specs"]["Power:"].split(
                        "\r\n"
                      )[0]
                    }
                  </div>
                  <div
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Power
                  </div>
                </div>
              )}
              {carData?.engine?.specs?.["Performance Specs"]?.[
                "Top Speed:"
              ] && (
                <div
                  className={`p-2 rounded-lg text-center ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div
                    className={`font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {carData.engine.specs["Performance Specs"]["Top Speed:"]}
                  </div>
                  <div
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Top Speed
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`text-center py-6 rounded-lg border-2 border-dashed ${
              isDarkMode
                ? "border-gray-600 bg-gray-700/30"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <svg
              className="w-8 h-8 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p
              className={`text-sm font-medium ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Add Vehicle
            </p>
            <p
              className={`text-xs mt-1 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Click edit to select
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const BulkComparison: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cars, setCars] = useState<
    [CarData | null, CarData | null, CarData | null, CarData | null]
  >([null, null, null, null]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [automobiles, setAutomobiles] = useState<Automobile[]>([]);
  const [engines, setEngines] = useState<Engine[]>([]);

  const [selectedCarIndex, setSelectedCarIndex] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedAutomobile, setSelectedAutomobile] = useState<string>("");
  const [selectedEngine, setSelectedEngine] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchProgress, setSearchProgress] = useState<number>(0);

  const selectionPanelRef = useRef<HTMLDivElement>(null);

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

  // Load brands on component mount
  useEffect(() => {
    loadBrands();
  }, []);

  // Scroll to selection panel when it opens
  useEffect(() => {
    if (selectedCarIndex !== null && selectionPanelRef.current) {
      setTimeout(() => {
        selectionPanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }
  }, [selectedCarIndex]);

  // Simulate search progress
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setSearchProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + 10;
        });
      }, 200);
      return () => {
        clearInterval(interval);
        setSearchProgress(0);
      };
    }
  }, [loading]);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch("/data/brands.json");
      const data = await response.json();
      setBrands(data);
      setSearchProgress(100);
    } catch (error) {
      console.error("Error loading brands:", error);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const loadAutomobiles = async (brandId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/data/automobiles_brand_${brandId}.json`);
      const data = await response.json();
      setAutomobiles(data);
      setSearchProgress(100);
    } catch (error) {
      console.error("Error loading automobiles:", error);
      setAutomobiles([]);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const loadEngines = async (automobileId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/data/engines_automobile_${automobileId}.json`
      );
      const data = await response.json();
      setEngines(data);
      setSearchProgress(100);
    } catch (error) {
      console.error("Error loading engines:", error);
      setEngines([]);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const handleCardEdit = (index: number) => {
    setSelectedCarIndex(index);
    setSelectedBrand("");
    setSelectedAutomobile("");
    setSelectedEngine("");
    setAutomobiles([]);
    setEngines([]);
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
    setSelectedAutomobile("");
    setSelectedEngine("");
    setAutomobiles([]);
    setEngines([]);

    if (brandId) {
      loadAutomobiles(brandId);
    }
  };

  const handleAutomobileChange = (autoId: string) => {
    setSelectedAutomobile(autoId);
    setSelectedEngine("");
    setEngines([]);

    if (autoId) {
      loadEngines(autoId);
    }
  };

  const handleEngineChange = (engineId: string) => {
    setSelectedEngine(engineId);
  };

  const handleConfirmSelection = () => {
    if (
      selectedCarIndex !== null &&
      selectedBrand &&
      selectedAutomobile &&
      selectedEngine
    ) {
      const selectedBrandData = brands.find(
        (brand) => brand.id === parseInt(selectedBrand)
      );
      const selectedAutomobileData = automobiles.find(
        (auto) => auto.id === parseInt(selectedAutomobile)
      );
      const selectedEngineData = engines.find(
        (engine) => engine.id === parseInt(selectedEngine)
      );

      if (selectedBrandData && selectedAutomobileData && selectedEngineData) {
        const newCars = [...cars] as [
          CarData | null,
          CarData | null,
          CarData | null,
          CarData | null
        ];
        newCars[selectedCarIndex] = {
          brand: selectedBrandData,
          automobile: selectedAutomobileData,
          engine: selectedEngineData,
        };
        setCars(newCars);

        setSelectedBrand("");
        setSelectedAutomobile("");
        setSelectedEngine("");
        setSelectedCarIndex(null);
      }
    }
  };

  const handleCancelSelection = () => {
    setSelectedBrand("");
    setSelectedAutomobile("");
    setSelectedEngine("");
    setSelectedCarIndex(null);
  };

  const filledSlots = cars.filter((car) => car !== null).length;

  return (
    <div
      className={`min-h-screen py-4 sm:py-8 theme-transition overflow-y-visible ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-gray-50 to-white"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        {/* Enhanced Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-500 to-[#5e45cd] text-white mb-3 sm:mb-4 shadow-lg">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h1
            className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 theme-transition bg-gradient-to-r ${
              isDarkMode
                ? "from-white to-gray-300"
                : "from-gray-900 to-gray-700"
            } bg-clip-text text-transparent`}
          >
            Car Comparison Studio
          </h1>
          <p
            className={`text-base sm:text-xl theme-transition max-w-2xl mx-auto leading-relaxed px-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Compare up to 4 vehicles side by side
          </p>

          {/* Progress Indicator */}
          <div
            className={`mt-4 sm:mt-6 max-w-md mx-auto p-3 sm:p-4 rounded-xl ${
              isDarkMode ? "bg-gray-800/50" : "bg-white/80"
            } backdrop-blur-sm border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs sm:text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Comparison Progress
              </span>
              <span
                className={`text-xs sm:text-sm font-bold ${
                  isDarkMode ? "text-purple-400" : "text-[#5e45cd]"
                }`}
              >
                {filledSlots}/4
              </span>
            </div>
            <div
              className={`w-full h-2 rounded-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-[#5e45cd] transition-all duration-500"
                style={{ width: `${(filledSlots / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Cards Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {cars.map((car, index) => (
            <div key={index} className="group">
              <div
                className={`h-full transition-all duration-300 ${
                  isDarkMode
                    ? "hover:shadow-lg hover:shadow-purple-500/10"
                    : "hover:shadow-md"
                }`}
              >
                <CardContainer
                  carData={car}
                  index={index}
                  onEdit={() => handleCardEdit(index)}
                  isDarkMode={isDarkMode}
                />
                <CarDetails carData={car} isDarkMode={isDarkMode} />
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Selection Panel */}
        {selectedCarIndex !== null && (
          <div
            ref={selectionPanelRef}
            className={`mt-6 sm:mt-8 max-w-4xl mx-auto rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border p-4 sm:p-6 md:p-8 transition-all duration-300 theme-transition overflow-y-visible backdrop-blur-sm ${
              isDarkMode
                ? "bg-gray-800/90 border-gray-700"
                : "bg-white/90 border-gray-200"
            }`}
          >
            {/* Selection Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-500 to-[#5e45cd] text-white mb-2 sm:mb-3">
                <span className="font-bold text-sm sm:text-base">
                  {selectedCarIndex + 1}
                </span>
              </div>
              <h2
                className={`text-xl sm:text-2xl font-bold theme-transition ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Select Car {selectedCarIndex + 1}
              </h2>
              <p
                className={`mt-1 sm:mt-2 text-sm sm:text-base theme-transition ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Choose brand, model, and engine
              </p>
            </div>

            {/* Progress Steps - Simplified for mobile */}
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              {["Brand", "Model", "Engine"].map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted =
                  (stepNumber === 1 && selectedBrand) ||
                  (stepNumber === 2 && selectedAutomobile) ||
                  (stepNumber === 3 && selectedEngine);
                const isCurrent =
                  (stepNumber === 1 && !selectedBrand) ||
                  (stepNumber === 2 && selectedBrand && !selectedAutomobile) ||
                  (stepNumber === 3 && selectedAutomobile && !selectedEngine);

                return (
                  <React.Fragment key={step}>
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 font-semibold text-xs sm:text-sm transition-all duration-300 ${
                          isCompleted
                            ? "bg-gradient-to-r from-purple-500 to-[#5e45cd] text-white border-transparent"
                            : isCurrent
                            ? isDarkMode
                              ? "bg-purple-500/20 text-purple-400 border-purple-400"
                              : "bg-[#5e45cd]/10 text-[#5e45cd] border-[#5e45cd]"
                            : isDarkMode
                            ? "bg-gray-700 text-gray-400 border-gray-600"
                            : "bg-gray-100 text-gray-400 border-gray-300"
                        }`}
                      >
                        {isCompleted ? (
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          stepNumber
                        )}
                      </div>
                      <span
                        className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden sm:block ${
                          isCompleted || isCurrent
                            ? isDarkMode
                              ? "text-white"
                              : "text-gray-900"
                            : isDarkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {index < 2 && (
                      <div
                        className={`w-4 sm:w-8 h-0.5 mx-1 sm:mx-2 transition-colors ${
                          isCompleted
                            ? "bg-gradient-to-r from-purple-500 to-[#5e45cd]"
                            : isDarkMode
                            ? "bg-gray-600"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Loading Bar */}
            {loading && (
              <div className="mb-4 sm:mb-6">
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Loading options...
                  </span>
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    {searchProgress}%
                  </span>
                </div>
                <div
                  className={`w-full h-1.5 sm:h-2 rounded-full ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-[#5e45cd] transition-all duration-300"
                    style={{ width: `${searchProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-4 sm:space-y-6">
              {/* Brand Selection */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 sm:mb-3 theme-transition flex items-center ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  Step 1: Select Brand
                </label>
                <CustomSelect
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  options={brands.map((brand) => ({
                    value: brand.id.toString(),
                    label: brand.name,
                  }))}
                  disabled={loading}
                  placeholder="Search for a brand..."
                  loading={loading}
                />
                <div
                  className={`text-xs sm:text-sm mt-1 sm:mt-2 theme-transition flex justify-between ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <span>{brands.length} brands available</span>
                  {selectedBrand && (
                    <span className="font-semibold text-green-500">
                      ✓ Selected
                    </span>
                  )}
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 sm:mb-3 theme-transition flex items-center ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Step 2: Select Model
                </label>
                <CustomSelect
                  value={selectedAutomobile}
                  onChange={handleAutomobileChange}
                  options={automobiles.map((auto) => ({
                    value: auto.id.toString(),
                    label: auto.name
                      .replace(/Photos, engines &amp; full specs/g, "")
                      .trim(),
                  }))}
                  disabled={!selectedBrand || loading}
                  placeholder={
                    !selectedBrand
                      ? "Select a brand first"
                      : "Search for a model..."
                  }
                  loading={loading}
                />
                <div
                  className={`text-xs sm:text-sm mt-1 sm:mt-2 theme-transition flex justify-between ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <span>
                    {!selectedBrand
                      ? "Select a brand first"
                      : `${automobiles.length} models available`}
                  </span>
                  {selectedAutomobile && (
                    <span className="font-semibold text-green-500">
                      ✓ Selected
                    </span>
                  )}
                </div>
              </div>

              {/* Engine Selection */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 sm:mb-3 theme-transition flex items-center ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Step 3: Select Engine
                </label>
                <CustomSelect
                  value={selectedEngine}
                  onChange={handleEngineChange}
                  options={engines.map((engine) => ({
                    value: engine.id.toString(),
                    label: engine.name,
                  }))}
                  disabled={!selectedAutomobile || loading}
                  placeholder={
                    !selectedAutomobile
                      ? "Select a model first"
                      : "Search for an engine..."
                  }
                  loading={loading}
                />
                <div
                  className={`text-xs sm:text-sm mt-1 sm:mt-2 theme-transition flex justify-between ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <span>
                    {!selectedAutomobile
                      ? "Select a model first"
                      : `${engines.length} engines available`}
                  </span>
                  {selectedEngine && (
                    <span className="font-semibold text-green-500">
                      ✓ Selected
                    </span>
                  )}
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t theme-transition border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCancelSelection}
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 font-semibold transition-all duration-300 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 theme-transition hover:scale-105 active:scale-95 order-2 sm:order-1 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white border-gray-600 hover:bg-gray-700 focus:ring-purple-500 focus:ring-offset-gray-900"
                      : "text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50 focus:ring-[#5e45cd] focus:ring-offset-white"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSelection}
                  disabled={
                    !selectedBrand ||
                    !selectedAutomobile ||
                    !selectedEngine ||
                    loading
                  }
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 theme-transition disabled:transform-none disabled:transition-none order-1 sm:order-2 ${
                    !selectedBrand ||
                    !selectedAutomobile ||
                    !selectedEngine ||
                    loading
                      ? isDarkMode
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : `bg-gradient-to-r from-purple-500 to-[#5e45cd] text-white hover:scale-105 active:scale-95 focus:ring-purple-500 shadow-lg hover:shadow-xl ${
                          isDarkMode
                            ? "focus:ring-offset-gray-900"
                            : "focus:ring-offset-white"
                        }`
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm sm:text-base">
                        Adding Vehicle...
                      </span>
                    </div>
                  ) : (
                    `Add Car ${selectedCarIndex + 1}`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkComparison;
