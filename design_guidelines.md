# FinGenius AI Super App - Design Guidelines

## Design Approach: Professional Finance Dashboard System

**Selected Approach**: Design System - Modern Financial Dashboard
**Justification**: Finance applications require clarity, trust, and data-driven design over visual flair. Users need to quickly comprehend complex financial information, track transactions, and make informed decisions. A systematic, professional approach ensures consistency across multiple features while maintaining credibility.

**Core Design Principles**:
1. **Data Clarity First**: Every visual element serves to make financial data more understandable
2. **Trust Through Professionalism**: Clean, polished interface that conveys security and reliability
3. **Efficient Workflows**: Minimize steps for common tasks like expense entry, receipt scanning
4. **Bilingual Excellence**: Seamless Tamil/English switching without layout disruption

---

## Core Design Elements

### A. Color Palette

**Primary Colors (Trust & Stability)**:
- Primary Brand: 220 75% 50% (Deep Blue - conveys trust, finance professionalism)
- Primary Dark Mode: 220 70% 55%

**Accent Colors (Strategic Highlights)**:
- Success/Positive: 142 76% 45% (Green for profits, savings achievements)
- Warning: 38 92% 50% (Amber for budget alerts, pending bills)
- Danger: 0 84% 60% (Red for expenses, debt, overbudget warnings)

**Neutral Foundation**:
- Light Mode: 
  - Background: 0 0% 98%
  - Surface: 0 0% 100%
  - Border: 220 13% 91%
  - Text Primary: 220 15% 15%
  - Text Secondary: 220 10% 45%

- Dark Mode:
  - Background: 220 20% 8%
  - Surface: 220 18% 12%
  - Border: 220 15% 20%
  - Text Primary: 0 0% 98%
  - Text Secondary: 220 10% 70%

**Data Visualization Palette**:
- Chart Colors: 200 85% 55%, 280 75% 60%, 160 70% 50%, 30 85% 55%, 340 75% 60%
- Income: 142 76% 45%
- Expense: 0 84% 60%

### B. Typography

**Font Families**:
- Primary: 'Inter' (Google Fonts) - exceptional readability for data/numbers
- Tamil Support: 'Noto Sans Tamil' (Google Fonts) - seamless bilingual switching
- Monospace (for currency/numbers): 'JetBrains Mono' - precise number alignment

**Type Scale**:
- Display (Dashboard Headers): text-4xl md:text-5xl font-bold
- Heading 1 (Page Titles): text-3xl font-semibold
- Heading 2 (Section Headers): text-2xl font-semibold
- Heading 3 (Card Titles): text-xl font-medium
- Body Large (Primary Content): text-base font-normal
- Body (Default): text-sm font-normal
- Caption (Metadata): text-xs font-normal
- Numbers/Currency: font-mono font-semibold (always use tabular nums)

### C. Layout System

**Spacing Primitives**: Consistently use Tailwind units of **2, 4, 6, 8, 12, 16** for all spacing
- Component padding: p-4, p-6, p-8
- Section margins: mt-8, mb-12, gap-6
- Card spacing: space-y-4, gap-4
- Micro spacing: space-x-2, gap-2

**Grid System**:
- Dashboard: 12-column responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
- Content width: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Sidebar: Fixed 280px on desktop, collapsible on mobile

**Dashboard Layout Structure**:
- Top Navigation: Fixed height 64px with logo, search, notifications, profile
- Sidebar: 280px width (desktop), slide-over drawer (mobile)
- Main Content: Fluid with max-width constraints
- Cards: Consistent rounded-xl with subtle shadows

### D. Component Library

**Navigation Components**:
- Top Bar: Glass-morphism effect with backdrop-blur, sticky positioning
- Sidebar: Vertical navigation with icons + labels, collapsible groups for sub-features
- Breadcrumbs: For deep navigation paths (Home > Expenses > January 2025)
- Tab Navigation: For switching between related views (Overview / Transactions / Analytics)

**Data Display Components**:
- **Dashboard Cards**: 
  - White/dark surface with rounded-xl borders
  - Header with icon + title + optional action button
  - Large metric numbers with trend indicators (↑ ↓ arrows with colors)
  - Sparkline charts for quick trends
  
- **Transaction Lists**:
  - Row-based with merchant icon/category, amount (right-aligned), date
  - Alternating row hover states
  - Swipe actions on mobile (delete, edit)
  
- **Charts & Graphs**:
  - Donut charts for expense categories
  - Line/Area charts for income/expense trends
  - Bar charts for monthly comparisons
  - Consistent legend positioning and color coding

**Form Components**:
- Input Fields: Consistent height (h-10), rounded-lg, clear focus states
- Currency Inputs: Prefix with ₹ symbol, right-aligned numbers
- Date Pickers: Calendar dropdown with range selection
- Category Selectors: Icon + label dropdowns
- Receipt Upload: Drag-drop zone with preview

**Feedback Components**:
- Toast Notifications: Top-right positioning, auto-dismiss with progress bar
- Alert Banners: Bill reminders, budget warnings (dismissible)
- Empty States: Friendly illustrations with clear CTAs
- Loading States: Skeleton screens for cards, shimmer effects for lists

**Action Components**:
- Primary Buttons: Filled bg-primary with white text, h-10 rounded-lg
- Secondary Buttons: Outline variant with primary border
- Floating Action Button: Bottom-right for quick expense entry
- Icon Buttons: For compact actions (edit, delete, share)

**Special Components**:
- AI Insights Panel: Distinct styling with gradient border, sparkle icon
- Receipt Scanner: Camera interface with capture guides
- Budget Progress Rings: Circular progress with percentage inside
- Bill Reminder Cards: Calendar icon with due date countdown

### E. Interactions & Animations

**Micro-interactions** (Use sparingly):
- Button hover: subtle scale transform (scale-[1.02])
- Card hover: shadow elevation increase
- Number counting: animate value changes for metrics
- Success states: green checkmark fade-in for completed actions

**NO complex page transitions** - keep instant, snappy navigation

---

## Images

**Dashboard Hero/Header** (Not a traditional hero):
- NO large hero image - dashboard starts immediately with key metrics
- Small avatar/profile image in top-right (48x48px circular)
- Category icons throughout (use Heroicons - 24x24px)

**Illustrations**:
- Empty states: Use undraw.co style illustrations (SVG, 200x200px)
- AI agent avatar: Simple gradient orb or geometric shape (64x64px)
- Onboarding: Step-by-step illustrations for feature walkthroughs

**No decorative imagery** - all visuals serve functional purposes for clarity and recognition.