// types.ts
export interface Brand {
  id: number;
  name: string;
  logo: string;
  url: string;
}

export interface Automobile {
  id: number;
  brand_id: number;
  name: string;
  photos: string[];
  url: string;
  // Add year extraction from name
  year?: number;
}

export interface Engine {
  id: number;
  automobile_id: number;
  name: string;
  specs: {
    [key: string]: {
      [key: string]: string;
    };
  };
  // Parsed specs for easier comparison
  parsedSpecs?: {
    horsepower?: number;
    torque?: number;
    displacement?: number;
    cylinders?: number;
    acceleration?: number;
    topSpeed?: number;
    fuelEconomy?: number;
  };
}

export interface CarData {
  brand: Brand | null;
  automobile: Automobile | null;
  engine: Engine | null;
  score?: number; // Comparison score
}
