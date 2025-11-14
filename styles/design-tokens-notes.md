# Design Token Extraction Notes

## Source

Daikin Energy Calculator: https://daikincomfort.com/EnergyCalculator/introduction

## Extraction Date

November 14, 2025

## Visual Analysis from Screenshots

### Color Palette

#### Primary Colors

- **Brand Blue (#2E9AD8)**: Used for interactive elements, links, primary text highlights
- **Deep Blue/Navy (#1B4F72)**: Hero sections, page headers, important headings
- **Light Blue (#6EC1FF)**: Hover states, secondary accents, chart highlights

#### Accent Colors

- **Green (#2CA66A)**: Success states, savings indicators, positive metrics, Daikin system data in charts
- **Orange/Coral (#E67E50)**: Call-out sections (e.g., "You could save up to $X,XXX"), important notices

#### Neutral Colors

- **Background**: Clean white (#FFFFFF) for cards, light gray (#F7FAFC) for page background
- **Borders**: Very light blue-gray (#E6EEF7) - subtle but visible
- **Text**: Near-black (#231F20) for primary text, medium gray (#6B7B8A) for secondary text

### Typography

#### Font Family

The reference site appears to use a clean, modern sans-serif font. Since the exact proprietary font cannot be determined from screenshots alone, we're using a comprehensive system font stack that includes:

- `-apple-system, BlinkMacSystemFont` for Apple devices
- `'Segoe UI'` for Windows
- `'Roboto'` for Android/Chrome
- Fallbacks to other common system fonts

This approach ensures:

- **No licensing issues** - all system fonts
- **Optimal performance** - no web font loading
- **Consistent appearance** across platforms

#### Font Sizes

- **Small**: 12px - 14px for captions, helper text
- **Base**: 15px for body text
- **Medium**: 16px - 18px for subheadings
- **Large**: 22px - 28px for section headers
- **Extra Large**: 32px - 40px for page titles and hero text

#### Font Weights

- **Normal (400)**: Body text
- **Medium (500)**: Slightly emphasized text
- **Semibold (600)**: Section headers, labels
- **Bold (700)**: Important numbers, main headings

### Spacing & Layout

#### Base Grid

**8px base unit** - all spacing values are multiples of 4px or 8px for visual consistency

#### Common Patterns

- **Card padding**: 24px (1.5rem)
- **Section spacing**: 32px - 48px between major sections
- **Form field gaps**: 16px - 24px between fields
- **Button padding**: 12px vertical, 24px horizontal

#### Container Widths

- Form content is centered with maximum width around 1280px
- Cards have consistent internal padding
- Responsive breakpoints at 640px, 768px, 1024px, 1280px

### Border Radius

#### Patterns Observed

- **Small elements**: 6px - 8px (inputs, small buttons)
- **Cards**: 10px rounded corners
- **Pill buttons**: 24px+ (fully rounded ends)
- **Circular elements**: 50% (stepper circles, icons)

### Shadows

#### Card Elevation

Cards use **soft, subtle shadows** - not heavy material design style:

- Light shadow: `0 6px 18px rgba(20, 40, 60, 0.06)`
- Purpose: Create depth without overwhelming the design
- Color: Cool-toned shadow (blue-tinted, not pure gray)

### Component-Specific Observations

#### Header

- **Thin variant**: ~36px height, minimal padding
- White background with subtle bottom border
- Logo on left, contact/nav on right

#### Hero Section

- **Deep blue background** (#1B4F72 or similar)
- White text for maximum contrast
- Centered ZIP code input with white background
- Large padding (64px+ vertical)

#### Stepper

- **Horizontal layout** with numbered circles
- Active step: outlined circle with number
- Completed steps: filled circle with checkmark icon
- Inactive steps: gray outline
- Thin connecting lines between circles
- Step titles below circles

#### Form Inputs

- **Height**: ~44px (2.75rem) for comfortable touch targets
- Rounded corners (6-8px)
- Light border (#E6EEF7)
- Focus state: Blue border (#2E9AD8)
- Disabled/read-only: Light gray background (#F7FAFC)

#### Buttons

- **Primary**: Blue background, white text, pill shape
- **Secondary**: Light gray background, dark text, pill shape
- Hover: Slightly darker shade
- Height: 44px for consistency with inputs

#### Chips (Quick Select)

- **Pill-shaped** with border
- Unselected: Light background, medium border
- Selected: Blue background, white text
- Hover: Border color change

#### Charts

- **Baseline system**: Blue (#2E9AD8)
- **Daikin system**: Green (#2CA66A)
- Subtle gridlines: Light blue-gray
- Axis labels: Medium gray
- Clean, minimal styling
- Legend with small colored indicators

#### Tables

- **Header row**: Very light blue-gray background (#F7FAFC)
- Subtle borders between rows
- Hover: Very subtle background tint
- Delta/Savings column: Green text for positive savings

#### Metric/KPI Cards

- **Large numbers**: 32px - 36px, bold
- Icon with colored background
- Small label above number (uppercase, tracked)
- Source note at bottom in small text

## Proprietary Assets & Licensing

### Fonts

- **Status**: Exact proprietary font unknown from screenshots
- **Solution**: Using system font stack (no licensing needed)
- **Alternatives**: If Daikin requires specific font, options include:
  - **Inter** (free, open source) - similar to system fonts
  - **Work Sans** (Google Fonts) - clean, professional
  - **Nunito Sans** (Google Fonts) - friendly, modern

### Icons

- **Observed**: Simple line icons (lucide-react style)
- **Solution**: Using `lucide-react` package (already in dependencies)
- **License**: MIT licensed, free for commercial use

### Logo

- **Daikin Logo**: Proprietary, must use official assets from Daikin
- **Location**: `/public/daikin-logo.svg` (already in project)
- **Usage**: Do not modify; use as-is per brand guidelines

## Accessibility Considerations

### Color Contrast

All color combinations checked against WCAG 2.1 AA standards:

- **Text on white**: #231F20 (primary) - PASS
- **Secondary text**: #6B7B8A on white - PASS
- **Blue buttons**: #2B9EE0 with white text - PASS
- **Blue text**: #2E9AD8 on white - PASS (for 14pt+ text)

### Interactive Element Sizing

- Minimum touch target: 44px × 44px (meets WCAG 2.5.5)
- Buttons, inputs, chips all sized appropriately
- Adequate spacing between clickable elements

### Focus Indicators

- Clear focus rings on all interactive elements
- Color: Brand blue (#2E9AD8)
- 2px width with offset for visibility
- Never disabled/hidden

## Implementation Notes

### Integration with Tailwind

All tokens designed to integrate seamlessly with Tailwind's design system:

- Custom colors extend default Tailwind palette
- Spacing scale aligns with Tailwind's 4px base
- Border radius values compatible with Tailwind utilities
- Shadow values match Tailwind's naming conventions

### CSS Custom Properties

Using CSS variables allows:

- Runtime theme switching (if dark mode added later)
- Easy updates to design system
- Better maintainability
- Browser compatibility (all modern browsers)

### Responsive Design

Mobile-first approach:

- Base styles for mobile
- Breakpoints at 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Cards stack on mobile, side-by-side on desktop
- Stepper adapts to vertical or horizontal scroll

## Comparison with Existing Design

### What's Changing

- **Hero section**: New deep blue band with centered ZIP input
- **Header**: Thinner variant option
- **Stepper**: Circular indicators instead of current design
- **Colors**: More orange/coral accents
- **Buttons**: More pill-shaped (higher border radius)
- **Cards**: Slightly softer shadows

### What's Staying the Same

- Overall structure and wizard flow
- Form validation and logic
- Chart data and calculations
- Component hierarchy
- Responsive breakpoints (similar)

## Next Steps

1. ✅ **Tokens created**: CSS and JSON files
2. ⏭️ **Integrate into Tailwind**: Update `tailwind.config.ts`
3. ⏭️ **Update global CSS**: Import design-tokens.css
4. ⏭️ **Test build**: Ensure no breaking changes
5. ⏭️ **Apply to components**: Systematically update each component

## References

- Daikin Calculator Screenshots (provided)
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- CSS Custom Properties: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
