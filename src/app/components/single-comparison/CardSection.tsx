"use client";

import React, { useState, useEffect, useRef } from "react";
import CarCard from "./CarCard";
import ComparisonPanel from "./ComparisonPanel";
import { Brand, Automobile, Engine, CarData } from "./types";
import { CarComparator, ComparisonResult } from "../utils/comparison";

const CardSection: React.FC = () => {
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
  const brandSelectRef = useRef<HTMLSelectElement>(null);

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
          brandSelectRef.current.focus();
        }
      }, 300);
    }
  }, [isSelecting]);

  // Reset comparison whenever cars change
  useEffect(() => {
    setComparisonResult(null);
  }, [cars]); // This effect runs whenever the cars state changes

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

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    setSelectedAutomobile("");
    setSelectedEngine("");
    setAutomobiles([]);
    setEngines([]);

    if (brandId) {
      loadAutomobiles(brandId);
    }
  };

  const handleAutomobileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const autoId = e.target.value;
    setSelectedAutomobile(autoId);
    setSelectedEngine("");
    setEngines([]);

    if (autoId) {
      loadEngines(autoId);
    }
  };

  const handleEngineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEngine(e.target.value);
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

      // Scroll to comparison results
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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Compare Cars</h1>
        <p className="text-gray-600 text-lg">
          Select two cars to compare their specifications
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
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

      {/* Compare Button - Only shows when both cars are selected and no comparison is active */}
      {bothCarsSelected && !comparisonResult && (
        <div className="text-center mt-8">
          <button
            onClick={handleCompare}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🏁 Compare Cars
          </button>
          <p className="text-gray-500 mt-2">
            Click to see detailed comparison and find out which car wins!
          </p>
        </div>
      )}

      {/* Selection Panel - Shows below cards when selecting */}
      {isSelecting && (
        <div
          ref={selectionPanelRef}
          className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-6 transition-all duration-300"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Selecting Car {selectedCarIndex + 1}
            </h2>
            <p className="text-gray-600 mt-2">
              Choose the brand, model, and engine
            </p>
          </div>

          <div className="space-y-6">
            {/* Brand Selection */}
            <div>
              <label
                htmlFor="brand-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Brand
              </label>
              <select
                ref={brandSelectRef}
                id="brand-select"
                value={selectedBrand}
                onChange={handleBrandChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e45cd] focus:border-[#5e45cd] transition-colors duration-200 bg-white"
                disabled={loading}
                autoFocus
                size={5}
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              <div className="text-xs text-gray-500 mt-1">
                {brands.length} brands available
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label
                htmlFor="model-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Model
              </label>
              <select
                id="model-select"
                value={selectedAutomobile}
                onChange={handleAutomobileChange}
                disabled={!selectedBrand || loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e45cd] focus:border-[#5e45cd] disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200 bg-white"
                size={5}
              >
                <option value="">Select a model</option>
                {automobiles.map((auto) => (
                  <option key={auto.id} value={auto.id}>
                    {auto.name
                      .replace(/Photos, engines &amp; full specs/g, "")
                      .trim()}
                  </option>
                ))}
              </select>
              <div className="text-xs text-gray-500 mt-1">
                {!selectedBrand
                  ? "Select a brand first"
                  : `${automobiles.length} models available`}
              </div>
            </div>

            {/* Engine Selection */}
            <div>
              <label
                htmlFor="engine-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Engine
              </label>
              <select
                id="engine-select"
                value={selectedEngine}
                onChange={handleEngineChange}
                disabled={!selectedAutomobile || loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e45cd] focus:border-[#5e45cd] disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200 bg-white"
                size={4}
              >
                <option value="">Select an engine</option>
                {engines.map((engine) => (
                  <option key={engine.id} value={engine.id}>
                    {engine.name}
                  </option>
                ))}
              </select>
              <div className="text-xs text-gray-500 mt-1">
                {!selectedAutomobile
                  ? "Select a model first"
                  : `${engines.length} engines available`}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={handleCancelSelection}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5e45cd] focus:ring-offset-2"
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
                className="px-6 py-2 bg-[#5e45cd] text-white rounded-lg hover:bg-[#4d36b8] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#5e45cd] focus:ring-offset-2"
              >
                {loading ? "Loading..." : "Confirm Selection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Results Panel */}
      <div id="comparison-results">
        {comparisonResult && (
          <ComparisonPanel
            car1={cars[0]!}
            car2={cars[1]!}
            comparisonResult={comparisonResult}
            onClose={() => setComparisonResult(null)}
          />
        )}
      </div>

      {/* Reset Comparison Button - Only show when comparison is active */}
      {comparisonResult && (
        <div className="text-center mt-6">
          <button
            onClick={() => setComparisonResult(null)}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Reset Comparison
          </button>
          <p className="text-gray-500 text-sm mt-2">
            Change any vehicle to automatically reset the comparison
          </p>
        </div>
      )}
    </div>
  );
};

export default CardSection;
