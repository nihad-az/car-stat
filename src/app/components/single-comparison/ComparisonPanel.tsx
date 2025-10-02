import React, { useState, useEffect } from "react";
import { CarData } from "./types";
import { ComparisonResult } from "../utils/comparison";

interface ComparisonPanelProps {
  car1: CarData;
  car2: CarData;
  comparisonResult: ComparisonResult;
  onClose: () => void;
}

const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  car1,
  car2,
  comparisonResult,
  onClose,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { winner, car1Score, car2Score, breakdown, detailedSpecs } =
    comparisonResult;

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

  const getWinnerColor = (index: number) => {
    if (winner === -1)
      return isDarkMode ? "text-yellow-400" : "text-yellow-600";
    return index === winner
      ? isDarkMode
        ? "text-green-400"
        : "text-green-600"
      : isDarkMode
      ? "text-red-400"
      : "text-red-600";
  };

  const getWinnerBg = (index: number) => {
    if (winner === -1) return isDarkMode ? "bg-yellow-900" : "bg-yellow-100";
    return index === winner
      ? isDarkMode
        ? "bg-green-900"
        : "bg-green-100"
      : isDarkMode
      ? "bg-red-900"
      : "bg-red-100";
  };

  const getBorderColor = () => {
    return isDarkMode ? "border-gray-700" : "border-gray-200";
  };

  const getTextColor = () => {
    return isDarkMode ? "text-white" : "text-gray-900";
  };

  const getMutedTextColor = () => {
    return isDarkMode ? "text-gray-300" : "text-gray-600";
  };

  const getCardBg = () => {
    return isDarkMode ? "bg-gray-800" : "bg-gray-50";
  };

  return (
    <div
      className={`mt-8 rounded-lg shadow-lg border overflow-hidden theme-transition ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Car Comparison Results</h2>
            <p className="text-purple-100 mt-1">
              Detailed analysis of both vehicles
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-200 text-xl font-bold transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* Winner Banner */}
      <div
        className={`p-6 border-b theme-transition ${getWinnerBg(
          0
        )} ${getBorderColor()}`}
      >
        <div className="text-center">
          {winner === -1 ? (
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl">🤝</span>
              <div>
                <h3
                  className={`text-2xl font-bold theme-transition ${
                    isDarkMode ? "text-yellow-300" : "text-yellow-700"
                  }`}
                >
                  It's a Tie!
                </h3>
                <p
                  className={isDarkMode ? "text-yellow-200" : "text-yellow-600"}
                >
                  Both cars scored {car1Score} points
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-6">
              <div
                className={`text-center ${
                  winner === 0 ? "scale-110" : "scale-100"
                } transition-transform`}
              >
                <div className="text-4xl mb-2">
                  {winner === 0 ? "🏆" : "🥈"}
                </div>
                <div
                  className={`text-xl font-bold theme-transition ${getWinnerColor(
                    0
                  )}`}
                >
                  Car 1: {car1Score} pts
                </div>
                <div
                  className={`text-sm theme-transition ${getMutedTextColor()}`}
                >
                  {car1.brand?.name}
                </div>
              </div>

              <div
                className={`text-2xl font-bold theme-transition ${getMutedTextColor()}`}
              >
                VS
              </div>

              <div
                className={`text-center ${
                  winner === 1 ? "scale-110" : "scale-100"
                } transition-transform`}
              >
                <div className="text-4xl mb-2">
                  {winner === 1 ? "🏆" : "🥈"}
                </div>
                <div
                  className={`text-xl font-bold theme-transition ${getWinnerColor(
                    1
                  )}`}
                >
                  Car 2: {car2Score} pts
                </div>
                <div
                  className={`text-sm theme-transition ${getMutedTextColor()}`}
                >
                  {car2.brand?.name}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        {/* Comparison Breakdown */}
        <div>
          <h3
            className={`text-xl font-bold mb-4 flex items-center gap-2 theme-transition ${getTextColor()}`}
          >
            <span>📊</span> Comparison Breakdown
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {breakdown.map((item, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow theme-transition ${
                  isDarkMode
                    ? "border-gray-700 hover:shadow-gray-900/50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4
                    className={`font-semibold theme-transition ${getTextColor()}`}
                  >
                    {item.category}
                  </h4>
                  <div className="flex items-center gap-2">
                    {item.winner !== -1 && (
                      <span
                        className={`text-xs px-2 py-1 rounded theme-transition ${
                          isDarkMode
                            ? "bg-blue-900 text-blue-200"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        +{item.weight} pts
                      </span>
                    )}
                    {item.winner === -1 ? (
                      <span
                        className={`px-2 py-1 rounded text-sm theme-transition ${
                          isDarkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        Tie
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-sm theme-transition ${
                          item.winner === 0
                            ? isDarkMode
                              ? "bg-green-900 text-green-200"
                              : "bg-green-100 text-green-800"
                            : isDarkMode
                            ? "bg-red-900 text-red-200"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        Car {item.winner + 1}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <div
                    className={`text-center p-2 rounded border theme-transition ${
                      item.winner === 0
                        ? isDarkMode
                          ? "bg-green-900 border-green-700"
                          : "bg-green-50 border-green-200"
                        : isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`font-medium theme-transition ${getMutedTextColor()}`}
                    >
                      Car 1
                    </div>
                    <div
                      className={`font-semibold theme-transition ${getTextColor()}`}
                    >
                      {item.car1Value || "N/A"}
                    </div>
                  </div>
                  <div
                    className={`text-center p-2 rounded border theme-transition ${
                      item.winner === 1
                        ? isDarkMode
                          ? "bg-green-900 border-green-700"
                          : "bg-green-50 border-green-200"
                        : isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`font-medium theme-transition ${getMutedTextColor()}`}
                    >
                      Car 2
                    </div>
                    <div
                      className={`font-semibold theme-transition ${getTextColor()}`}
                    >
                      {item.car2Value || "N/A"}
                    </div>
                  </div>
                </div>

                <div
                  className={`text-sm p-2 rounded text-center theme-transition ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-50 text-gray-600"
                  }`}
                >
                  {item.reason}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Specifications */}
        <div>
          <h3
            className={`text-xl font-bold mb-4 flex items-center gap-2 theme-transition ${getTextColor()}`}
          >
            <span>🔧</span> Detailed Specifications
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {/* Engine Specs */}
            <div
              className={`border rounded-lg p-4 theme-transition ${getBorderColor()}`}
            >
              <h4
                className={`font-semibold mb-3 border-b pb-2 theme-transition ${getTextColor()} ${getBorderColor()}`}
              >
                Engine & Performance
              </h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <div className={`theme-transition ${getMutedTextColor()}`}>
                    Power
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car1.power
                      ? `${detailedSpecs.car1.power} HP`
                      : "N/A"}
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car2.power
                      ? `${detailedSpecs.car2.power} HP`
                      : "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className={`theme-transition ${getMutedTextColor()}`}>
                    Torque
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car1.torque
                      ? `${detailedSpecs.car1.torque} Nm`
                      : "N/A"}
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car2.torque
                      ? `${detailedSpecs.car2.torque} Nm`
                      : "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className={`theme-transition ${getMutedTextColor()}`}>
                    Displacement
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car1.displacement
                      ? `${(detailedSpecs.car1.displacement / 1000).toFixed(
                          1
                        )}L`
                      : "N/A"}
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car2.displacement
                      ? `${(detailedSpecs.car2.displacement / 1000).toFixed(
                          1
                        )}L`
                      : "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className={`theme-transition ${getMutedTextColor()}`}>
                    Cylinders
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car1.cylinders || "N/A"}
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car2.cylinders || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div
              className={`border rounded-lg p-4 theme-transition ${getBorderColor()}`}
            >
              <h4
                className={`font-semibold mb-3 border-b pb-2 theme-transition ${getTextColor()} ${getBorderColor()}`}
              >
                Dimensions & Weight
              </h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <div className={`theme-transition ${getMutedTextColor()}`}>
                    Weight
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car1.weight
                      ? `${detailedSpecs.car1.weight} kg`
                      : "N/A"}
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car2.weight
                      ? `${detailedSpecs.car2.weight} kg`
                      : "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className={`theme-transition ${getMutedTextColor()}`}>
                    Length
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car1.length
                      ? `${detailedSpecs.car1.length} mm`
                      : "N/A"}
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car2.length
                      ? `${detailedSpecs.car2.length} mm`
                      : "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className={`theme-transition ${getMutedTextColor()}`}>
                    Drag Coeff.
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car1.dragCoefficient || "N/A"}
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car2.dragCoefficient || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Transmission & Drivetrain */}
            <div
              className={`border rounded-lg p-4 theme-transition ${getBorderColor()}`}
            >
              <h4
                className={`font-semibold mb-3 border-b pb-2 theme-transition ${getTextColor()} ${getBorderColor()}`}
              >
                Transmission
              </h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <div className={`theme-transition ${getMutedTextColor()}`}>
                    Drive Type
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car1.driveType || "N/A"}
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car2.driveType || "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className={`theme-transition ${getMutedTextColor()}`}>
                    Gearbox
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car1.gearbox || "N/A"}
                  </div>
                  <div
                    className={`text-center font-medium theme-transition ${getTextColor()}`}
                  >
                    {detailedSpecs.car2.gearbox || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPanel;
