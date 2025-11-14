# Feature Inventory - Energy Calculator App

## Overview

Complete inventory of all features, components, API contracts, and calculation logic in the existing Next.js energy calculator application.

---

## Application Routes

### 1. Landing/Home

- **Route**: `/` and `/landing/page.tsx`
- **Component**: `LandingPage` (`components/pages/LandingPage.tsx`)
- **Purpose**: Entry point for users to start wizard
- **Key Features**:
  - Hero section with application introduction
  - ZIP code entry (optional, passed to wizard via URL param)
  - Navigation to wizard

### 2. Wizard - Project Info

- **Route**: `/wizard/project`
- **Page**: `app/wizard/project/page.tsx`
- **Component**: `ProjectInfo` (`components/wizard/ProjectInfo.tsx`)
- **Layout**: Uses `WizardLayout` with `currentStep={1}`
- **Purpose**: Collect project metadata and location information

### 3. Wizard - System Configuration

- **Route**: `/wizard/system`
- **Page**: `app/wizard/system/page.tsx`
- **Component**: `SystemSetup` (`components/wizard/SystemSetup.tsx`)
- **Layout**: Uses `WizardLayout` with `currentStep={2}`
- **Purpose**: Configure baseline and comparison HVAC systems

### 4. Wizard - Results

- **Route**: `/wizard/results`
- **Page**: `app/wizard/results/page.tsx`
- **Component**: `ResultsDashboard` (`components/wizard/ResultsDashboard.tsx`)
- **Layout**: Uses `WizardLayout` with `currentStep={3}`
- **Purpose**: Display calculation results, charts, and downloadable report

---

## State Management

### WizardContext (`contexts/WizardContext.tsx`)

**Purpose**: Global state management for wizard flow

**State Shape**:

```typescript
interface WizardFormData {
  projectName: string;
  zip: string;
  city: string;
  state: string;
  climateZone: string;
  buildingType: string;
  hoursPerYear: number | '';
  electricRate: number | '';
  gasRate: number | '';
  maintenanceCostPerYear: number | '';
  baselineSystem: {
    type: string;
    capacityTons: number | '';
    units: number | '';
    maintenanceCostPerYear: number | '';
    eer?: string;
    ieer?: string;
    cop47?: string;
    cop17?: string;
  };
  compareSystem: {
    type: string;
    capacityTons: number | '';
    units: number | '';
    maintenanceCostPerYear: number | '';
    eer?: string;
    ieer?: string;
    cop47?: string;
    cop17?: string;
  };
  rebate: {
    applyRebate: boolean;
    amount: number | '';
    source: string;
  };
}
```

**API**:

- `formData`: Current form state
- `updateFormData(data: Partial<WizardFormData>)`: Update form data
- `currentStep: number`: Current wizard step (1-3)
- `setCurrentStep(step: number)`: Update current step
- `results: Project['results'] | null`: Calculation results
- `setResults(results)`: Store calculation results
- `resetWizard()`: Reset all state to defaults

**URL Parameters**:

- `?zip=<zipcode>` - Pre-fills ZIP code from landing page

---

## Core Components

### Wizard Components

#### 1. WizardLayout (`components/wizard/WizardLayout.tsx`)

**Props**:

- `children: ReactNode`
- `currentStep: number`

**Features**:

- Header with logo
- Stepper showing wizard progress
- Main content area
- Sustainability banner
- Corporate footer

**Dependencies**:

- `Header`, `Stepper`, `SustainabilityBanner`, `CorporateFooter`

#### 2. ProjectInfo (`components/wizard/ProjectInfo.tsx`)

**Props**: None (uses `useWizard()`)

**Form Fields**:

- Project Name (optional)
- ZIP Code (required) - triggers auto-lookup
- City (read-only, auto-populated)
- State (read-only, auto-populated)
- Climate Zone (read-only, auto-populated)
- Building Type (required, dropdown)
- Annual Operating Hours (optional, with chip presets: 3500, 4000, 5000)
- Electricity Rate (required, $/kWh)
- Gas Rate (optional, $/therm)
- Maintenance Cost (optional, $/year)

**Validation**:

- ZIP code must be valid (lookup succeeds)
- Building type must be selected
- Electricity rate must be > 0

**Navigation**:

- Next → `/wizard/system`

#### 3. SystemSetup (`components/wizard/SystemSetup.tsx`)

**Props**:

- `onCalculate?: (results) => void` (optional)
- `defaultBaselineAdvancedOpen?: boolean`
- `defaultCompareAdvancedOpen?: boolean`

**Features**:

- Side-by-side system cards (baseline vs. Daikin inverter)
- Collapsible "Advanced Settings" sections
- Rebate toggle and amount input
- Form validation
- Async calculation with loading state

**Form Fields (Baseline System)**:

- System Type (dropdown)
- Capacity (tons, dropdown)
- Units (number input)
- Maintenance Cost ($/year)
- Advanced: EER, IEER, COP @47°F, COP @17°F

