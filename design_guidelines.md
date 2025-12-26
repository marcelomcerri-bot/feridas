# WoundVision - Design Guidelines

## Design Approach

**Selected Approach:** Healthcare Design System with Material Design influences
**Rationale:** Medical applications require trust, clarity, and efficiency. Drawing from modern healthcare dashboards (Epic Haiku, Cerner) and Material Design's strong information hierarchy principles.

**Core Principles:**
- Clinical credibility through professional, structured layouts
- Data clarity over visual flourish
- Scannable information architecture
- Trust-building through consistent, predictable patterns

## Typography System

**Font Family:** Inter (Google Fonts) for UI, Roboto Mono for clinical data/measurements

**Hierarchy:**
- Page Headers: 2.5rem (40px), font-weight 700
- Section Titles: 1.75rem (28px), font-weight 600
- Subsections: 1.25rem (20px), font-weight 600
- Body Text: 1rem (16px), font-weight 400
- Clinical Data Labels: 0.875rem (14px), font-weight 500, uppercase, letter-spacing 0.05em
- Measurements/Values: 1.125rem (18px), Roboto Mono, font-weight 500

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Tight spacing (cards, internal): p-4, gap-2
- Standard sections: p-8, gap-6
- Major sections: py-12, gap-8

**Grid Structure:**
- Main container: max-w-7xl, mx-auto, px-4
- Two-column analysis view: grid-cols-1 lg:grid-cols-3 (1/3 for controls, 2/3 for results)
- Comparison mode: grid-cols-1 lg:grid-cols-2 (equal split)

## Component Library

### Navigation Header
- Fixed top bar with logo, app name, and utility navigation
- Height: h-16
- Includes: Upload button (primary action), History icon, Settings icon

### Upload Zone
**Primary Upload Card:**
- Dashed border with prominent drag-drop area
- Min-height: min-h-96
- Icon: Upload cloud icon (Heroicons)
- Supporting text: "Drag wound image or click to browse" with accepted formats below
- Includes camera icon option for direct capture on mobile

**Comparison Upload:**
- Two side-by-side upload zones
- Labels: "Before Image" / "After Image" or "Previous" / "Current"
- Same styling as primary, scaled down: min-h-64

### Analysis Results Panel

**Report Card Structure:**
- White card with subtle border
- Sections with clear dividers (border-t)
- Spacing: p-6, gap-6

**Key Sections:**
1. **Wound Classification Badge**
   - Large badge/pill at top showing wound type
   - Font: 1.125rem, font-weight 600
   
2. **Clinical Characteristics Grid**
   - 2-column grid on desktop, single on mobile
   - Each item: Label (small, uppercase) + Value (larger, medium weight)
   - Items: Tissue Type, Exudate Level, Border Condition, Depth Estimate, Odor Assessment

3. **Risk Assessment**
   - Prominent card with infection risk indicator
   - Visual scale: Low/Medium/High with corresponding visual weight
   - Border accent to indicate severity level

4. **Nursing Recommendations**
   - Ordered list with numbered items
   - Each recommendation in its own subtle card (bg-gray-50 equivalent)
   - Icon for each recommendation type (bandage, clean, monitor, etc.)

### Comparison Dashboard

**Side-by-Side Image Display:**
- Equal-width columns with synchronized zoom/pan
- Image labels with timestamp
- Measurement overlays option (toggle)

**Evolution Metrics:**
- Horizontal stat cards showing changes
- Icons: arrow-up/arrow-down for improvements/deterioration
- Metrics: Size reduction %, Tissue improvement, Exudate change, Healing stage progression

**Progress Chart:**
- Line chart (Chart.js) showing healing trajectory
- X-axis: Timeline, Y-axis: Healing score/stage
- Data points with hover tooltips

### Action Buttons
- Primary: Upload/Analyze - Large, prominent (px-8, py-3)
- Secondary: Compare Images, Download Report - Medium (px-6, py-2.5)
- Tertiary: Clear, New Analysis - Small, text-only

### Report Generation View
**Clinical Report Format:**
- White background with print-friendly layout
- Header: Patient ID field, Date/Time, Clinician name field
- Body: Structured sections matching analysis output
- Footer: Disclaimer text (small, muted)
- Download/Print buttons (fixed bottom bar on mobile)

## Images

**Hero Section:** No traditional hero image
**Analysis Section:** Wound images are the primary visual content - displayed in bordered containers with medical-appropriate presentation

**Icon Library:** Heroicons (outlined style for navigation, solid for emphasis points)

**Supporting Graphics:**
- Anatomical reference icons for wound location (simple line drawings)
- Status indicators (shield for risk, bandage for recommendations)
- Comparison arrows and delta indicators

## Accessibility

- All medical images with descriptive alt text
- Keyboard navigation through entire workflow
- Clear focus indicators (ring-2 offset-2)
- Form labels properly associated
- ARIA labels for icon-only buttons
- Minimum touch target: 44x44px
- High contrast for all clinical data
- Screen reader announcements for analysis completion

## Layout Philosophy

**Multi-Page Structure:**
1. **Main Analysis Page:** Upload → Analyze → Results (vertical flow)
2. **Comparison Tool:** Separate view with side-by-side layout
3. **Report Archive:** Table/grid view of past analyses

**Single Page Flow Priority:**
- Above fold: Upload zone + Quick actions
- Middle: Analysis results (appears after processing)
- Below: Historical comparisons/saved reports (collapsed by default)

**No Full-Height Constraints:** Content flows naturally based on analysis depth. Results panel expands to accommodate full clinical report without scroll-within-scroll patterns.