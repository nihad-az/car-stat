// utils/comparison.ts

import { CarData } from "../single-comparison/types";

export interface ComparisonResult {
  winner: number; // 0 or 1 for car index, -1 for tie
  car1Score: number;
  car2Score: number;
  breakdown: {
    category: string;
    winner: number; // 0, 1, or -1 for tie
    car1Value: any;
    car2Value: any;
    reason: string;
    weight: number;
  }[];
  detailedSpecs: {
    car1: any;
    car2: any;
  };
}

export class CarComparator {
  static extractYearFromName(name: string): {
    startYear: number | null;
    endYear: number | null;
  } {
    if (!name) return { startYear: null, endYear: null };

    const yearMatches = name.matchAll(/(19|20)\d{2}/g);
    const years = Array.from(yearMatches).map((match) => parseInt(match[0]));

    if (years.length === 0) return { startYear: null, endYear: null };

    return {
      startYear: Math.min(...years),
      endYear: Math.max(...years),
    };
  }

  static parseNumericValue(text: string | undefined): number | null {
    if (!text) return null;

    // Handle different formats: "350 HP", "407 Nm", "5.6 S", "155 Mph", "19.9 L/100Km"
    const match = text.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : null;
  }

  static parsePower(text: string | undefined): number | null {
    if (!text) return null;

    // Handle power formats specifically looking for HP/BHP
    // Example: "257.4 Kw @ 6500 Rpm\r\n350 Hp @ 6500 Rpm\r\n345 Bhp @ 6500 Rpm"
    const hpMatch = text.match(/(\d+\.?\d*)\s*Hp\s*@/i); // Look for "Hp @"
    const bhpMatch = text.match(/(\d+\.?\d*)\s*Bhp\s*@/i); // Look for "Bhp @"
    const kwMatch = text.match(/(\d+\.?\d*)\s*Kw\s*@/i); // Look for "Kw @"

    // Prefer HP/BHP over KW
    if (bhpMatch) return parseFloat(bhpMatch[1]);
    if (hpMatch) return parseFloat(hpMatch[1]);
    if (kwMatch) return parseFloat(kwMatch[1]) * 1.34102; // Convert KW to HP

    // Fallback: look for HP/BHP anywhere in the text
    const fallbackHpMatch = text.match(/(\d+\.?\d*)\s*Hp/i);
    const fallbackBhpMatch = text.match(/(\d+\.?\d*)\s*Bhp/i);

    if (fallbackBhpMatch) return parseFloat(fallbackBhpMatch[1]);
    if (fallbackHpMatch) return parseFloat(fallbackHpMatch[1]);

    return null;
  }

  static parseTorque(text: string | undefined): number | null {
    if (!text) return null;

    // Handle torque formats specifically looking for Nm/Lb-Ft
    // Example: "300 Lb-Ft @ 4000 Rpm\r\n407 Nm @ 4000 Rpm"
    const nmMatch = text.match(/(\d+\.?\d*)\s*Nm\s*@/i); // Look for "Nm @"
    const lbftMatch = text.match(/(\d+\.?\d*)\s*Lb-Ft\s*@/i); // Look for "Lb-Ft @"

    // Prefer Nm over Lb-Ft
    if (nmMatch) return parseFloat(nmMatch[1]);
    if (lbftMatch) return parseFloat(lbftMatch[1]) * 1.35582; // Convert lb-ft to Nm

    // Fallback: look for torque units anywhere in the text
    const fallbackNmMatch = text.match(/(\d+\.?\d*)\s*Nm/i);
    const fallbackLbftMatch = text.match(/(\d+\.?\d*)\s*Lb-Ft/i);

    if (fallbackNmMatch) return parseFloat(fallbackNmMatch[1]);
    if (fallbackLbftMatch) return parseFloat(fallbackLbftMatch[1]) * 1.35582;

    return null;
  }

  static parseDisplacement(text: string | undefined): number | null {
    if (!text) return null;

    // Handle displacement: "3506 Cm3"
    const match = text.match(/(\d+\.?\d*)\s*Cm3/i);
    return match ? parseFloat(match[1]) : null;
  }