**Form Fields (Daikin System)**:

- System Type (read-only, "INV HP")
- Capacity (read-only, matches baseline)
- Units (editable)
- Maintenance Cost ($/year)
- Advanced: EER, IEER, COP @47°F, COP @17°F

**Validation**:

- Baseline capacity is required
- Baseline units must be ≥ 1
- COP values must be numeric and > 0 (if provided)

**Navigation**:

- Back → `/wizard/project`
- Calculate → Triggers `calculateSavings()` → `/wizard/results`

#### 4. ResultsDashboard (`components/wizard/ResultsDashboard.tsx`)

**Props**:

- `project: Project`
- `results: Project['results']`

**Features**:

- 4 KPI cards with animated count-up:
  - Annual Energy Savings (%, $/yr)
  - Payback Period (years)
  - Lifecycle Cost Savings ($)
  - CO₂ Reduction (tons/year)
- Energy trend line chart
- Lifecycle cost area chart (stacked)
- Detailed results table
- System assumptions cards
- Download Report (PDF) modal
- Start New Analysis button

### Shared Components

#### Form Components

1. **FormField** (`components/shared/FormField.tsx`)

   - Label, description, error handling
   - Accessibility features

2. **NumberInput** (`components/shared/NumberInput.tsx`)

   - Styled number input with validation
   - Min, max, step support

3. **Select** (`components/shared/Select.tsx`)

   - Dropdown with options
   - Uses Radix UI

4. **Input** (`components/ui/input.tsx`)
   - Basic text input

#### UI Components

1. **PrimaryButton** (`components/shared/PrimaryButton.tsx`)

   - Main action button with hover/focus states

2. **SecondaryButton** (`components/shared/SecondaryButton.tsx`)

   - Secondary action button

3. **Card** (`components/shared/Card.tsx`)

   - White card container with title, description
   - Props: `title?: string`, `description?: string`, `className?: string`

4. **Stepper** (`components/shared/Stepper.tsx`)

   - Horizontal progress indicator
   - Props: `steps: string[]`, `currentStep: number`

5. **Header** (`components/shared/Header.tsx`)

   - App header with logo and navigation

6. **InfoTooltip** (`components/shared/InfoTooltip.tsx`)
   - Tooltip for contextual help
   - Props: `id: string`, `content: string`

#### Chart Components

1. **EnergyLineChart** (`components/charts/EnergyLineChart.tsx`)

   - **Props**:
     - `data: Array<{year, baseline, inv}>`
     - `metricLabel: string`
     - `unit: string`
     - `className?: string`
   - Uses Recharts LineChart
   - Toggle series visibility
   - Tooltip with delta calculation

2. **LifecycleAreaChart** (`components/charts/LifecycleAreaChart.tsx`)
   - **Props**:
     - `baselineData: Array<{year, energy, maintenance, capex}>`
     - `invData: Array<{year, energy, maintenance, capex}>`
     - `unit: string`
     - `className?: string`
   - Stacked area charts (2 panels)
   - Shows energy, maintenance, capex breakdown

---

## Data Models & Contracts

### Project Interface (`lib/mockData.ts`)

```typescript
interface Project {
  project: { name: string };
  zip: string;
  location: { city: string; state: string; climateZone: string };
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
  rebate: { source: string; amount: number };
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
```

### API Functions

#### 1. `lookupZip(zip: string): ZipLookupResult | null`

**File**: `lib/mockData.ts`

**Input**: ZIP code string

**Output**:

```typescript
{
  city: string;
  state: string;
  climateZone: string;
} | null
```

**Purpose**: Mock ZIP code lookup (returns location data or null)

**Usage**: Called when ZIP field loses focus in ProjectInfo

#### 2. `calculateSavings(projectData: Partial<Project>): Promise<Project['results']>`

**File**: `lib/mockData.ts`

**Input**: Partial project data

**Output**: Promise resolving to results object

**Purpose**: Mock calculation API (simulates 2-second delay, returns mock results)

**Usage**: Called when "Calculate Savings" button clicked in SystemSetup

---

## Chart Utilities

### File: `components/charts/chartUtils.ts`

**Functions**:

- `calculateDelta(baseline: number, compare: number)`: Returns `{delta, deltaPct}`
- `formatCompactValue(value: number)`: Formats large numbers (k, M notation)
- `formatValueWithUnit(value: number, unit: string)`: Formats with unit
- `formatPercentage(value: number)`: Formats as percentage

---

## Critical Calculation Logic

### Results Calculation Flow

1. User completes Project Info → data saved to `WizardContext`
2. User completes System Setup → clicks "Calculate Savings"
3. `calculateSavings()` called with form data
4. Results stored in `WizardContext.results`
5. User navigated to Results page
6. Results page reads from context and displays

### Key Constants (`lib/mockData.ts`):

