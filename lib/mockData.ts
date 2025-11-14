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
  energySeries: Array<{ year: number; baseline: number; inv: number }>;
  lifecycleBaselineSeries: Array<{
    year: number;
    energy: number;
    maintenance: number;
    capex: number;
  }>;
  lifecycleInvSeries: Array<{
    year: number;
    energy: number;
    maintenance: number;
    capex: number;
  }>;
}

const ANALYSIS_PERIOD_YEARS = 15;
const ENERGY_ESCALATION_RATE = 0.02;
const COST_ESCALATION_RATE = 0.02;

const baselineAnnualKWh = 98000;
const compareAnnualKWh = 75000;
const baselineAnnualCost = 11760;
const compareAnnualCost = 9000;
const baselineMaintenanceCost = 800;
const compareMaintenanceCost = baselineMaintenanceCost * 0.85;
const compareCapexInitial = 5000;

const energySeries = Array.from(
  { length: ANALYSIS_PERIOD_YEARS },
  (_, index) => {
    const year = index + 1;
    const escalationFactor = Math.pow(1 + ENERGY_ESCALATION_RATE, index);
    return {
      year,
      baseline: Math.round(baselineAnnualKWh * escalationFactor),
      inv: Math.round(compareAnnualKWh * escalationFactor),
    };
  }
);

const lifecycleBaselineSeries = Array.from(
  { length: ANALYSIS_PERIOD_YEARS },
  (_, index) => {
    const year = index + 1;
    const escalationFactor = Math.pow(1 + COST_ESCALATION_RATE, index);
    return {
      year,
      energy: Math.round(baselineAnnualCost * escalationFactor),
      maintenance: Math.round(baselineMaintenanceCost),
      capex: 0,
    };
  }
);

const lifecycleInvSeries = Array.from(
  { length: ANALYSIS_PERIOD_YEARS },
  (_, index) => {
    const year = index + 1;
    const escalationFactor = Math.pow(1 + COST_ESCALATION_RATE, index);
    return {
      year,
      energy: Math.round(compareAnnualCost * escalationFactor),
      maintenance: Math.round(compareMaintenanceCost),
      capex: year === 1 ? compareCapexInitial : 0,
    };
  }
);

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
  analysisPeriodYears: ANALYSIS_PERIOD_YEARS,
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
  energySeries,
  lifecycleBaselineSeries,
  lifecycleInvSeries,
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
    // Texas
    '75001': { city: 'Plano', state: 'TX', climateZone: '3A' },
    '77001': { city: 'Houston', state: 'TX', climateZone: '2A' },
    '78701': { city: 'Austin', state: 'TX', climateZone: '2A' },
    '75201': { city: 'Dallas', state: 'TX', climateZone: '3A' },

    // California
    '90210': { city: 'Beverly Hills', state: 'CA', climateZone: '3B' },
    '94102': { city: 'San Francisco', state: 'CA', climateZone: '3C' },
    '92101': { city: 'San Diego', state: 'CA', climateZone: '3B' },
    '95814': { city: 'Sacramento', state: 'CA', climateZone: '3B' },

    // New York
    '10001': { city: 'New York', state: 'NY', climateZone: '4A' },
    '14201': { city: 'Buffalo', state: 'NY', climateZone: '5A' },

    // Illinois
    '60601': { city: 'Chicago', state: 'IL', climateZone: '5A' },

    // Florida
    '33101': { city: 'Miami', state: 'FL', climateZone: '1A' },
    '32801': { city: 'Orlando', state: 'FL', climateZone: '2A' },
    '33602': { city: 'Tampa', state: 'FL', climateZone: '2A' },

    // Washington
    '98101': { city: 'Seattle', state: 'WA', climateZone: '4C' },

    // Colorado
    '80202': { city: 'Denver', state: 'CO', climateZone: '5B' },

    // Arizona
    '85001': { city: 'Phoenix', state: 'AZ', climateZone: '2B' },

    // Georgia
    '30303': { city: 'Atlanta', state: 'GA', climateZone: '3A' },

    // Massachusetts
    '02101': { city: 'Boston', state: 'MA', climateZone: '5A' },

    // Pennsylvania
    '19019': { city: 'Philadelphia', state: 'PA', climateZone: '4A' },

    // Michigan
    '48201': { city: 'Detroit', state: 'MI', climateZone: '5A' },

    // Nevada
    '89101': { city: 'Las Vegas', state: 'NV', climateZone: '3B' },

    // Oregon
    '97201': { city: 'Portland', state: 'OR', climateZone: '4C' },

    // North Carolina
    '28202': { city: 'Charlotte', state: 'NC', climateZone: '3A' },

    // Minnesota
    '55401': { city: 'Minneapolis', state: 'MN', climateZone: '6A' },
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
