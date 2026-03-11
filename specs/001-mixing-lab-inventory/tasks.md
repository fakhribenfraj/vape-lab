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

## Phase 2.1: Design System Implementation

**Goal**: Implement the High-Tech Apothecary design system with Glassmorphism 2.0, custom tokens, and components

### Design Tokens

- [ ] T100 [DS] Configure Tailwind with custom color palette: Deep Obsidian (#0B0E14), Electric Mint (#00FFC2), Laboratory Amber (#FFB800), Slate Grey (#1A1F26)
- [ ] T101 [DS] Define CSS custom properties in globals.css for glassmorphism effects (blur, opacity, backdrop-filter)
- [ ] T102 [DS] Configure typography scale with Inter/Geist variable fonts
- [ ] T103 [DS] Define spacing system scale (4px, 8px, 16px, 24px, 32px, 48px)
- [ ] T104 [DS] Define border-radius scale with 12px-16px for tactile buttons
- [ ] T105 [DS] Configure z-index layering system for modals, dropdowns, tooltips
- [ ] T106 [DS] Define shadow system for tactile feedback (subtle, medium, elevated)

### Core Components

- [ ] T107 [DS] Update Button component with tactile shadows and rounded corners
- [ ] T108 [DS] Update Card component with glassmorphism surface effect
- [ ] T109 [DS] Update Input component with focus states and error styling
- [ ] T110 [DS] Create Badge component with status glow effects
- [ ] T111 [DS] Create StatusIndicator component with bloom/glow animations for steeping states

### Feature Components

- [ ] T112 [DS] Create BeakerWidget component for real-time bottle filling visualization
- [ ] T113 [DS] Create CollapsibleSidebar component with icon-only mode
- [ ] T114 [DS] Create FocusMode overlay for batch mixing sessions
- [ ] T115 [DS] Create LiquidProgress component with liquid-fill animation

### Layout & Pages

- [ ] T116 [DS] Update dashboard layout with collapsible sidebar
- [ ] T117 [DS] Implement Focus Mode toggle logic in batch mixing page
- [ ] T118 [DS] Apply glassmorphism effects to all container components
- [ ] T119 [DS] Configure responsive breakpoints for tablet-first design

### Animation & Interaction

- [ ] T120 [DS] Define transition durations for all interactive elements
- [ ] T121 [DS] Create liquid animation keyframes for progress indicators
- [ ] T122 [DS] Create glow pulse animation for status indicators
- [ ] T123 [DS] Implement reduced-motion preferences for accessibility
- [ ] T124 [DS] Add touch-friendly spacing for tablet interactions

### Accessibility

- [ ] T125 [DS] Ensure color contrast ratios meet WCAG AA for all text
- [ ] T126 [DS] Add focus indicators for keyboard navigation
- [ ] T127 [DS] Add aria-labels to icon-only buttons and status indicators

### Tests

- [ ] T128 [DS] Verify all color tokens are correctly applied in components
- [ ] T129 [DS] Test glassmorphism fallback for unsupported browsers
- [ ] T130 [DS] Test reduced-motion preferences are respected

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
    │       ├─► Phase 2.5 (Design System)
    │       │
    │       ├─► Phase 3 (US1: Recipes)
    │       │
    │       ├─► Phase 4 (US2: Batches) ──► Phase 5 (US3: Inventory)
    │       │           │
    │       │           └───────────────► Phase 6 (US4: Compliance)
    │       │
    │       └─► Phase 7 (US5: Customers)
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

---

## MVP Scope (Phase 1 User Story Only)

**Recommended MVP**: Phase 3 (User Story 1 - Recipe Management)

- Includes: T001-T030, T100-T130
- Core value: Users can create and version recipes with design system applied
- Enables: Subsequent stories depend on recipe existence
- Excluded: Batches, Inventory, Compliance, Customers (Phase 4+)

---

## Task Count Summary

| Phase | Task Count |
|-------|------------|
| Phase 1: Setup | 11 |
| Phase 2: Foundational | 9 |
| Phase 2.5: Design System | 31 |
| Phase 3: US1 - Recipes | 14 |
| Phase 4: US2 - Batches | 14 |
| Phase 5: US3 - Inventory | 14 |
| Phase 6: US4 - Compliance | 9 |
| Phase 7: US5 - Customers | 13 |
| Phase 8: Polish | 13 |
| **Total** | **128** |