- `ANALYSIS_PERIOD_YEARS = 15`
- `ENERGY_ESCALATION_RATE = 0.02`
- `COST_ESCALATION_RATE = 0.02`

### Calculations:

- Energy series: escalates by 2% annually
- Lifecycle costs: includes energy, maintenance, capex
- CO₂: calculated from kWh savings using EPA factor

---

## Migration Risks

### High Risk Areas

1. **Chart CSS & SVG Rendering**

   - Charts use Recharts library with specific colors and styling
   - Tooltips have custom components with specific CSS classes
   - **Risk**: Changing global CSS could affect chart rendering
   - **Mitigation**: Test chart components thoroughly; use scoped styles

2. **Form Validation Logic**

   - Complex validation in ProjectInfo and SystemSetup
   - COP value validation with special handling for empty/numeric values
   - **Risk**: CSS changes to error states could break visual feedback
   - **Mitigation**: Preserve error class names; test validation states

3. **Animated Count-Up Numbers**

   - Results page uses `requestAnimationFrame` for number animations
   - **Risk**: CSS transitions could conflict
   - **Mitigation**: Keep animation logic unchanged; only update colors

4. **Collapsible Sections**

   - Advanced settings use controlled state with chevron icons
   - **Risk**: Icon sizes and padding changes could affect layout
   - **Mitigation**: Preserve collapsible functionality; only update styles

5. **Stepper Component**
   - Critical for wizard navigation and progress indication
   - Uses specific class names for active/completed states
   - **Risk**: Complete redesign could break step tracking logic
   - **Mitigation**: Preserve step state logic; only update visual appearance

### Medium Risk Areas

1. **Button Disabled States**

   - Forms use disabled states based on validation
   - **Risk**: Disabled button styles must remain visually distinct
   - **Mitigation**: Maintain disabled state opacity/cursor changes

2. **Read-Only Inputs**

   - City, State, Climate Zone are read-only with special styling
   - Daikin system capacity is read-only
   - **Risk**: Styling must indicate non-editable state
   - **Mitigation**: Use distinct background color for read-only fields

3. **Chip/Preset Buttons**
   - Hour presets use active/inactive visual states
   - **Risk**: Selected state must be clearly visible
   - **Mitigation**: Maintain distinct selected/unselected states

### Low Risk Areas

1. **Footer Components**

   - Static content, minimal interaction
   - Can be restyled freely

2. **Hero/Landing Page**
   - Separate from wizard flow
   - Can be completely redesigned

---

## Testing Checklist

### Functional Testing (Must Pass After Redesign)

- [ ] ZIP code lookup populates city, state, climate zone
- [ ] Form validation prevents progression with incomplete data
- [ ] Hour presets correctly update hoursPerYear field
- [ ] System capacity syncs from baseline to compare system
- [ ] Advanced settings collapse/expand correctly
- [ ] Rebate toggle shows/hides amount input
- [ ] Calculate button triggers 2-second loading state
- [ ] Results page displays all KPI values correctly
- [ ] Charts render with correct data
- [ ] Series toggle in line chart works
- [ ] Table shows accurate delta values
- [ ] "Start New Analysis" resets wizard
- [ ] "Download Report" opens modal
- [ ] Back/Next navigation preserves form data
- [ ] URL parameter ?zip=XXXXX pre-fills ZIP field

### Visual Regression Testing

- [ ] Button hover states work
- [ ] Focus rings visible on all interactive elements
- [ ] Error messages display correctly
- [ ] Tooltip positioning correct
- [ ] Cards have consistent shadows
- [ ] Responsive breakpoints work (mobile, tablet, desktop)
- [ ] Charts are legible on all screen sizes
- [ ] Stepper adapts to mobile layout

---

## Dependencies

### External Libraries

- **Next.js 14**: App router, routing
- **React 18**: UI framework
- **Recharts 2**: Chart rendering
- **Radix UI**: Accessible UI primitives (checkbox, dialog, select, label)
- **Tailwind CSS 3**: Utility-first styling
- **Lucide React**: Icon library
- **class-variance-authority**: Button variants
- **clsx & tailwind-merge**: Class name utilities

### Custom Utilities

- `lib/utils.ts`: `cn()` function for class name merging

---

## Summary

This inventory documents **all** user-facing features, internal components, state management, and calculation logic. During the redesign:

1. **Preserve all functional logic** - validation, navigation, calculations
2. **Update only visual styling** - colors, typography, spacing, shadows
3. **Maintain component interfaces** - props, state contracts
4. **Test thoroughly** - especially forms, charts, and wizard flow
5. **Keep accessibility features** - ARIA labels, keyboard navigation

The application follows a clear separation between:

- **Data/logic layer**: WizardContext, mockData calculations
- **UI layer**: Components, styling
- **Chart layer**: Recharts configuration

This separation allows visual redesign without breaking business logic.
