"use client";

import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Brand, Automobile, Engine, CarData } from "../single-comparison/types";
import CarCard from "../single-comparison/CarCard";

// Custom Select Component with Search
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
        searchInputRef.current.focus();
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
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;
      }
    };

    const getFilteredOptions = () => {
      if (!searchTerm) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
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
        {/* Select Button */}
        <button
          type="button"
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={`
            w-full p-3 border rounded-lg transition-colors duration-200 
            text-left flex items-center justify-between
            focus:outline-none focus:ring-2 focus:border-transparent
            theme-transition
            ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white focus:ring-purple-500"
                : "bg-white border-gray-300 text-gray-900 focus:ring-[#5e45cd] focus:border-[#5e45cd]"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${loading ? "opacity-70 cursor-wait" : ""}
          `}
        >
          <span className={selectedOption ? "" : "text-gray-500"}>
            {loading
              ? "Loading..."
              : selectedOption
              ? selectedOption.label
              : placeholder}
          </span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
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
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={`
            absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto
            border rounded-lg shadow-lg
            theme-transition
            ${
              isDarkMode
                ? "bg-gray-800 border-gray-600 shadow-gray-900/50"
                : "bg-white border-gray-200 shadow-lg"
            }
          `}
          >
            {/* Search Bar */}
            <div className="p-2 border-b theme-transition border-gray-200 dark:border-gray-600">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(-1);
                }}
                className={`
                  w-full p-2 text-sm border rounded
                  focus:outline-none focus:ring-1
                  theme-transition
                  ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-purple-500 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-[#5e45cd] placeholder-gray-500"
                  }
                `}
              />
            </div>

            {/* Options List */}
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div
                  className={`px-3 py-2 text-sm text-center theme-transition ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionSelect(option.value)}
                    className={`
                      w-full px-3 py-2 text-left text-sm transition-colors duration-150
                      focus:outline-none
                      theme-transition
                      ${
                        option.value === value
                          ? isDarkMode
                            ? "bg-purple-600 text-white"
                            : "bg-[#5e45cd] text-white"
                          : isDarkMode
                          ? "hover:bg-gray-700 text-white"
                          : "hover:bg-gray-100 text-gray-900"
                      }
                      ${
                        index === highlightedIndex && option.value !== value
                          ? isDarkMode
                            ? "bg-gray-700"
                            : "bg-gray-100"
                          : ""
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>

            {/* Results Count */}
            {searchTerm && (
              <div
                className={`px-3 py-1 text-xs border-t theme-transition ${
                  isDarkMode
                    ? "border-gray-600 text-gray-400"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                {filteredOptions.length} of {options.length} results
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

// Enhanced Car Details Component with proper data structure
interface CarDetailsProps {
  carData: CarData | null;
  isDarkMode: boolean;
}

const CarDetails: React.FC<CarDetailsProps> = ({ carData, isDarkMode }) => {
  if (!carData || !carData.brand || !carData.automobile || !carData.engine) {
    return (
      <div
        className={`text-center py-4 theme-transition ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        No car selected
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
        : "N/A", // Take first line
      torque: engineSpecs["Torque:"]
        ? engineSpecs["Torque:"].split("\r\n")[0]
        : "N/A", // Take first line
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

  return (
    <div
      className={`mt-4 p-4 rounded-lg border theme-transition ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <h4
        className={`font-semibold mb-3 theme-transition ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Vehicle Details
      </h4>

      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span
              className={`font-medium theme-transition ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Brand:
            </span>
            <span
              className={`ml-2 theme-transition ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {carData.brand.name}
            </span>
          </div>

          <div>
            <span
              className={`font-medium theme-transition ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Model:
            </span>
            <span
              className={`ml-2 theme-transition ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {cleanName}
            </span>
          </div>

          {year !== "N/A" && (
            <div>
              <span
                className={`font-medium theme-transition ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Year:
              </span>
              <span
                className={`ml-2 theme-transition ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {year}
              </span>
            </div>
          )}

          <div>
            <span
              className={`font-medium theme-transition ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Engine:
            </span>
            <span
              className={`ml-2 theme-transition ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {carData.engine.name}
            </span>
          </div>
        </div>

        {/* Engine Specifications */}
        {engineSpecs && (
          <div>
            <h5
              className={`font-medium mb-2 text-sm theme-transition ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Engine Specifications
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span
                  className={`theme-transition ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Cylinders:
                </span>
                <span
                  className={`ml-2 theme-transition ${
                    isDarkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {engineSpecs.cylinders}
                </span>
              </div>
              <div>
                <span
                  className={`theme-transition ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Displacement:
                </span>
                <span
                  className={`ml-2 theme-transition ${
                    isDarkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {engineSpecs.displacement}
                </span>
              </div>
              <div>
                <span
                  className={`theme-transition ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Power:
                </span>
                <span
                  className={`ml-2 theme-transition ${
                    isDarkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {engineSpecs.power}
                </span>
              </div>
              <div>
                <span
                  className={`theme-transition ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Torque:
                </span>
                <span
                  className={`ml-2 theme-transition ${
                    isDarkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {engineSpecs.torque}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Performance */}
        {performanceSpecs && (
          <div>
            <h5
              className={`font-medium mb-2 text-sm theme-transition ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Performance
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {performanceSpecs.topSpeed !== "N/A" && (
                <div>
                  <span
                    className={`theme-transition ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Top Speed:
                  </span>
                  <span
                    className={`ml-2 theme-transition ${
                      isDarkMode ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {performanceSpecs.topSpeed}
                  </span>
                </div>
              )}
              {performanceSpecs.acceleration !== "N/A" && (
                <div>
                  <span
                    className={`theme-transition ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    0-62 mph:
                  </span>
                  <span
                    className={`ml-2 theme-transition ${
                      isDarkMode ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {performanceSpecs.acceleration}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transmission */}
        {transmissionSpecs && (
          <div>
            <h5
              className={`font-medium mb-2 text-sm theme-transition ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Transmission
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span
                  className={`theme-transition ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Drive Type:
                </span>
                <span
                  className={`ml-2 theme-transition ${
                    isDarkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {transmissionSpecs.driveType}
                </span>
              </div>
              <div>
                <span
                  className={`theme-transition ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Gearbox:
                </span>
                <span
                  className={`ml-2 theme-transition ${
                    isDarkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {transmissionSpecs.gearbox}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dimensions & Weight */}
        {(dimensions || weight) && (
          <div>
            <h5
              className={`font-medium mb-2 text-sm theme-transition ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Dimensions & Weight
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {dimensions?.length !== "N/A" && (
                <div>
                  <span
                    className={`theme-transition ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Length:
                  </span>
                  <span
                    className={`ml-2 theme-transition ${
                      isDarkMode ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {dimensions?.length}
                  </span>
                </div>
              )}
              {dimensions?.width !== "N/A" && (
                <div>
                  <span
                    className={`theme-transition ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Width:
                  </span>
                  <span
                    className={`ml-2 theme-transition ${
                      isDarkMode ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {dimensions?.width}
                  </span>
                </div>
              )}
              {weight && weight !== "N/A" && (
                <div>
                  <span
                    className={`theme-transition ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Weight:
                  </span>
                  <span
                    className={`ml-2 theme-transition ${
                      isDarkMode ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {weight}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Photo Count */}
        {carData.automobile.photos && carData.automobile.photos.length > 0 && (
          <div className="text-sm">
            <span
              className={`theme-transition ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Available Photos:{" "}
            </span>
            <span
              className={`font-medium theme-transition ${
                isDarkMode ? "text-gray-300" : "text-gray-800"
              }`}
            >
              {carData.automobile.photos.length}
            </span>
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

  const loadBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch("/data/brands.json");
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error("Error loading brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAutomobiles = async (brandId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/data/automobiles_brand_${brandId}.json`);
      const data = await response.json();
      setAutomobiles(data);
    } catch (error) {
      console.error("Error loading automobiles:", error);
      setAutomobiles([]);
    } finally {
      setLoading(false);
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
    } catch (error) {
      console.error("Error loading engines:", error);
      setEngines([]);
    } finally {
      setLoading(false);
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

  return (
    <div
      className={`container mx-auto px-4 py-8 theme-transition ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="text-center mb-8">
        <h1
          className={`text-4xl font-bold mb-3 theme-transition ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Bulk Car Comparison
        </h1>
        <p
          className={`text-lg theme-transition ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Compare up to 4 cars side by side
        </p>
      </div>

      {/* Cards Section with Horizontal Scroll on Mobile */}
      <div className="flex space-x-6 overflow-x-auto pb-6 px-2 -mx-2">
        {cars.map((car, index) => (
          <div key={index} className="flex-none w-full sm:w-80">
            <CarCard
              carData={car}
              index={index}
              onEdit={() => handleCardEdit(index)}
            />

            {/* Car Details Display */}
            <CarDetails carData={car} isDarkMode={isDarkMode} />
          </div>
        ))}
      </div>

      {/* Selection Panel - Shows as a regular div when editing a car */}
      {selectedCarIndex !== null && (
        <div
          ref={selectionPanelRef}
          className={`mt-8 max-w-4xl mx-auto rounded-lg shadow-lg border p-6 transition-all duration-300 theme-transition ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 shadow-gray-900/50"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="text-center mb-6">
            <h2
              className={`text-2xl font-bold theme-transition ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Selecting Car {selectedCarIndex + 1}
            </h2>
            <p
              className={`mt-2 theme-transition ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Choose the brand, model, and engine
            </p>
          </div>

          <div className="space-y-6">
            {/* Brand Selection */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 theme-transition ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Brand
              </label>
              <CustomSelect
                value={selectedBrand}
                onChange={handleBrandChange}
                options={brands.map((brand) => ({
                  value: brand.id.toString(),
                  label: brand.name,
                }))}
                disabled={loading}
                placeholder="Select a brand"
                loading={loading}
              />
              <div
                className={`text-xs mt-1 theme-transition ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {brands.length} brands available
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 theme-transition ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Model
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
                  !selectedBrand ? "Select a brand first" : "Select a model"
                }
                loading={loading}
              />
              <div
                className={`text-xs mt-1 theme-transition ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {!selectedBrand
                  ? "Select a brand first"
                  : `${automobiles.length} models available`}
              </div>
            </div>

            {/* Engine Selection */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 theme-transition ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Engine
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
                    : "Select an engine"
                }
                loading={loading}
              />
              <div
                className={`text-xs mt-1 theme-transition ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {!selectedAutomobile
                  ? "Select a model first"
                  : `${engines.length} engines available`}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={handleCancelSelection}
                className={`px-6 py-2 font-medium transition-colors duration-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 theme-transition ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white border-gray-600 hover:bg-gray-700 focus:ring-purple-500"
                    : "text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50 focus:ring-[#5e45cd]"
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
                className={`px-6 py-2 rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 theme-transition ${
                  isDarkMode
                    ? "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 disabled:bg-gray-600"
                    : "bg-[#5e45cd] text-white hover:bg-[#4d36b8] focus:ring-[#5e45cd] disabled:bg-gray-400"
                }`}
              >
                {loading ? "Loading..." : "Confirm Selection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkComparison;
