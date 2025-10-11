"use client";

import React, { useState, useEffect, useRef, forwardRef } from "react";
import CarCard from "./CarCard";
import ComparisonPanel from "./ComparisonPanel";
import { Brand, Automobile, Engine, CarData } from "./types";
import { CarComparator, ComparisonResult } from "../utils/comparison";

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
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
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
            w-full p-3 text-sm sm:text-base border rounded-lg transition-colors duration-200 
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
          <span className={`truncate ${selectedOption ? "" : "text-gray-500"}`}>
            {loading
              ? "Loading..."
              : selectedOption
              ? selectedOption.label
              : placeholder}
          </span>
          <svg
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 flex-shrink-0 ml-2 ${
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
            fixed sm:absolute top-auto sm:top-full bottom-0 sm:bottom-auto left-0 sm:left-0 right-0 sm:right-0 z-50 mt-1 sm:mt-1 max-h-60 overflow-auto
            border rounded-t-xl sm:rounded-lg shadow-lg
            theme-transition
            ${
              isDarkMode
                ? "bg-gray-800 border-gray-600 shadow-gray-900/50"
                : "bg-white border-gray-200 shadow-lg"
            }
          `}
            style={{
              maxHeight: "60vh",
              top: "auto",
              bottom: 0,
            }}
          >
            {/* Search Bar */}
            <div className="p-2 border-b theme-transition border-gray-200 dark:border-gray-600 sticky top-0 bg-inherit">
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
                className={`px-3 py-2 text-xs border-t theme-transition sticky bottom-0 bg-inherit ${
                  isDarkMode
                    ? "border-gray-600 text-gray-400"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                {filteredOptions.length} of {options.length} results
              </div>
            )}

            {/* Close button for mobile */}
            <div className="sm:hidden p-2 border-t theme-transition border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setIsOpen(false)}
                className={`w-full py-2 text-sm font-medium rounded-lg theme-transition ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

const CardSection: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cars, setCars] = useState<[CarData | null, CarData | null]>([
    null,
    null,
  ]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [automobiles, setAutomobiles] = useState<Automobile[]>([]);
  const [engines, setEngines] = useState<Engine[]>([]);

  const [selectedCarIndex, setSelectedCarIndex] = useState<number>(0);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedAutomobile, setSelectedAutomobile] = useState<string>("");
  const [selectedEngine, setSelectedEngine] = useState<string>("");
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);

  // Refs for auto-focus and scrolling
  const selectionPanelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const brandSelectRef = useRef<HTMLDivElement>(null);

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

  // Auto-focus and scroll when selection panel opens
  useEffect(() => {
    if (isSelecting && selectionPanelRef.current) {
      selectionPanelRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });

      setTimeout(() => {
        if (brandSelectRef.current) {
          const button = brandSelectRef.current.querySelector("button");
          if (button) button.focus();
        }
      }, 300);
    }
  }, [isSelecting]);

  // Reset comparison whenever cars change
  useEffect(() => {
    setComparisonResult(null);
  }, [cars]);

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
    setIsSelecting(true);
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
    if (selectedBrand && selectedAutomobile && selectedEngine) {
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
        const newCars = [...cars] as [CarData | null, CarData | null];
        newCars[selectedCarIndex] = {
          brand: selectedBrandData,
          automobile: selectedAutomobileData,
          engine: selectedEngineData,
        };
        setCars(newCars);

        setSelectedBrand("");
        setSelectedAutomobile("");
        setSelectedEngine("");
        setIsSelecting(false);

        setTimeout(() => {
          if (cardRefs.current[selectedCarIndex]) {
            cardRefs.current[selectedCarIndex]?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        }, 100);
      }
    }
  };

  const handleCancelSelection = () => {
    setSelectedBrand("");
    setSelectedAutomobile("");
    setSelectedEngine("");
    setIsSelecting(false);

    setTimeout(() => {
      if (cardRefs.current[selectedCarIndex]) {
        cardRefs.current[selectedCarIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 100);
  };

  const handleCompare = () => {
    if (
      cars[0] &&
      cars[1] &&
      cars[0].automobile &&
      cars[1].automobile &&
      cars[0].engine &&
      cars[1].engine
    ) {
      const result = CarComparator.compareCars(cars[0], cars[1]);
      setComparisonResult(result);

      setTimeout(() => {
        const comparisonElement = document.getElementById("comparison-results");
        if (comparisonElement) {
          comparisonElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  };

  const assignCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[index] = el;
  };

  // Check if both cars are selected
  const bothCarsSelected =
    cars[0] && cars[1] && cars[0].automobile && cars[1].automobile;

  return (
    <div
      className={`container mx-auto mt-15 mb-30 px-3 sm:px-4 py-12 sm:py-16 theme-transition ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="text-center mb-8 sm:mb-12">
        <h1
          className={`text-2xl sm:text-4xl font-bold mb-4 theme-transition ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Compare Cars
        </h1>
        <p
          className={`text-base sm:text-lg theme-transition ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Select two cars to compare their specifications
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 max-w-6xl mx-auto mb-8 sm:mb-12">
        {cars.map((car, index) => (
          <div key={index} ref={assignCardRef(index)}>
            <CarCard
              carData={car}
              index={index}
              onEdit={() => handleCardEdit(index)}
            />
          </div>
        ))}
      </div>

      {/* Compare Button */}
      {bothCarsSelected && !comparisonResult && (
        <div className="text-center mt-8 sm:mt-12">
          <button
            onClick={handleCompare}
            className="px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 theme-transition bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
          >
            🏁 Compare Cars
          </button>
          <p
            className={`mt-3 text-sm theme-transition ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Click to see detailed comparison and find out which car wins!
          </p>
        </div>
      )}

      {/* Selection Panel */}
      {isSelecting && (
        <div
          ref={selectionPanelRef}
          className={`max-w-2xl mx-auto rounded-lg shadow-lg border p-4 sm:p-6 transition-all duration-300 theme-transition my-8 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 shadow-gray-900/50"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="text-center mb-4 sm:mb-6">
            <h2
              className={`text-xl sm:text-2xl font-bold theme-transition ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Selecting Car {selectedCarIndex + 1}
            </h2>
            <p
              className={`mt-2 text-sm sm:text-base theme-transition ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Choose the brand, model, and engine
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
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
                ref={brandSelectRef}
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
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                onClick={handleCancelSelection}
                className={`px-4 sm:px-6 py-2 font-medium transition-colors duration-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 theme-transition order-2 sm:order-1 ${
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
                className={`px-4 sm:px-6 py-2 rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 theme-transition order-1 sm:order-2 ${
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

      {/* Comparison Results Panel */}
      <div id="comparison-results" className="my-8">
        {comparisonResult && (
          <ComparisonPanel
            car1={cars[0]!}
            car2={cars[1]!}
            comparisonResult={comparisonResult}
            onClose={() => setComparisonResult(null)}
          />
        )}
      </div>

      {/* Reset Comparison Button */}
      {comparisonResult && (
        <div className="text-center mt-6 sm:mt-8">
          <button
            onClick={() => setComparisonResult(null)}
            className={`px-4 sm:px-6 py-2 rounded-lg transition-colors duration-200 font-medium theme-transition w-full sm:w-auto ${
              isDarkMode
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
          >
            Reset Comparison
          </button>
          <p
            className={`text-xs sm:text-sm mt-2 theme-transition ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Change any vehicle to automatically reset the comparison
          </p>
        </div>
      )}
    </div>
  );
};

export default CardSection;
