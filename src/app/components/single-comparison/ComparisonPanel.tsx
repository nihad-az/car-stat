// components/ComparisonPanel.tsx
import React from "react";
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
  const { winner, car1Score, car2Score, breakdown, detailedSpecs } =
    comparisonResult;

  const getWinnerColor = (index: number) => {
    if (winner === -1) return "text-yellow-600";
    return index === winner ? "text-green-600" : "text-red-600";
  };

  const getWinnerBg = (index: number) => {
    if (winner === -1) return "bg-yellow-100";
    return index === winner ? "bg-green-100" : "bg-red-100";
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
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
      <div className={`p-6 ${getWinnerBg(0)} border-b`}>
        <div className="text-center">
          {winner === -1 ? (
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl">🤝</span>
              <div>
                <h3 className="text-2xl font-bold text-yellow-700">
                  It's a Tie!
                </h3>
                <p className="text-yellow-600">
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
                <div className={`text-xl font-bold ${getWinnerColor(0)}`}>
                  Car 1: {car1Score} pts
                </div>
                <div className="text-sm text-gray-600">{car1.brand?.name}</div>
              </div>

              <div className="text-2xl text-gray-500 font-bold">VS</div>

              <div
                className={`text-center ${
                  winner === 1 ? "scale-110" : "scale-100"
                } transition-transform`}
              >
                <div className="text-4xl mb-2">
                  {winner === 1 ? "🏆" : "🥈"}
                </div>
                <div className={`text-xl font-bold ${getWinnerColor(1)}`}>
                  Car 2: {car2Score} pts
                </div>
                <div className="text-sm text-gray-600">{car2.brand?.name}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        {/* Comparison Breakdown */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📊</span> Comparison Breakdown
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {breakdown.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-800">
                    {item.category}
                  </h4>
                  <div className="flex items-center gap-2">
                    {item.winner !== -1 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        +{item.weight} pts
                      </span>
                    )}
                    {item.winner === -1 ? (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                        Tie
                      </span>
                    ) : (
                      <span
                        className={`bg-${
                          item.winner === 0 ? "green" : "red"
                        }-100 text-${
                          item.winner === 0 ? "green" : "red"
                        }-800 px-2 py-1 rounded text-sm`}
                      >
                        Car {item.winner + 1}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <div
                    className={`text-center p-2 rounded ${
                      item.winner === 0
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-gray-700">Car 1</div>
                    <div className="text-gray-600 font-semibold">
                      {item.car1Value || "N/A"}
                    </div>
                  </div>
                  <div
                    className={`text-center p-2 rounded ${
                      item.winner === 1
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-gray-700">Car 2</div>
                    <div className="text-gray-600 font-semibold">
                      {item.car2Value || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded text-center">
                  {item.reason}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Specifications */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🔧</span> Detailed Specifications
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {/* Engine Specs */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">
                Engine & Performance
              </h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-gray-500">Power</div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car1.power
                      ? `${detailedSpecs.car1.power} HP`
                      : "N/A"}
                  </div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car2.power
                      ? `${detailedSpecs.car2.power} HP`
                      : "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-gray-500">Torque</div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car1.torque
                      ? `${detailedSpecs.car1.torque} Nm`
                      : "N/A"}
                  </div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car2.torque
                      ? `${detailedSpecs.car2.torque} Nm`
                      : "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-gray-500">Displacement</div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car1.displacement
                      ? `${(detailedSpecs.car1.displacement / 1000).toFixed(
                          1
                        )}L`
                      : "N/A"}
                  </div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car2.displacement
                      ? `${(detailedSpecs.car2.displacement / 1000).toFixed(
                          1
                        )}L`
                      : "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-gray-500">Cylinders</div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car1.cylinders || "N/A"}
                  </div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car2.cylinders || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">
                Dimensions & Weight
              </h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-gray-500">Weight</div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car1.weight
                      ? `${detailedSpecs.car1.weight} kg`
                      : "N/A"}
                  </div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car2.weight
                      ? `${detailedSpecs.car2.weight} kg`
                      : "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-gray-500">Length</div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car1.length
                      ? `${detailedSpecs.car1.length} mm`
                      : "N/A"}
                  </div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car2.length
                      ? `${detailedSpecs.car2.length} mm`
                      : "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-gray-500">Drag Coeff.</div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car1.dragCoefficient || "N/A"}
                  </div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car2.dragCoefficient || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Transmission & Drivetrain */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">
                Transmission
              </h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-gray-500">Drive Type</div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car1.driveType || "N/A"}
                  </div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car2.driveType || "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-gray-500">Gearbox</div>
                  <div className="text-center font-medium">
                    {detailedSpecs.car1.gearbox || "N/A"}
                  </div>
                  <div className="text-center font-medium">
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
