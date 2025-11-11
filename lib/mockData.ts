export interface Project {
  project: {
    name: string;
  };
  zip: string;
  location: {
    city: string;
    state: string;
    climateZone: string;
  };
  buildingType: string;
  hoursPerYear: number;
  systemBaseline: {
    type: string;
    capacityTons: number;
    units: number;
    eer?: number;
    ieer?: number;
    cop47?: number;
    cop17?: number;
  };
  systemCompare: {
    type: string;
    capacityTons: number;
    units: number;
    eer?: number;
    ieer?: number;
    cop47?: number;
    cop17?: number;
  };
  electricRate: number;
  maintenanceCostPerYear: number;
  rebate: {
    source: string;
    amount: number;
  };
  analysisPeriodYears: number;
  results: {
    baselineAnnualKWh: number;
    compareAnnualKWh: number;
    annualKWhSavings: number;
    baselineAnnualCost: number;
    compareAnnualCost: number;
    annualCostSavings: number;
    simplePaybackYears: number;
    lifecycleSavings: number;
    co2ReductionTonsPerYear: number;
  };
}

export const MOCK_PROJECT: Project = {
  project: { name: 'Lincoln HS Rooftop Retrofit' },
  zip: '75001',
  location: { city: 'Plano', state: 'TX', climateZone: '3A' },
  buildingType: 'School',
  hoursPerYear: 3500,
  systemBaseline: {
    type: 'BE HP',
    capacityTons: 10,
    units: 1,
    cop47: 3.2,
    cop17: 2.1,
  },
  systemCompare: {
    type: 'INV HP',
    capacityTons: 10,
    units: 1,
    cop47: 3.2,
    cop17: 2.1,
  },
  electricRate: 0.12,
  maintenanceCostPerYear: 800,
  rebate: { source: 'EcoRebates', amount: 1500 },
  analysisPeriodYears: 15,
  results: {
    baselineAnnualKWh: 98000,
    compareAnnualKWh: 75000,
    annualKWhSavings: 23000,
    baselineAnnualCost: 11760,
    compareAnnualCost: 9000,
    annualCostSavings: 2760,
    simplePaybackYears: 3.6,
    lifecycleSavings: 55000,
    co2ReductionTonsPerYear: 10.4,
  },
};

export interface ZipLookupResult {
  city: string;
  state: string;
  climateZone: string;
}

/**
 * Mock function to lookup ZIP code information
 * Returns location data for a given ZIP code
 */
export function lookupZip(zip: string): ZipLookupResult | null {
  // Mock ZIP code database - in production, this would call an API
  const zipDatabase: Record<string, ZipLookupResult> = {
    '75001': { city: 'Plano', state: 'TX', climateZone: '3A' },
    '10001': { city: 'New York', state: 'NY', climateZone: '4A' },
    '90210': { city: 'Beverly Hills', state: 'CA', climateZone: '3B' },
    '60601': { city: 'Chicago', state: 'IL', climateZone: '5A' },
    '33101': { city: 'Miami', state: 'FL', climateZone: '1A' },
    '98101': { city: 'Seattle', state: 'WA', climateZone: '4C' },
    '80202': { city: 'Denver', state: 'CO', climateZone: '5B' },
    '77001': { city: 'Houston', state: 'TX', climateZone: '2A' },
  };

  const normalizedZip = zip.trim();
  return zipDatabase[normalizedZip] || null;
}

/**
 * Mock calculation function that simulates energy savings calculation
 * Returns results after a simulated delay
 */
export async function calculateSavings(
  projectData: Partial<Project>
): Promise<Project['results']> {
  // Simulate API call delay (2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return mock results - in production, this would call a real calculation API
  return MOCK_PROJECT.results;
}
