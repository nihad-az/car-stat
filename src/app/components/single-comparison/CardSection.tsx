// components/CarComponent.tsx
"use client";

import React from "react";

const CarComponent: React.FC = () => {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-background overflow-hidden">
      <div className="relative container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div
            className="rounded-xl p-6 transition-all duration-300 
                       bg-white/10 backdrop-blur-md 
                       shadow-[0_0_20px_rgba(0,0,0,0.15)] 
                       hover:shadow-[0_0_30px_rgba(94,69,205,0.4)]"
          >
            {/* Header */}
            <div className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#5e45cd] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Sport
                </span>
                <span className="text-xl font-bold text-[#5e45cd]">
                  $69,900
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                BMW M3
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                BMW • 2020
              </p>
            </div>

            {/* Image */}
            <div className="mb-6">
              <img
                src="/placeholder.svg"
                alt="BMW M3"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Power</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  473 hp
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Torque</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  406 lb-ft
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Top Speed</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  155 mph
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Efficiency</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  25 MPG
                </p>
              </div>
            </div>

            {/* Acceleration */}
            <div className="p-4 bg-[#5e45cd]/20 rounded-lg text-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                0-60 mph
              </p>
              <p className="text-2xl font-bold text-[#5e45cd]">4.1s</p>
            </div>

            {/* CTA */}
            <div className="flex justify-center">
              <button className="bg-[#5e45cd] text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-[#4b38a0] transition">
                Compare Now
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="rounded-xl p-6 transition-all duration-300 
                       bg-white/10 backdrop-blur-md 
                       shadow-[0_0_20px_rgba(0,0,0,0.15)] 
                       hover:shadow-[0_0_30px_rgba(94,69,205,0.4)]"
          >
            <div className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#5e45cd] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Luxury
                </span>
                <span className="text-xl font-bold text-[#5e45cd]">
                  $39,900
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Audi A4
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Audi • 2021
              </p>
            </div>

            <div className="mb-6">
              <img
                src="/placeholder.svg"
                alt="Audi A4"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <div className="p-4 bg-[#5e45cd]/20 rounded-lg text-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                0-60 mph
              </p>
              <p className="text-2xl font-bold text-[#5e45cd]">5.2s</p>
            </div>

            <div className="flex justify-center">
              <button className="bg-[#5e45cd] text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-[#4b38a0] transition">
                Compare Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarComponent;
