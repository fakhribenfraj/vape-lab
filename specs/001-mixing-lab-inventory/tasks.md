# Tasks: 001-mixing-lab-inventory

**Feature**: VapeLab.io Mixing Lab Inventory  
**Branch**: `001-mixing-lab-inventory`  
**Tech Stack**: Next.js 16, TypeScript, Prisma ORM, Neon, shadcn/ui, TanStack Query, better-auth

---

## Phase 1: Setup

**Goal**: Initialize project with all dependencies and configuration

- [x] T001 Create Next.js 16 project with TypeScript: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- [x] T002 Install dependencies: `pnpm add prisma @prisma/client @tanstack/react-query react-hook-form zod @hookform/resolvers better-auth`
- [x] T003 Install dev dependencies: `pnpm add -D prisma @types/node eslint-config-prettier prettier`
- [x] T004 Initialize Prisma: `pnpm prisma init`
- [x] T005 Configure prisma/schema.prisma with PostgreSQL datasource and all entity models from data-model.md
- [x] T006 Generate Prisma client: `pnpm prisma generate`
- [x] T007 Create .env.example with DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, NEXT_PUBLIC_APP_URL
- [x] T008 Set up lib/db/client.ts for Prisma singleton pattern
- [x] T009 Set up lib/db/index.ts for database utilities
- [x] T010 Install shadcn/ui: `pnpm dlx shadcn@latest init` and add required components (button, input, form, card, table, dialog, toast, badge, select)
- [x] T011 Configure TanStack Query provider in app/providers.tsx

---

## Phase 2: Foundational

**Goal**: Core infrastructure required for all user stories

- [x] T012 [P] Configure better-auth in lib/auth/config.ts with username/password provider and RBAC
- [x] T013 [P] Create auth API routes in app/api/auth/[...all]/route.ts
- [x] T014 [P] Set up authentication hooks in hooks/use-auth.ts
- [x] T015 Create session middleware in proxy.ts for protected routes
- [x] T016 [P] Create auth layout in app/(auth)/layout.tsx with login/register pages
- [x] T017 Create dashboard layout in app/(dashboard)/layout.tsx with sidebar navigation
- [x] T018 Build global UI components: loading spinner, error boundary, empty state
- [x] T019 Create Zod validation schemas in lib/validation/index.ts for common types
- [x] T020 [P] Add base styles in globals.css for mobile-first responsive design

---

## Phase 2.2: Layout Implementation

**Goal**: Implement all page layouts, navigation, and responsive design per NL-001-NL-074

### Navigation Structure

- [ ] T031 [P] Create sidebar layout component in components/layout/sidebar.tsx with navigation links per NL-001
- [ ] T032 [P] Implement collapsible sidebar sections in components/layout/sidebar.tsx with grouping per NL-002
- [ ] T033 [P] Add sidebar collapsed/expanded state management with icon-only mode (60px→240px) per NL-003
- [ ] T034 [P] Implement active route highlighting with Electric Mint accent and left border per NL-004
- [ ] T035 [P] Add mobile hamburger menu functionality in components/layout/header.tsx per NL-005
- [ ] T036 [P] Implement keyboard navigation for sidebar with Tab/Enter/Arrow keys per NL-006
- [ ] T037 [P] Add Ctrl/Cmd+K quick navigation palette in components/navigation/quick-nav.tsx per NL-006
- [ ] T038 Create breadcrumb component in components/navigation/breadcrumbs.tsx per NL-073

### Dashboard Layout

- [ ] T039 [P] Create dashboard page layout in app/(dashboard)/page.tsx with metrics row per NL-007, NL-008
- [ ] T040 [P] Build metrics cards with glassmorphism and Electric Mint accents in components/dashboard/metrics-row.tsx per NL-008
- [ ] T041 [P] Create analytics widgets grid: sales trends line chart, top products bar chart, inventory donut, steeping timers per NL-009
- [ ] T042 [P] Implement responsive grid layout for dashboard (1 col mobile, 2 tablet, 3-4 desktop) per NL-010
- [ ] T043 [P] Add TanStack Query auto-refresh every 30s with manual refresh button per NL-011
- [ ] T044 Create empty state dashboard with "Create Your First Recipe" and "Set Up Your Inventory" actions per NL-012

### Action Buttons