  static parseWeight(text: string | undefined): number | null {
    if (!text) return null;

    // Handle weight: "3560 Lbs (1615 Kg)"
    const kgMatch = text.match(/(\d+\.?\d*)\s*Kg/i);
    const lbsMatch = text.match(/(\d+\.?\d*)\s*Lbs/i);

    if (kgMatch) return parseFloat(kgMatch[1]);
    if (lbsMatch) return parseFloat(lbsMatch[1]) * 0.453592; // Convert lbs to kg

    return null;
  }

  static parseFuelEconomy(text: string | undefined): number | null {
    if (!text) return null;

    // Handle fuel economy: "11.8 Mpg Us (19.9 L/100Km)"
    const l100kmMatch = text.match(/(\d+\.?\d*)\s*L\/100Km/i);
    const mpgMatch = text.match(/(\d+\.?\d*)\s*Mpg/i);

    if (l100kmMatch) return parseFloat(l100kmMatch[1]);
    if (mpgMatch) {
      const mpg = parseFloat(mpgMatch[1]);
      return 235.214 / mpg; // Convert MPG to L/100km
    }

    return null;
  }

  static parseEngineSpecs(engine: any): any {
    if (!engine?.specs) return {};

    const specs = engine.specs;
    const parsed: any = {};

    // Engine Specs
    const engineSpecs = specs["Engine Specs"] || {};

    // Parse power and torque with better separation
    const powerText = engineSpecs["Power:"];
    const torqueText = engineSpecs["Torque:"];

    parsed.power = this.parsePower(powerText);
    parsed.torque = this.parseTorque(torqueText);

    // Debug logging for power/torque parsing
    console.log("Power text:", powerText);
    console.log("Parsed power:", parsed.power);
    console.log("Torque text:", torqueText);
    console.log("Parsed torque:", parsed.torque);

    parsed.displacement = this.parseDisplacement(engineSpecs["Displacement:"]);
    parsed.fuelSystem = engineSpecs["Fuel System:"];
    parsed.fuelType = engineSpecs["Fuel:"];
    parsed.fuelCapacity = this.parseNumericValue(engineSpecs["Fuel Capacity:"]);

    // Performance Specs
    const performance = specs["Performance Specs"] || {};
    parsed.topSpeed = this.parseNumericValue(performance["Top Speed:"]);
    parsed.acceleration = this.parseNumericValue(
      performance["Acceleration 0-62 Mph (0-100 Kph):"]
    );

    // Transmission Specs
    const transmission = specs["Transmission Specs"] || {};
    parsed.driveType = transmission["Drive Type:"];
    parsed.gearbox = transmission["Gearbox:"];

    // Brakes Specs
    const brakes = specs["Brakes Specs"] || {};
    parsed.frontBrakes = brakes["Front:"];
    parsed.rearBrakes = brakes["Rear:"];

    // Tires Specs
    const tires = specs["Tires Specs"] || {};
    parsed.tireSize = tires["Tire Size:"];

    // Dimensions
    const dimensions = specs["Dimensions"] || {};
    parsed.length = this.parseNumericValue(dimensions["Length:"]);
    parsed.width = this.parseNumericValue(dimensions["Width:"]);
    parsed.height = this.parseNumericValue(dimensions["Height:"]);
    parsed.wheelbase = this.parseNumericValue(dimensions["Wheelbase:"]);
    parsed.weight = this.parseWeight(dimensions["Unladen Weight:"]);
    parsed.cargoVolume = this.parseNumericValue(dimensions["Cargo Volume:"]);
    parsed.turningCircle = this.parseNumericValue(
      dimensions["Turning Circle (Wall To Wall):"]
    );
    parsed.dragCoefficient = this.parseNumericValue(
      dimensions["Aerodynamics (Cd):"]
    );

    // Fuel Economy
    const fuelEconomy = specs["Fuel Economy (Nedc)"] || {};
    parsed.cityMPG = this.parseFuelEconomy(fuelEconomy["City:"]);
    parsed.highwayMPG = this.parseFuelEconomy(fuelEconomy["Highway:"]);

    // Calculate average fuel economy
    if (parsed.cityMPG && parsed.highwayMPG) {
      parsed.averageFuelEconomy = (parsed.cityMPG + parsed.highwayMPG) / 2;
    } else if (parsed.cityMPG) {
      parsed.averageFuelEconomy = parsed.cityMPG;
    } else if (parsed.highwayMPG) {
      parsed.averageFuelEconomy = parsed.highwayMPG;
    }

    // Parse cylinders
    const cylindersText = engineSpecs["Cylinders:"] || "";
    if (cylindersText.includes("V12")) parsed.cylinders = 12;
    else if (cylindersText.includes("V10")) parsed.cylinders = 10;
    else if (cylindersText.includes("V8")) parsed.cylinders = 8;
    else if (cylindersText.includes("V6")) parsed.cylinders = 6;
    else if (cylindersText.match(/\b4\b/)) parsed.cylinders = 4;
    else if (cylindersText.match(/\b6\b/)) parsed.cylinders = 6;
    else if (cylindersText.match(/\b8\b/)) parsed.cylinders = 8;

    return parsed;
  }

  static compareCars(car1: CarData, car2: CarData): ComparisonResult {
    const breakdown = [];
    let car1Score = 0;
    let car2Score = 0;

    // Parse specs for both cars
    const car1Specs = car1.engine ? this.parseEngineSpecs(car1.engine) : {};
    const car2Specs = car2.engine ? this.parseEngineSpecs(car2.engine) : {};

    // Debug logging
    console.log("Car 1 specs:", car1Specs);
    console.log("Car 2 specs:", car2Specs);

    // Extract years
    const car1Years = car1.automobile
      ? this.extractYearFromName(car1.automobile.name)
      : { startYear: null, endYear: null };
    const car2Years = car2.automobile
      ? this.extractYearFromName(car2.automobile.name)
      : { startYear: null, endYear: null };

    // 1. Compare Latest Year (newer is better)
    if (car1Years.endYear && car2Years.endYear) {
      const weight = 3;
      if (car1Years.endYear > car2Years.endYear) {
        car1Score += weight;
        breakdown.push({
          category: "Model Year",
          winner: 0,
          car1Value: car1Years.endYear,
          car2Value: car2Years.endYear,
          reason: `Car 1 is newer (${car1Years.endYear} vs ${car2Years.endYear})`,
          weight,
        });
      } else if (car2Years.endYear > car1Years.endYear) {
        car2Score += weight;
        breakdown.push({
          category: "Model Year",
          winner: 1,
          car1Value: car1Years.endYear,
          car2Value: car2Years.endYear,
          reason: `Car 2 is newer (${car2Years.endYear} vs ${car1Years.endYear})`,
          weight,
        });
      } else {
        breakdown.push({
          category: "Model Year",
          winner: -1,
          car1Value: car1Years.endYear,
          car2Value: car2Years.endYear,
          reason: "Same model year",
          weight: 0,
        });
      }
    }

    // 2. Compare Power (more is better)
    if (car1Specs.power && car2Specs.power) {
      const weight = 4;
      if (car1Specs.power > car2Specs.power) {
        car1Score += weight;
        breakdown.push({
          category: "Power",
          winner: 0,
          car1Value: `${Math.round(car1Specs.power)} HP`,
          car2Value: `${Math.round(car2Specs.power)} HP`,
          reason: `Car 1 has more power (+${Math.round(
            car1Specs.power - car2Specs.power
          )} HP)`,
          weight,
        });
      } else if (car2Specs.power > car1Specs.power) {
        car2Score += weight;
        breakdown.push({
          category: "Power",
          winner: 1,
          car1Value: `${Math.round(car1Specs.power)} HP`,
          car2Value: `${Math.round(car2Specs.power)} HP`,
          reason: `Car 2 has more power (+${Math.round(
            car2Specs.power - car1Specs.power
          )} HP)`,
          weight,
        });
      } else {
        breakdown.push({
          category: "Power",
          winner: -1,
          car1Value: `${Math.round(car1Specs.power)} HP`,
          car2Value: `${Math.round(car2Specs.power)} HP`,
          reason: "Equal power",
          weight: 0,
        });
      }
    }

    // 3. Compare Torque (more is better)
    if (car1Specs.torque && car2Specs.torque) {
      const weight = 3;
      if (car1Specs.torque > car2Specs.torque) {
        car1Score += weight;
        breakdown.push({
          category: "Torque",
          winner: 0,
          car1Value: `${Math.round(car1Specs.torque)} Nm`,
          car2Value: `${Math.round(car2Specs.torque)} Nm`,
          reason: `Car 1 has more torque (+${Math.round(
            car1Specs.torque - car2Specs.torque
          )} Nm)`,
          weight,
        });
      } else if (car2Specs.torque > car1Specs.torque) {
        car2Score += weight;
        breakdown.push({
          category: "Torque",
          winner: 1,
          car1Value: `${Math.round(car1Specs.torque)} Nm`,
          car2Value: `${Math.round(car2Specs.torque)} Nm`,
          reason: `Car 2 has more torque (+${Math.round(
            car2Specs.torque - car1Specs.torque
          )} Nm)`,
          weight,
        });
      } else {
        breakdown.push({
          category: "Torque",
          winner: -1,
          car1Value: `${Math.round(car1Specs.torque)} Nm`,
          car2Value: `${Math.round(car2Specs.torque)} Nm`,
          reason: "Equal torque",
          weight: 0,
        });
      }
    }

    // 4. Compare Acceleration (faster is better)
    if (car1Specs.acceleration && car2Specs.acceleration) {
      const weight = 4;
      if (car1Specs.acceleration < car2Specs.acceleration) {
        car1Score += weight;
        breakdown.push({
          category: "Acceleration (0-62 mph)",
          winner: 0,
          car1Value: `${car1Specs.acceleration}s`,
          car2Value: `${car2Specs.acceleration}s`,
          reason: `Car 1 is faster by ${(
            car2Specs.acceleration - car1Specs.acceleration
          ).toFixed(1)}s`,
          weight,
        });
      } else if (car2Specs.acceleration < car1Specs.acceleration) {
        car2Score += weight;
        breakdown.push({
          category: "Acceleration (0-62 mph)",
          winner: 1,
          car1Value: `${car1Specs.acceleration}s`,
          car2Value: `${car2Specs.acceleration}s`,
          reason: `Car 2 is faster by ${(
            car1Specs.acceleration - car2Specs.acceleration
          ).toFixed(1)}s`,
          weight,
        });
      } else {
        breakdown.push({
          category: "Acceleration (0-62 mph)",
          winner: -1,
          car1Value: `${car1Specs.acceleration}s`,
          car2Value: `${car2Specs.acceleration}s`,
          reason: "Equal acceleration",
          weight: 0,
        });
      }
    }

    // 5. Compare Top Speed (higher is better)
    if (car1Specs.topSpeed && car2Specs.topSpeed) {
      const weight = 2;
      if (car1Specs.topSpeed > car2Specs.topSpeed) {
        car1Score += weight;
        breakdown.push({
          category: "Top Speed",
          winner: 0,
          car1Value: `${car1Specs.topSpeed} mph`,
          car2Value: `${car2Specs.topSpeed} mph`,
          reason: `Car 1 has higher top speed (+${
            car1Specs.topSpeed - car2Specs.topSpeed
          } mph)`,
          weight,
        });
      } else if (car2Specs.topSpeed > car1Specs.topSpeed) {
        car2Score += weight;
        breakdown.push({
          category: "Top Speed",
          winner: 1,
          car1Value: `${car1Specs.topSpeed} mph`,
          car2Value: `${car2Specs.topSpeed} mph`,
          reason: `Car 2 has higher top speed (+${
            car2Specs.topSpeed - car1Specs.topSpeed
          } mph)`,
          weight,
        });
      } else {
        breakdown.push({
          category: "Top Speed",
          winner: -1,
          car1Value: `${car1Specs.topSpeed} mph`,
          car2Value: `${car2Specs.topSpeed} mph`,
          reason: "Equal top speed",
          weight: 0,
        });
      }
    }

    // 6. Compare Fuel Efficiency (lower consumption is better)
    if (car1Specs.averageFuelEconomy && car2Specs.averageFuelEconomy) {
      const weight = 3;
      // Lower L/100km is better
      if (car1Specs.averageFuelEconomy < car2Specs.averageFuelEconomy) {
        car1Score += weight;
        breakdown.push({
          category: "Fuel Economy",
          winner: 0,
          car1Value: `${car1Specs.averageFuelEconomy.toFixed(1)} L/100km`,
          car2Value: `${car2Specs.averageFuelEconomy.toFixed(1)} L/100km`,
          reason: `Car 1 is more efficient (${(
            car2Specs.averageFuelEconomy - car1Specs.averageFuelEconomy
          ).toFixed(1)} L/100km better)`,
          weight,
        });
      } else if (car2Specs.averageFuelEconomy < car1Specs.averageFuelEconomy) {
        car2Score += weight;
        breakdown.push({
          category: "Fuel Economy",
          winner: 1,
          car1Value: `${car1Specs.averageFuelEconomy.toFixed(1)} L/100km`,
          car2Value: `${car2Specs.averageFuelEconomy.toFixed(1)} L/100km`,
          reason: `Car 2 is more efficient (${(
            car1Specs.averageFuelEconomy - car2Specs.averageFuelEconomy
          ).toFixed(1)} L/100km better)`,
          weight,
        });
      } else {
        breakdown.push({
          category: "Fuel Economy",
          winner: -1,
          car1Value: `${car1Specs.averageFuelEconomy.toFixed(1)} L/100km`,
          car2Value: `${car2Specs.averageFuelEconomy.toFixed(1)} L/100km`,
          reason: "Equal fuel economy",
          weight: 0,
        });
      }
    }

    // 7. Compare Weight (lighter is better for handling/efficiency)
    if (car1Specs.weight && car2Specs.weight) {
      const weight = 2;
      if (car1Specs.weight < car2Specs.weight) {
        car1Score += weight;
        breakdown.push({
          category: "Weight",
          winner: 0,
          car1Value: `${Math.round(car1Specs.weight)} kg`,
          car2Value: `${Math.round(car2Specs.weight)} kg`,
          reason: `Car 1 is lighter (better handling/efficiency)`,
          weight,
        });
      } else if (car2Specs.weight < car1Specs.weight) {
        car2Score += weight;
        breakdown.push({
          category: "Weight",
          winner: 1,
          car1Value: `${Math.round(car1Specs.weight)} kg`,
          car2Value: `${Math.round(car2Specs.weight)} kg`,
          reason: `Car 2 is lighter (better handling/efficiency)`,
          weight,
        });
      } else {
        breakdown.push({
          category: "Weight",
          winner: -1,
          car1Value: `${Math.round(car1Specs.weight)} kg`,
          car2Value: `${Math.round(car2Specs.weight)} kg`,
          reason: "Equal weight",
          weight: 0,
        });
      }
    }

    // 8. Compare Engine Size (smaller displacement for efficiency)
    if (car1Specs.displacement && car2Specs.displacement) {
      const weight = 2;
      if (car1Specs.displacement < car2Specs.displacement) {
        car1Score += weight;
        breakdown.push({
          category: "Engine Size",
          winner: 0,
          car1Value: `${(car1Specs.displacement / 1000).toFixed(1)}L`,
          car2Value: `${(car2Specs.displacement / 1000).toFixed(1)}L`,
          reason: "Car 1 has more efficient smaller engine",
          weight,
        });
      } else if (car2Specs.displacement < car1Specs.displacement) {
        car2Score += weight;
        breakdown.push({
          category: "Engine Size",
          winner: 1,
          car1Value: `${(car1Specs.displacement / 1000).toFixed(1)}L`,
          car2Value: `${(car2Specs.displacement / 1000).toFixed(1)}L`,
          reason: "Car 2 has more efficient smaller engine",
          weight,
        });
      } else {
        breakdown.push({
          category: "Engine Size",
          winner: -1,
          car1Value: `${(car1Specs.displacement / 1000).toFixed(1)}L`,
          car2Value: `${(car2Specs.displacement / 1000).toFixed(1)}L`,
          reason: "Same engine displacement",
          weight: 0,
        });
      }
    }

    // Determine overall winner
    let winner = -1; // tie
    if (car1Score > car2Score) winner = 0;
    else if (car2Score > car1Score) winner = 1;

    console.log("Comparison result:", {
      winner,
      car1Score,
      car2Score,
      breakdown,
    });

    return {
      winner,
      car1Score,
      car2Score,
      breakdown,
      detailedSpecs: {
        car1: car1Specs,
        car2: car2Specs,
      },
    };
  }
}