- [ ] T045 [P] Create primary action button component with Electric Mint (#00FFC2) style per NL-013, NL-014
- [ ] T046 Add "New Sale" button to dashboard layout (top right) and sales page per NL-013
- [ ] T047 Implement "New Sale" navigation to `/sales` with empty form per NL-015
- [ ] T048 Add role-based permission check for action button enable/disable per NL-016
- [ ] T049 Add ARIA label and Laboratory Amber focus indicator to action button per NL-017

### Transactions Page Layout

- [ ] T050 [P] Build transactions list page in app/(dashboard)/transactions/page.tsx per NL-018
- [ ] T051 [P] Create transaction row component with type color coding (Mint sales, Amber purchases) per NL-019, NL-021
- [ ] T052 [P] Implement filter bar: date range, type, status, search per NL-020
- [ ] T053 Add pagination (20 items/page) with total count navigation per NL-022
- [ ] T054 Create transaction detail page routing: `/sales/[id]` and `/purchases/[id]` per NL-023
- [ ] T055 Add transactions summary bar (total count, sales, purchases, net revenue) per NL-024

### Inventory Page Layout

- [ ] T056 [P] Build inventory list page in app/(dashboard)/inventory/page.tsx with responsive table per NL-025
- [ ] T057 [P] Create inventory table columns: Material Name, Type, Stock (ml), Unit, Threshold, Status, Actions per NL-025
- [ ] T058 [P] Implement status badges with color coding (Green/Amber/Red) per NL-026
- [ ] T059 Add inventory filter controls: Type dropdown, Status dropdown, search per NL-027
- [ ] T060 Create inventory action buttons: Receive, Adjust, History (show on hover) per NL-028
- [ ] T061 Add low-stock visual emphasis: row tint + warning icon per NL-029
- [ ] T062 Build inventory history page in app/(dashboard)/inventory/[id]/history/page.tsx

### Products Page Layout

- [ ] T063 [P] Build products card grid page in app/(dashboard)/products/page.tsx (2-4 cols responsive) per NL-030
- [ ] T064 [P] Create product card component with glassmorphism, image placeholder, hover effects per NL-031
- [ ] T065 Add product card content: Name, SKU, Price, Cost, Margin %, Batch Source link per NL-030
- [ ] T066 Create product toolbar: search, sort (Name/Price/Margin/Date), flavor profile filter per NL-032
- [ ] T067 Implement margin color coding (>60% green, 40-60% amber, <40% red) per NL-033
- [ ] T068 Build product detail page at `/products/[id]` with recipe source, batch history, sales history per NL-034

### Clients Page Layout

- [ ] T069 [P] Build clients table page in app/(dashboard)/customers/page.tsx per NL-035
- [ ] T070 [P] Create client table columns: Name, Email, Phone, Points, Visits, Last Purchase, Actions per NL-035
- [ ] T071 Add loyalty points badge with Electric Mint color and tooltip per NL-036
- [ ] T072 Implement client filters: name/email search, tier filter (None/Bronze/Silver/Gold), date range per NL-037
- [ ] T073 Create client action buttons: View, Edit, Adjust Points (with permission check) per NL-038
- [ ] T074 Build customer detail page at `/customers/[id]` with two-column layout per NL-039
- [ ] T075 Add "Add Loyalty Adjustment" button with form in customer detail page per NL-040

### Profile Page Layout

- [ ] T076 [P] Build profile form page in app/(dashboard)/profile/page.tsx with sections per NL-041
- [ ] T077 Add Account Information, Password Change, Preferences form sections per NL-041
- [ ] T078 Display user role and store affiliation prominently in header per NL-042
- [ ] T079 Use shadcn/ui Input components with labels, helper text, validation per NL-043
- [ ] T080 Implement responsive form layout: single column mobile/tablet, two-column desktop per NL-044
- [ ] T081 Add success toast notification on profile save per NL-045
- [ ] T082 Create "Active Sessions" section with device/location/revoke option per NL-046

### Visual Hierarchy & Consistency

- [ ] T083 Define primary/secondary button styles in components/button.tsx per NL-047
- [ ] T084 Configure typography scale: headings 28/24/20px with Inter font per NL-048
- [ ] T085 Implement glassmorphism card surface: Dark Obsidian with 60% opacity, 10% border, 8px blur per NL-049
- [ ] T086 Define spacing scale padding (24px between sections, 16px between fields) per NL-050
- [ ] T087 Create status color theme utilities: Mint=success, Amber=warning, Red=error, Slate=neutral per NL-051

### Responsive & Adaptive Design

- [ ] T088 Define breakpoints in tailwind.config.js: Mobile<640px, Tablet 640-1024px, Desktop>1024px per NL-052
- [ ] T089 Set max-width constraints: 1200px desktop, 100% tablet/mobile with 16px margins per NL-053
- [ ] T090 Implement sidebar auto-collapse to icon-only on tablet portrait (768px) per NL-054
- [ ] T091 Create responsive table-to-card transformation component per NL-055
- [ ] T092 Ensure touch targets ≥44x44px with 8px spacing, button heights ≥44px per NL-056
- [ ] T093 Configure dashboard widget grid reflow: 4→2→1 column per NL-057

### Accessibility Requirements

- [ ] T094 Add keyboard focus indicators: 2px Laboratory Amber outline offset 2px per NL-058
- [ ] T095 Add ARIA labels to all icon-only buttons and navigation per NL-059
- [ ] T096 Verify color contrast ratios: text/background ≥4.5:1, UI ≥3:1 per NL-060
- [ ] T097 Use semantic landmarks: <nav>, <main>, <header> with proper heading hierarchy per NL-061
- [ ] T098 Add skip navigation link as first focusable element per NL-062
- [ ] T099 Implement `prefers-reduced-motion` media query for all animations per NL-063

### Edge Cases & States

- [ ] T114 Create skeleton loader components matching content shapes (rows, cards) with shimmer per NL-064
- [ ] T115 Build full-page error component with retry button, error code, user-friendly message per NL-065
- [ ] T116 Add exponential backoff retry logic (3 attempts) for network failures per NL-065
- [ ] T117 Create empty state components for all list pages with illustration + primary action per NL-066
- [ ] T118 Build "403 Forbidden" page with explanation and dashboard link per NL-067
- [ ] T119 Implement permission-based navigation visibility controls per NL-067
- [ ] T120 Create zero search results page with filter suggestions per NL-068
- [ ] T121 Add virtual scrolling or server-side pagination for long tables (100+ rows) per NL-069
- [ ] T122 Implement scroll position preservation on navigation back per NL-069

### Cross-Page Consistency

- [ ] T123 Create shared list page template: filter toolbar + data area + pagination per NL-070
- [ ] T124 Create shared detail page template: two-column layout + breadcrumb per NL-071
- [ ] T125 Create shared form page template: consistent spacing, button placement, validation per NL-072
- [ ] T126 Standardize breadcrumb component across all non-dashboard pages per NL-073
- [ ] T127 Build consistent header bar: logo left, title center, profile/hamburger right per NL-074

---

## Phase 2.1: Design System Implementation

**Goal**: Implement the High-Tech Apothecary design system with Glassmorphism 2.0, custom tokens, and components

### Design Tokens

- [x] T100 [DS] Configure Tailwind with custom color palette: Deep Obsidian (#0B0E14), Electric Mint (#00FFC2), Laboratory Amber (#FFB800), Slate Grey (#1A1F26)
- [x] T101 [DS] Define CSS custom properties in globals.css for glassmorphism effects (blur, opacity, backdrop-filter)
- [x] T102 [DS] Configure typography scale with Inter/Geist variable fonts
- [x] T103 [DS] Define spacing system scale (4px, 8px, 16px, 24px, 32px, 48px)
- [x] T104 [DS] Define border-radius scale with 12px-16px for tactile buttons
- [x] T105 [DS] Configure z-index layering system for modals, dropdowns, tooltips
- [x] T106 [DS] Define shadow system for tactile feedback (subtle, medium, elevated)

### Core Components

- [x] T107 [DS] Update Button component with tactile shadows and rounded corners
- [x] T108 [DS] Update Card component with glassmorphism surface effect
- [x] T109 [DS] Update Input component with focus states and error styling
- [x] T110 [DS] Create Badge component with status glow effects
- [x] T111 [DS] Create StatusIndicator component with bloom/glow animations for steeping states

### Feature Components

- [x] T112 [DS] Create BeakerWidget component for real-time bottle filling visualization
- [x] T113 [DS] Create CollapsibleSidebar component with icon-only mode
- [x] T114 [DS] Create FocusMode overlay for batch mixing sessions
- [x] T115 [DS] Create LiquidProgress component with liquid-fill animation

### Layout & Pages

- [x] T116 [DS] Update dashboard layout with collapsible sidebar
- [x] T117 [DS] Implement Focus Mode toggle logic in batch mixing page
- [x] T118 [DS] Apply glassmorphism effects to all container components
- [x] T119 [DS] Configure responsive breakpoints for tablet-first design

### Animation & Interaction

- [x] T120 [DS] Define transition durations for all interactive elements
- [x] T121 [DS] Create liquid animation keyframes for progress indicators
- [x] T122 [DS] Create glow pulse animation for status indicators
- [x] T123 [DS] Implement reduced-motion preferences for accessibility
- [x] T124 [DS] Add touch-friendly spacing for tablet interactions

### Accessibility

- [x] T125 [DS] Ensure color contrast ratios meet WCAG AA for all text
- [x] T126 [DS] Add focus indicators for keyboard navigation
- [x] T127 [DS] Add aria-labels to icon-only buttons and status indicators

### Tests

- [x] T128 [DS] Verify all color tokens are correctly applied in components
- [x] T129 [DS] Test glassmorphism fallback for unsupported browsers
- [x] T130 [DS] Test reduced-motion preferences are respected

---

## Phase 3: User Story 1 - E-Liquid Recipe Management

**Goal**: Enable users to create, version, and search recipes

**Independent Test**: Create a recipe with multiple ingredients, verify measurements recorded accurately, retrieve recipe for production

### Implementation

- [x] T021 [US1] Create Ingredient model service in lib/db/repositories/ingredient.ts
- [x] T022 [US1] Create Recipe model service in lib/db/repositories/recipe.ts with versioning logic
- [x] T023 [US1] Create RecipeIngredient model service in lib/db/repositories/recipe-ingredient.ts
- [x] T024 [US1] Build recipe list page in app/(dashboard)/recipes/page.tsx with search and filters
- [x] T025 [US1] Create recipe form component in components/recipes/recipe-form.tsx with react-hook-form + zod
- [x] T026 [US1] Build recipe create page in app/(dashboard)/recipes/create/page.tsx
- [x] T027 [US1] Build recipe detail page in app/(dashboard)/recipes/[id]/page.tsx with version history
- [x] T028 [US1] Build recipe edit page in app/(dashboard)/recipes/[id]/edit/page.tsx (creates new version)
- [x] T029 [US1] Create recipe API routes: GET/POST /api/recipes, GET/PATCH/DELETE /api/recipes/[id]
- [x] T030 [US1] Implement recipe version retrieval API: GET /api/recipes/[id]/versions
- [x] T082 [US1] Add confirmation dialog for recipe delete action

### Tests

- [x] T083 [US1] Create unit tests for Recipe service in tests/unit/recipes.test.ts
- [x] T084 [US1] Create unit tests for Ingredient service in tests/unit/ingredients.test.ts
- [x] T085 [US1] Run recipe tests and fix failures

---

## Phase 4: User Story 2 - Mixing Lab Operations

**Goal**: Execute recipes, record actual weights, track steeping timeline

**Independent Test**: Start batch from recipe, record mixing data, verify steeping notifications

### Implementation

- [ ] T031 [US2] Create Batch model service in lib/db/repositories/batch.ts with status transitions
- [ ] T032 [US2] Create BatchIngredient model service in lib/db/repositories/batch-ingredient.ts
- [ ] T033 [US2] Build batch list page in app/(dashboard)/batches/page.tsx with status filters
- [ ] T034 [US2] Create batch creation flow: select recipe in app/(dashboard)/batches/create/page.tsx
- [ ] T035 [US2] Build batch mixing form in app/(dashboard)/batches/[id]/mix/page.tsx with actual weight inputs
- [ ] T036 [US2] Implement batch start API: POST /api/batches/[id]/start with ingredient tracking
- [ ] T037 [US2] Create variance calculation logic in batch service
- [ ] T038 [US2] Build steeping status view in app/(dashboard)/batches/[id]/page.tsx
- [ ] T039 [US2] Implement steeping completion API: POST /api/batches/[id]/complete-steeping
- [ ] T040 [US2] Build batch completion page in app/(dashboard)/batches/[id]/complete/page.tsx
- [ ] T041 [US2] Create batch cancel API: POST /api/batches/[id]/cancel
- [ ] T097 [US2] Add confirmation dialog for batch cancel action

### Tests

- [ ] T086 [US2] Create unit tests for Batch service in tests/unit/batches.test.ts
- [ ] T087 [US2] Run batch tests and fix failures

---

## Phase 5: User Story 3 - Smart Inventory Tracking

**Goal**: Track raw materials, manage receipts, generate low-stock alerts

**Independent Test**: Record inventory receipt, verify deductions, confirm low-stock alerts trigger

### Implementation

- [ ] T042 [US3] Create RawMaterial model service in lib/db/repositories/raw-material.ts
- [ ] T043 [US3] Create InventoryTransaction model service in lib/db/repositories/inventory-transaction.ts
- [ ] T044 [US3] Build inventory list page in app/(dashboard)/inventory/page.tsx with type filters
- [ ] T045 [US3] Create inventory receive form in components/inventory/inventory-receive-form.tsx
- [ ] T046 [US3] Build inventory receive page in app/(dashboard)/inventory/[id]/receive/page.tsx
- [ ] T047 [US3] Implement inventory receive API: POST /api/inventory/[id]/receive
- [ ] T048 [US3] Create inventory adjustment API: POST /api/inventory/[id]/adjust
- [ ] T049 [US3] Implement inventory deduction logic in batch completion (links to batch service)
- [ ] T050 [US3] Build low-stock alerts view in app/(dashboard)/inventory/alerts/page.tsx
- [ ] T051 [US3] Implement alerts API: GET /api/inventory/alerts
- [ ] T052 [US3] Build inventory history page in app/(dashboard)/inventory/[id]/history/page.tsx
- [ ] T098 [US5] Add confirmation dialog for inventory adjustment

### Tests

- [ ] T088 [US3] Create unit tests for Inventory service in tests/unit/inventory.test.ts
- [ ] T089 [US3] Run inventory tests and fix failures

---

## Phase 6: User Story 4 - Compliance & Batch Traceability

**Goal**: Generate compliance documentation, enable full traceability

**Independent Test**: Create batch, verify raw material sources linked, generate compliance reports

### Implementation

- [ ] T053 [US4] Create ComplianceRecord model service in lib/db/repositories/compliance-record.ts
- [ ] T054 [US4] Build compliance dashboard in app/(dashboard)/compliance/page.tsx
- [ ] T055 [US4] Implement traceability API: GET /api/batches/[id]/traceability
- [ ] T056 [US4] Build traceability view in app/(dashboard)/compliance/traceability/[batchId]/page.tsx
- [ ] T057 [US4] Create TPD report generation logic
- [ ] T058 [US4] Implement compliance report API: GET /api/compliance/batches/[id]/report
- [ ] T059 [US4] Build compliance report download in app/(dashboard)/compliance/reports/[batchId]/page.tsx

### Tests

- [ ] T090 [US4] Create unit tests for Compliance service in tests/unit/compliance.test.ts
- [ ] T091 [US4] Run compliance tests and fix failures

---

## Phase 7: User Story 5 - Customer Retention

**Goal**: Manage loyalty programs, track points, enable redemption

**Independent Test**: Enroll customer, verify points accumulate, test redemption

### Implementation

- [ ] T060 [US5] Create Customer model service in lib/db/repositories/customer.ts
- [ ] T061 [US5] Create LoyaltyTransaction model service in lib/db/repositories/loyalty-transaction.ts
- [ ] T062 [US5] Build customer list page in app/(dashboard)/customers/page.tsx
- [ ] T063 [US5] Create customer form in components/customers/customer-form.tsx
- [ ] T064 [US5] Build customer create page in app/(dashboard)/customers/create/page.tsx
- [ ] T065 [US5] Build customer detail page in app/(dashboard)/customers/[id]/page.tsx with loyalty history
- [ ] T066 [US5] Implement customer API: CRUD /api/customers
- [ ] T067 [US5] Create loyalty points earn API: POST /api/customers/[id]/earn
- [ ] T068 [US5] Create loyalty points redeem API: POST /api/customers/[id]/redeem
- [ ] T069 [US5] Build loyalty transaction history in app/(dashboard)/customers/[id]/transactions/page.tsx

### Tests

- [ ] T092 [US5] Create unit tests for Customer service in tests/unit/customers.test.ts
- [ ] T093 [US5] Create unit tests for Loyalty service in tests/unit/loyalty.test.ts
- [ ] T094 [US5] Run customer tests and fix failures

---

## Phase 9: User Story 6 - Supplier & Purchase Management

**Goal**: Manage supplier relationships and track raw material purchases

**Independent Test**: Create supplier, place purchase order, receive order, verify inventory and costs updated

### Implementation

- [ ] T131 [US6] Create Supplier model service in lib/db/repositories/supplier.ts
- [ ] T132 [US6] Create PurchaseOrder model service in lib/db/repositories/purchase-order.ts
- [ ] T133 [US6] Create PurchaseOrderItem model service in lib/db/repositories/purchase-order-item.ts
- [ ] T134 [US6] Build supplier list page in app/(dashboard)/suppliers/page.tsx
- [ ] T135 [US6] Create supplier form in components/suppliers/supplier-form.tsx
- [ ] T136 [US6] Build supplier create page in app/(dashboard)/suppliers/create/page.tsx
- [ ] T137 [US6] Build supplier detail page in app/(dashboard)/suppliers/[id]/page.tsx
- [ ] T138 [US6] Build purchase order list page in app/(dashboard)/purchases/page.tsx
- [ ] T139 [US6] Create purchase order form in components/purchases/purchase-order-form.tsx
- [ ] T140 [US6] Build purchase order create page in app/(dashboard)/purchases/create/page.tsx
- [ ] T141 [US6] Implement purchase order receive API: POST /api/purchases/[id]/receive
- [ ] T142 [US6] Build purchase order detail page in app/(dashboard)/purchases/[id]/page.tsx
- [ ] T143 [US6] Implement purchase order receive page in app/(dashboard)/purchases/[id]/receive/page.tsx

### Tests

- [ ] T144 [US6] Create unit tests for Supplier service in tests/unit/suppliers.test.ts
- [ ] T145 [US6] Create unit tests for PurchaseOrder service in tests/unit/purchase-orders.test.ts
- [ ] T146 [US6] Run purchase tests and fix failures

---

## Phase 10: User Story 7 - Sales Recording

**Goal**: Record product sales, apply discounts, track revenue

**Independent Test**: Create sale with products, apply discount, verify inventory deducted and revenue recorded

### Implementation

- [ ] T147 [US7] Create Product model service in lib/db/repositories/product.ts
- [ ] T148 [US7] Create Product from completed batch in batch completion flow
- [ ] T149 [US7] Create Sale model service in lib/db/repositories/sale.ts
- [ ] T150 [US7] Create SaleItem model service in lib/db/repositories/sale-item.ts
- [ ] T151 [US7] Build product list page in app/(dashboard)/products/page.tsx
- [ ] T152 [US7] Build product detail/edit page in app/(dashboard)/products/[id]/page.tsx
- [ ] T153 [US7] Build sales page (POS) in app/(dashboard)/sales/page.tsx
- [ ] T154 [US7] Create sale form with product selection in components/sales/sale-form.tsx
- [ ] T155 [US7] Implement sale API: POST /api/sales with inventory deduction
- [ ] T156 [US7] Integrate loyalty points redemption in sale flow
- [ ] T157 [US7] Build sales history page in app/(dashboard)/sales/history/page.tsx
- [ ] T158 [US7] Build sales detail page in app/(dashboard)/sales/[id]/page.tsx
- [ ] T159 [US7] Implement sale refund API: POST /api/sales/[id]/refund

### Tests

- [ ] T160 [US7] Create unit tests for Product service in tests/unit/products.test.ts
- [ ] T161 [US7] Create unit tests for Sale service in tests/unit/sales.test.ts
- [ ] T162 [US7] Run sales tests and fix failures

---

## Phase 11: User Story 8 - Profit Analysis

**Goal**: Analyze purchases, sales, and profit margins

**Independent Test**: Perform purchases and sales, generate profit report, verify calculations

### Implementation

- [ ] T163 [US8] Create profit calculation logic in sale service
- [ ] T164 [US8] Build profit dashboard in app/(dashboard)/reports/profit/page.tsx
- [ ] T165 [US8] Implement profit summary API: GET /api/reports/profit with date range filters
- [ ] T166 [US8] Build product profitability analysis in app/(dashboard)/reports/profit/products/page.tsx
- [ ] T167 [US8] Implement product profitability API: GET /api/reports/profit/products
- [ ] T168 [US8] Build sales trends view in app/(dashboard)/reports/profit/trends/page.tsx
- [ ] T169 [US8] Implement sales trends API: GET /api/reports/profit/trends with daily/weekly/monthly grouping
- [ ] T170 [US8] Add date range filter component to all profit reports
- [ ] T171 [US8] Build purchase cost summary in app/(dashboard)/reports/costs/page.tsx
- [ ] T172 [US8] Implement purchase cost API: GET /api/reports/costs with date range filters

### Tests

- [ ] T173 [US8] Create unit tests for profit calculations in tests/unit/profit.test.ts
- [ ] T174 [US8] Run profit tests and fix failures

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Final integration, testing, and deployment preparation

- [ ] T070 Add toast notifications for all CRUD operations using shadcn toast
- [ ] T071 Implement optimistic updates with TanStack Query mutations
- [ ] T072 Add loading skeletons for all list pages
- [ ] T073 Implement proper error handling with user-friendly messages
- [ ] T074 Add mobile-responsive refinements for all pages
- [ ] T075 Add empty states with helpful actions for all list pages
- [ ] T076 [P] Run lint: `pnpm lint` and fix all issues
- [ ] T077 [P] Run typecheck: `pnpm typecheck` and fix type errors
- [ ] T078 Create database seed script in prisma/seed.ts with sample data
- [ ] T079 Add npm scripts for common dev tasks in package.json
- [ ] T080 Verify all user story acceptance scenarios pass manually
- [ ] T081 [P] Configure automated daily database backup using Neon point-in-time recovery or cron job
- [ ] T082 Remove this (moved to earlier phases)
- [ ] T095 Build production volume report in app/(dashboard)/reports/production/page.tsx
- [ ] T096 Build inventory levels report in app/(dashboard)/reports/inventory/page.tsx

---

## Dependency Graph

```
Phase 1 (Setup)
    │
    ├─► Phase 2 (Foundational)
    │       │
    │       ├─► Phase 2.2 (Layout Implementation)
    │       │       │
    │       │       ├─► Phase 2.5 (Design System)
    │       │       │
    │       │       └─► Phase 3 (US1: Recipes)
    │       │               │
    │       │               └─► Phase 4 (US2: Batches) ──► Phase 5 (US3: Inventory)
    │       │                       │
    │       │                       └───────────────► Phase 6 (US4: Compliance)
    │       │
    │       └─► Phase 7 (US5: Customers)
    │
    ├─► Phase 9 (US6: Suppliers)
    │       │
    │       └─► Phase 10 (US7: Sales) ──► Phase 11 (US8: Profit)
    │
    └─► Phase 8 (Polish)
```

---

## Parallel Execution Opportunities

| Tasks | Reason |
|-------|--------|
| T012, T013, T014, T015 | Auth setup - independent components |
| T016, T017 | Layouts can be done in parallel |
| T018, T019, T020 | Shared utilities - no dependencies |
| T021, T022, T023 | Recipe repositories - can start together |
| T024, T025, T026 | US1 UI components - independent pages |
| T031, T032, T033 | Batch repositories - can start together |
| T042, T043, T044 | Inventory repositories - can start together |
| T060, T061, T062 | Customer repositories - can start together |
| T100-T106 | Design token setup - can run in parallel |
| T107-T111 | Core component updates - can run in parallel |
| T112-T115 | Feature components - can run in parallel |
| T120-T124 | Animation tasks - can run in parallel |
| T076, T077 | Linting can run in parallel |

---

## Independent Test Criteria

| User Story | Test Criteria |
|------------|---------------|
| **US1** | Create recipe with 10 ingredients, verify all measurements saved accurately, retrieve recipe for production |
| **US2** | Start batch from recipe, record actual weights, verify variance calculated, check steeping notification timing |
| **US3** | Record inventory receipt, complete batch to trigger deduction, verify low-stock alert appears at threshold |
| **US4** | Create batch, query traceability, verify all raw material sources displayed, generate compliance report |
| **US5** | Enroll customer, simulate purchase to earn points, redeem points, verify balance updates correctly |
| **US6** | Create supplier, place purchase order, receive order, verify inventory and costs updated correctly |
| **US7** | Record sale with products, apply discount, verify inventory deducted and revenue/profit calculated correctly |
| **US8** | Generate profit report, verify revenue, costs, and profit match expected values, check product margins |

---

## MVP Scope (Phase 1 User Story Only)

**Recommended MVP**: Phase 2.2 + Phase 2.5 + Phase 3 (Layout + Design System + User Story 1)

- Includes: T001-T030, T021-T099 (Phase 2.2 Layout), T100-T130 (Phase 2.5 Design System)
- Core value: Users can create and version recipes with complete design system and layout infrastructure
- Enables: All subsequent user stories depend on layout and design system foundation
- Excluded: User Stories 2-8 (Phases 4-11) reserved for future releases

---

## Layout Checklist Coverage

**Layout checklist items addressed by Phase 2.2 tasks:**

| Checklist Item | Task(s) | Status |
|----------------|---------|--------|
| CHK001-NL-001 (page navigation) | T031 | ✅ |
| CHK002-NL-002 (sidebar organization) | T032 | ✅ |
| CHK003-NL-003 (collapsible sections) | T033 | ✅ |
| CHK004-NL-004 (active highlighting) | T034 | ✅ |
| CHK005-NL-006 (keyboard nav) | T036, T037 | ✅ |
| CHK006-NL-005 (mobile nav) | T035 | ✅ |
| CHK007-NL-008 (dashboard components) | T039, T040 | ✅ |
| CHK008-NL-007 (dashboard purpose) | T039 | ✅ |
| CHK009-NL-009 (analytics specs) | T041 | ✅ |
| CHK010-NL-010 (dashboard layout) | T042 | ✅ |
| CHK011-NL-011 (data refresh) | T043 | ✅ |
| CHK012-NL-010 (responsive dashboard) | T042 | ✅ |
| CHK013-NL-012 (empty states) | T044 | ✅ |
| CHK014-NL-013 (action button placement) | T046 | ✅ |
| CHK015-NL-015 (button behavior) | T047 | ✅ |
| CHK016-NL-016 (button enable/disable) | T048 | ✅ |
| CHK017-NL-017 (button accessibility) | T049 | ✅ |
| CHK018-NL-013 (button consistency) | T046 | ✅ |
| CHK019-NL-018 (transactions layout) | T050 | ✅ |
| CHK020-NL-019 (transaction columns) | T051 | ✅ |
| CHK021-NL-020 (filtering/sorting) | T052 | ✅ |
| CHK022-NL-021 (visual distinction) | T051 | ✅ |
| CHK023-NL-022 (pagination) | T053 | ✅ |
| CHK024-NL-023 (drill-down) | T054 | ✅ |
| CHK025-NL-025 (inventory layout) | T056, T057 | ✅ |
| CHK026-NL-025 (inventory fields) | T057 | ✅ |
| CHK027-NL-027 (inventory filters) | T059 | ✅ |
| CHK028-NL-028 (action buttons) | T060 | ✅ |
| CHK029-NL-026, NL-029 (low-stock indicators) | T058, T061 | ✅ |
| CHK030-NL-030 (products layout) | T063 | ✅ |
| CHK031-NL-030 (product fields) | T065 | ✅ |
| CHK032-NL-032 (product filtering) | T066 | ✅ |
| CHK033-NL-030 (recipe/batch link) | T065 | ✅ |
| CHK034-NL-035 (clients layout) | T069, T070 | ✅ |
| CHK035-NL-035 (client fields) | T070 | ✅ |
| CHK036-NL-039 (client detail view) | T074 | ✅ |
| CHK037-NL-037 (client search/filter) | T072 | ✅ |
| CHK038-NL-041 (profile content) | T076, T077, T078, T079, T080, T081, T082 | ✅ |
| CHK039-NL-041 (profile layout) | T076, T080 | ✅ |
| CHK040-NL-044, NL-045 (editing/permissions) | T079, T081 | ✅ |
| CHK041-NL-044 (responsive profile) | T080 | ✅ |
| CHK042-NL-047 (visual hierarchy) | T083 | ✅ |
| CHK043-NL-048 (typography scale) | T084 | ✅ |
| CHK044-NL-051 (color conventions) | T087 | ✅ |
| CHK045-NL-050 (spacing/padding) | T086 | ✅ |
| CHK046-NL-049 (card/elevation) | T085 | ✅ |
| CHK047-NL-052 (breakpoints) | T088 | ✅ |
| CHK048-NL-052 (mobile-first) | T090, T091, T042 | ✅ |
| CHK049-NL-054, NL-055 (layout adaptation) | T090, T091, T042 | ✅ |
| CHK050-NL-056 (touch targets) | T092 | ✅ |
| CHK051-NL-055 (content reflow) | T091 | ✅ |
| CHK052-NL-006, NL-058 (keyboard nav) | T094 | ✅ |
| CHK053-NL-017, NL-058 (focus indicators) | T094 | ✅ |
| CHK054-NL-017, NL-059 (ARIA labels) | T095 | ✅ |
| CHK055-NL-060 (color contrast) | T096 | ✅ |
| CHK056-NL-061, NL-062 (landmarks/skip) | T097, T098 | ✅ |
| CHK057-NL-064 (loading states) | T100 | ✅ |
| CHK058-NL-065 (error states) | T101, T102 | ✅ |
| CHK059-NL-066 (empty states) | T103 | ✅ |
| CHK060-NL-067 (permissions) | T104, T105 | ✅ |
| CHK061-NL-068 (zero results) | T106 | ✅ |
| CHK062-NL-069 (scroll behavior) | T107, T108 | ✅ |
| CHK063-NL-070 (list page pattern) | T123 | ✅ |
| CHK064-NL-071 (action consistency) | T124, T125 | ✅ |
| CHK065-NL-073 (breadcrumb pattern) | T126 | ✅ |
| CHK066-NL-072 (search/filter consistency) | T123 | ✅ |

## Task Count Summary

| Phase | Task Count |
|-------|------------|
| Phase 1: Setup | 11 |
| Phase 2: Foundational | 9 |
| Phase 2.2: Layout Implementation | 83 |
| Phase 2.5: Design System | 31 |
| Phase 3: US1 - Recipes | 14 |
| Phase 4: US2 - Batches | 14 |
| Phase 5: US3 - Inventory | 14 |
| Phase 6: US4 - Compliance | 9 |
| Phase 7: US5 - Customers | 13 |
| Phase 9: US6 - Suppliers & Purchases | 16 |
| Phase 10: US7 - Sales | 16 |
| Phase 11: US8 - Profit Analysis | 12 |
| Phase 8: Polish | 13 |
| **Total** | **245** |
