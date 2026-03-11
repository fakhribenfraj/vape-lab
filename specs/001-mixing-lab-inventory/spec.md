# Feature Specification: VapeLab.io ERP/POS Platform

**Feature Branch**: `001-mixing-lab-inventory`  
**Created**: 2026-03-10  
**Status**: Draft  
**Input**: User description: "VapeLab.io is a specialized, vertically-integrated ERP and POS platform designed specifically for the modern vape retailer and local e-liquid manufacturer. It bridges the gap between a chemical laboratory and a retail storefront by offering a high-precision Mixing Lab Module—which manages complex, weight-based recipes and steeping timelines—seamlessly synced with a Smart Inventory System that tracks raw materials (PG, VG, nicotine, and concentrates) down to the milliliter. By automating compliance, batch traceability, and "Dark Marketing" customer retention, VapeLab.io transforms a standard vape shop into a data-driven, professional manufacturing hub, ensuring every bottle produced is consistent, compliant, and profitable."

## Clarifications

### Session 2026-03-10

- Q: Deployment Architecture → A: Single unified application (Option A - web-based, all modules in one system)
- Q: User Authentication & Access Control → A: Username/password with role-based access control (RBAC) - Owner has all permissions for their store
- Q: Scale & Data Volume → A: Small single-store (Option A - up to 100 recipes, 500 monthly transactions)
- Q: Compliance & Regulatory Requirements → A: EU TPD (Tobacco Products Directive) for European market
- Q: Error Handling & Data Resilience → A: Automatic validation with user confirmation for destructive actions, daily backups

## User Scenarios & Testing *(mandatory)*

### User Story 1 - E-Liquid Recipe Management (Priority: P1)

A vape shop owner or lab technician needs to create, manage, and version e-liquid recipes with precise weight-based measurements for ingredients.

**Why this priority**: Recipes are the foundation of the entire mixing operation. Without precise recipe management, consistent product quality cannot be ensured.

**Independent Test**: Can be tested by creating a recipe with multiple ingredients, verifying that all measurements are recorded accurately, and that the recipe can be retrieved and used for production.

**Acceptance Scenarios**:

1. **Given** a user has access to the recipe management system, **When** they create a new recipe with ingredient names and precise weights, **Then** the recipe is saved and can be retrieved with all specified values.
2. **Given** an existing recipe, **When** a user updates ingredient quantities, **Then** a new version is created preserving the history.
3. **Given** multiple recipes, **When** a user searches for recipes by name or ingredient, **Then** matching recipes are returned.

---

### User Story 2 - Mixing Lab Operations (Priority: P1)

A lab technician needs to execute a recipe, record actual mixing details, and track the steeping timeline for each batch produced.

**Why this priority**: This is the core production workflow that connects recipes to actual manufacturing and enables quality control.

**Independent Test**: Can be tested by starting a new batch from a recipe, recording mixing data, and verifying steeping notifications are triggered at the correct times.

**Acceptance Scenarios**:

1. **Given** a valid recipe exists, **When** a technician initiates a new batch, **Then** the system creates a batch record linked to the recipe.
2. **Given** a batch is created, **When** the technician records actual weights used, **Then** variance from recipe targets is calculated and stored.
3. **Given** a batch enters steeping phase, **When** the steeping duration elapses, **Then** the system notifies relevant staff that the batch is ready.

---

### User Story 3 - Smart Inventory Tracking (Priority: P1)

An inventory manager needs to track raw materials (PG, VG, nicotine, concentrates) with milliliter precision and receive alerts for low stock.

**Why this priority**: Accurate inventory tracking is essential for production planning, cost control, and preventing production delays due to material shortages.

**Independent Test**: Can be tested by recording inventory receipts, verifying deductions match actual usage, and confirming low-stock alerts trigger at defined thresholds.

**Acceptance Scenarios**:

1. **Given** raw materials are received, **When** the inventory manager records receipt with volume, **Then** stock levels increase accordingly.
2. **Given** a batch uses materials, **When** mixing is completed, **Then** inventory is automatically deducted based on actual usage.
3. **Given** stock falls below threshold, **When** inventory is checked, **Then** the system generates a low-stock alert.

---

### User Story 4 - Compliance & Batch Traceability (Priority: P2)

A compliance officer needs automated compliance documentation and full traceability from raw materials to finished batches.

**Why this priority**: Regulatory compliance is mandatory for e-liquid manufacturing. Traceability ensures product safety and enables recalls if needed.

**Independent Test**: Can be tested by creating a batch and verifying all raw material sources are linked, and compliance reports can be generated on demand.

**Acceptance Scenarios**:

1. **Given** a completed batch, **When** compliance documentation is requested, **Then** all required information is assembled automatically.
2. **Given** a raw material in a finished product, **When** traceability is queried, **Then** the complete chain from source to batch is displayed.
3. **Given** regulatory requirements change, **When** compliance templates are updated, **Then** new batches use the current requirements.

---

### User Story 5 - Customer Retention (Priority: P3)

A shop owner needs tools to retain customers through loyalty programs and personalized marketing.

**Why this priority**: Customer retention drives profitability and differentiates a shop from competitors.

**Independent Test**: Can be tested by enrolling customers in a loyalty program and verifying points accumulate correctly with purchases.

**Acceptance Scenarios**:

1. **Given** a customer makes a purchase, **When** the transaction is recorded, **Then** loyalty points are awarded according to rules.
2. **Given** a customer has sufficient points, **When** they redeem for a reward, **Then** points are deducted and reward is applied.
3. **Given** customer purchase history, **When** personalized offers are generated, **Then** relevant products are suggested based on preferences.

---

### User Story 6 - Supplier & Purchase Management (Priority: P2)

An inventory manager needs to manage supplier relationships and track raw material purchases to ensure consistent supply and accurate cost tracking.

**Why this priority**: Understanding supplier costs and managing purchase orders is essential for profitability analysis and maintaining adequate inventory levels.

**Independent Test**: Can be tested by creating a supplier, placing a purchase order, receiving the order, and verifying inventory levels and costs are updated correctly.

**Acceptance Scenarios**:

1. **Given** a user manages inventory, **When** they add a new supplier with contact details, **Then** the supplier is saved and can be selected in purchase orders.
2. **Given** a supplier exists, **When** a user creates a purchase order for raw materials, **Then** the order is saved with expected delivery date and costs.
3. **Given** a purchase order exists, **When** materials are received, **Then** inventory levels increase and the order is marked as received.

---

### User Story 7 - Sales Recording (Priority: P2)

A shop owner or sales associate needs to record product sales to customers, apply discounts, and track revenue.

**Why this priority**: Accurate sales recording is fundamental for revenue tracking, inventory deduction, and profit analysis.

**Independent Test**: Can be tested by creating a sale with products, applying a discount, processing payment, and verifying inventory is deducted and revenue is recorded.

**Acceptance Scenarios**:

1. **Given** a customer purchases products, **When** the sale is recorded with products and quantities, **Then** inventory is deducted and revenue is recorded.
2. **Given** a customer has loyalty points, **When** they make a purchase, **Then** points are earned and can be redeemed as discount.
3. **Given** a sale is completed, **When** the transaction is recorded, **Then** profit can be calculated based on product costs.

---

### User Story 8 - Profit Analysis (Priority: P2)

A shop owner needs to analyze purchases, sales, and profit margins to make informed business decisions.

**Why this priority**: Understanding profitability by product, time period, and customer segment is essential for optimizing the business.

**Independent Test**: Can be tested by performing purchases and sales, then generating a profit report and verifying calculations are accurate.

**Acceptance Scenarios**:

1. **Given** sales and cost data exists, **When** a profit report is generated, **Then** revenue, total costs, and profit are displayed.
2. **Given** multiple products have been sold, **When** profitability is analyzed by product, **Then** each product shows its margin percentage.
3. **Given** sales data over time, **When** trends are analyzed, **Then** daily, weekly, and monthly patterns are displayed.

---

### Edge Cases

- What happens when a recipe ingredient becomes unavailable in inventory?
- How does the system handle partial batches that don't complete mixing?
- What occurs when steeping timeline needs to be extended for quality reasons?
- How is data preserved if inventory recording is missed during busy periods?
- What happens when compliance requirements differ by jurisdiction?
- What occurs when a purchase order is partially received?
- How does the system handle returns or refunds on sales?
- What happens when raw material costs change over time?
- How are product costs calculated when using batches with different ingredient costs?

## Layout & Navigation Requirements

### Navigation Structure

- **NL-001**: The application SHALL feature a left sidebar navigation that is visible on tablet (primary) and desktop screens, containing links to all major sections: Dashboard, Transactions, Inventory, Products, Clients, and Profile.
- **NL-002**: The sidebar navigation SHALL support collapsible sections with grouping: Production (Recipes, Batches, Compliance), Inventory (Inventory, Products, Suppliers/Purchases), Sales (Sales/Transactions), Customers (Clients), and Analytics (Dashboard, Reports).
- **NL-003**: The sidebar SHALL have an icon-only collapsed mode (minimum 60px width) that expands on hover or click to show full labels (minimum 240px width).
- **NL-004**: The active page's navigation item SHALL be visually highlighted with Electric Mint (#00FFC2) accent color and a left border indicator.
- **NL-005**: On mobile screens (<768px), the sidebar SHALL be hidden by default and accessible via a hamburger menu icon in the top navigation bar; the menu SHALL overlay content with backdrop blur.
- **NL-006**: Keyboard navigation SHALL be supported: Tab to navigate through navigation items, Enter/Space to activate, arrow keys to move within groups, and the menu shortcut `Ctrl/Cmd + K` to open quick navigation palette.

### Dashboard Layout

- **NL-007**: The dashboard SHALL be the default landing page after login, displaying a welcome header with user's store name and today's date.
- **NL-008**: The dashboard SHALL feature a metrics row showing 4-6 key performance indicators: Total Sales (today/this week), Active Batches, Low Stock Alerts, and Revenue (today/this week), each in glassmorphism cards with Electric Mint accents for positive trends.
- **NL-009**: Below the metrics row, the dashboard SHALL display a grid of analytics widgets:
  - A line chart showing sales trends over the last 30 days (daily aggregation)
  - A bar chart showing top 5 products by revenue this month
  - A donut chart showing inventory value by raw material type
  - A table showing batches in steeping phase with completion countdown timers
- **NL-010**: Dashboard layout SHALL use a responsive grid: metrics row (1 row on mobile, 2-3 rows on tablet, 1 row on desktop), analytics widgets stack in single column on mobile, 2-column on tablet, 3-4 column on desktop.
- **NL-011**: Dashboard data SHALL refresh automatically every 30 seconds via TanStack Query background refetch, with a manual refresh button in the top right corner.
- **NL-012**: When no data exists (new installation), the dashboard SHALL display empty state illustrations with helpful actions: "Create Your First Recipe" and "Set Up Your Inventory".

### Action Button Requirements

- **NL-013**: A primary action button labeled "New Sale" SHALL be visible on the dashboard (top right, below header) and on the Sales page (top of the form area).
- **NL-014**: The "New Sale" button SHALL use Electric Mint (#00FFC2) background with Deep Obsidian (#0B0E14) text, rounded corners (16px), and tactile shadow effect; it SHALL be fixed position on scroll within its container.
- **NL-015**: Clicking "New Sale" SHALL navigate to the Sales page with an empty transaction form ready to accept product scans/selections.
- **NL-016**: The button SHALL be disabled only when the user lacks sales recording permissions (role-based); otherwise it SHALL always be enabled.
- **NL-017**: The button SHALL have ARIA label "Create new sales transaction" and keyboard focus indicator with 2px offset outline in Laboratory Amber (#FFB800).

### Transactions Page Layout

- **NL-018**: The Transactions page SHALL present a unified chronological view of all financial activity, combining sales and purchase orders in a single reverse-chronological list (newest first).
- **NL-019**: Each transaction row SHALL display: Date/Time, Type (Sale/Purchase) with color coding (Electric Mint for sales, Laboratory Amber for purchases), Reference Number, Customer/Supplier name, Total Amount, and Status (Completed/Pending/Cancelled).
- **NL-020**: The transaction list SHALL include a filter bar with controls: Date range picker (default: last 30 days), Type filter (All/Sales/Purchases), Status filter (All/Completed/Pending), and a search input for customer/supplier name or reference number.
- **NL-021**: Sales and purchases SHALL be visually distinguished: sales rows have left border Electric Mint, purchase rows have left border Laboratory Amber; type icons differ (cash register vs truck).
- **NL-022**: The list SHALL use pagination with 20 items per page, showing total count and page navigation; infinite scroll is NOT required.
- **NL-023**: Clicking a transaction row SHALL navigate to its detail page: sales go to `/sales/[id]`, purchases go to `/purchases/[id]`.
- **NL-024**: The page SHALL include a summary bar at the top showing: Total Transactions (matching filters), Total Sales Amount, Total Purchase Amount, and Net Revenue.

### Inventory Page Layout

- **NL-025**: The Inventory page SHALL display raw materials in a responsive table layout with columns: Material Name, Type (PG/VG/Nicotine/Concentrate), Current Stock (ml), Unit of Measure, Reorder Threshold, Status (In Stock/Low Stock/Out of Stock), and Actions.
- **NL-026**: The Status column SHALL use color-coded badges: Green (In Stock >120% threshold), Laboratory Amber (Low Stock 80-120% threshold), Red (Out of Stock <80% threshold).
- **NL-027**: The page SHALL include filter controls at the top: Type dropdown (All/PG/VG/Nicotine/Concentrate), Status dropdown (All/In Stock/Low Stock/Out of Stock), and search by material name.
- **NL-028**: Each row SHALL have action buttons in the Actions column: "Receive" (plus icon) to add stock, "Adjust" (settings icon) for manual adjustments, and "History" (clock icon) to view transaction history; these buttons SHALL appear on hover and be accessible via keyboard focus.
- **NL-029**: Low stock items SHALL be visually emphasized: row background tinted slightly red (5% opacity) and a small warning icon next to stock value.

### Products Page Layout

- **NL-030**: The Products page SHALL list finished e-liquid products in a card grid layout (2-4 columns depending on screen width) with each card showing: Product image (placeholder if none), Name, SKU, Price, Cost, Profit Margin (%), and Batch Source (link to originating batch).
- **NL-031**: Each product card SHALL have a consistent height (200px) with glassmorphism surface effect, Electric Mint border on hover, and shadow elevation lift effect.
- **NL-032**: The page SHALL include a toolbar above the grid with: Search input (by name/SKU), Sort dropdown (Name, Price, Margin, Date Added), and Filter by flavor profile or batch status.
- **NL-033**: Product margin percentages SHALL be color-coded: Green (>60%), Laboratory Amber (40-60%), Red (<40%).
- **NL-034**: Clicking a product card SHALL navigate to the product detail page at `/products/[id]` showing full info: recipe source, batch history, sales history, and edit controls.

### Clients (Customers) Page Layout

- **NL-035**: The Clients page SHALL display customers in a table layout with columns: Name, Email, Phone, Loyalty Points, Total Visits, Last Purchase Date, and Actions.
- **NL-036**: Loyalty Points SHALL be displayed with a badge showing current balance in Electric Mint color, and a tooltip on hover showing "Available for redemption".
- **NL-037**: The page SHALL include filters: Search by name/email, Loyalty tier filter (None/Bronze/Silver/Gold based on points or visit count), and Last purchase date range.
- **NL-038**: Each row SHALL have action buttons: "View" (eye icon) to see customer details and transaction history, "Edit" (pencil icon) to modify info, and "Adjust Points" (plus/minus icons) for manual adjustments (requires permission).
- **NL-039**: The customer detail page at `/customers/[id]` SHALL be a two-column layout: left column shows customer info and loyalty summary, right column shows transaction history (sales) with pagination.
- **NL-040**: The detail page SHALL include a button to "Add Loyalty Adjustment" with form for points earn/redeem reason and amount.

### Profile Page Layout

- **NL-041**: The Profile page SHALL be a form layout with sections: Account Information (username, email, store name), Password Change (current password, new password, confirm), and Preferences (theme, notification settings).
- **NL-042**: The page SHALL display the user's current role (Owner/Technician/Staff) and store affiliation prominently in the header.
- **NL-043**: Form fields SHALL use shadcn/ui Input components with labels above, helper text below, and validation feedback inline; required fields SHALL be marked with asterisk.
- **NL-044**: The profile form SHALL support responsive layout: single column on mobile and tablet, two-column (labels left, inputs right) on desktop for dense sections.
- **NL-045**: Upon successful save, the page SHALL show a success toast notification and refresh the user's session data; errors SHALL display inline with field.
- **NL-046**: The profile page SHALL include a section showing "Active Sessions" with device, location, and last active time, with option to revoke other sessions (security feature).

### Visual Hierarchy & Consistency

- **NL-047**: Primary action buttons across all pages SHALL use Electric Mint (#00FFC2) background with Deep Obsidian text, 16px border radius, and shadow elevation; secondary actions SHALL use transparent background with Electric Mint border and text.
- **NL-048**: Page titles SHALL use Inter font at 28px weight 700 on desktop, 24px on tablet, 20px on mobile; section headers SHALL be 20px/18px/16px respectively, all with Deep Obsidian color.
- **NL-049**: Card surfaces SHALL use glassmorphism effect: semi-transparent Dark Obsidian (#0B0E14) with 60% opacity, 1px border with 10% opacity, and backdrop blur of 8px; elevated cards (modals, dropdowns) SHALL use z-index 50-100.
- **NL-050**: Consistent spacing scale SHALL be applied: padding between sections = 24px, between form fields = 16px, inside cards = 16px; margins between grid items = 16px.
- **NL-051**: Status colors SHALL follow semantic conventions: Electric Mint = success/positive, Laboratory Amber = warning/attention, Red (soft red, not pure) = error/danger, Slate Grey = neutral/inactive.

### Responsive & Adaptive Design

- **NL-052**: Breakpoints SHALL be defined as: Mobile < 640px, Tablet 640px-1024px (primary design target), Desktop > 1024px; all layouts SHALL be mobile-first with progressive enhancement.
- **NL-053**: The main content area SHALL have max-width constraints: 1200px on desktop, 100% on tablet/mobile with 16px side margins.
- **NL-054**: Sidebar SHALL collapse to icon-only mode on tablet portrait (768px) automatically, with full expansion on click; on mobile, sidebar SHALL be off-canvas with 80% width.
- **NL-055**: Tables SHALL transform to card layouts on mobile: each row becomes a stacked card with label-value pairs in vertical stack.
- **NL-056**: Touch targets SHALL be minimum 44x44px with 8px spacing between interactive elements; button heights SHALL be 44px minimum.
- **NL-057**: Dashboard widgets SHALL reflow from 4-column grid (desktop) to 2-column (tablet) to 1-column (mobile) with consistent ordering by priority.

### Accessibility Requirements

- **NL-058**: All interactive navigation elements SHALL be keyboard accessible with visible focus indicators: 2px outline in Laboratory Amber, offset by 2px, not removed on :focus-visible.
- **NL-059**: Icon-only buttons (sidebar, action icons) SHALL have ARIA labels describing their function (e.g., "Create new sale", "View customer details").
- **NL-060**: Color contrast ratios SHALL meet WCAG AA minimum: text vs background >= 4.5:1, large text >= 3:1, UI components >= 3:1; all color combinations SHALL be tested.
- **NL-061**: Page structure SHALL use semantic landmarks: `<nav>` for sidebar, `<main>` for content, `<header>` for top bar; each major section SHALL have appropriate heading hierarchy (h1-h3).
- **NL-062**: Skip navigation link SHALL be provided as first focusable element on each page, linking to `<main id="main-content">`.
- **NL-063**: Animation and motion SHALL respect `prefers-reduced-motion` media query; all non-essential animations (glow pulses, liquid fills) SHALL be disabled when user prefers reduced motion.

### Edge Cases & States

- **NL-064**: Loading states SHALL be defined for all pages: skeleton loaders with shimmer animation matching content shape (tables show skeleton rows, grids show skeleton cards), loading spinner in center for full-page loads.
- **NL-065**: Error states SHALL display a full-page error component with retry button, error code, and user-friendly message; network timeouts SHALL trigger automatic retry with exponential backoff (3 attempts).
- **NL-066**: Empty states SHALL be provided for all list pages with illustration, descriptive text explaining why empty, and primary action button to create first item (e.g., "No recipes yet" + "Create Recipe" button).
- **NL-067**: When user lacks permission for a page, they SHALL see a "403 Forbidden" page with explanation and link to dashboard; navigation SHALL hide inaccessible links based on permissions.
- **NL-068**: Zero search results page SHALL show "No results found" with suggestions to adjust filters or create new item, and retain current filter values in the UI.
- **NL-069**: Long content areas (tables with 100+ rows) SHALL use virtual scrolling or server-side pagination to maintain performance; scroll position SHALL be preserved during navigation back.

### Cross-Page Consistency

- **NL-070**: All list pages (inventory, products, clients, transactions) SHALL share a common layout: filter/toolbar at top, data display area below, pagination at bottom; filter components SHALL use consistent styling.
- **NL-071**: Detail pages (product, customer, batch) SHALL follow a consistent two-column layout: left column for summary/info, right column for related data/actions; header SHALL include breadcrumb navigation.
- **NL-072**: Form pages (recipe create, customer create, inventory receive) SHALL use consistent spacing, button placement (primary action on right, cancel on left), and validation placement (below fields).
- **NL-073**: Breadcrumb navigation SHALL appear consistently below the main header on all non-dashboard pages, showing hierarchical path with `/` separator, last item non-clickable.
- **NL-074**: Header bar SHALL be consistent across all pages: logo left, page title center, user profile/settings right on tablet+, hamburger menu right on mobile.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create e-liquid recipes with ingredient names, precise weight measurements, and unit specifications.
- **FR-002**: System MUST support recipe versioning so that changes are tracked without losing historical versions.
- **FR-003**: System MUST enable batch creation from existing recipes and link batch records to source recipes.
- **FR-004**: System MUST record actual weights used during mixing and calculate variance from recipe targets.
- **FR-005**: System MUST support steeping timeline management with configurable duration and automated notifications.
- **FR-006**: System MUST track raw material inventory including PG, VG, nicotine, and concentrates with milliliter precision.
- **FR-007**: System MUST automatically deduct inventory when batches are completed and link deductions to specific batches.
- **FR-008**: System MUST generate low-stock alerts when inventory falls below configurable thresholds.
- **FR-009**: System MUST maintain bidirectional sync between Mixing Lab and Smart Inventory in real-time.
- **FR-010**: System MUST generate compliance documentation automatically from batch and inventory data.
- **FR-011**: System MUST support full traceability from finished batch to source raw materials.
- **FR-012**: System MUST support customer loyalty programs with points accumulation and redemption.
- **FR-013**: System MUST provide reporting on production volumes, inventory levels, and compliance status.
- **FR-014**: System MUST authenticate users via username and password with role-based access control.
- **FR-015**: System MUST grant the store Owner role full permissions across all modules within their store.
- **FR-016**: System MUST support operations for a small single-store with up to 100 recipes and 500 monthly transactions.
- **FR-017**: System MUST comply with EU TPD (Tobacco Products Directive) requirements for e-liquid manufacturing and labeling.
- **FR-018**: System MUST validate user input automatically and require confirmation for destructive operations.
- **FR-019**: System MUST perform daily automated backups to prevent data loss.
- **FR-020**: System MUST allow users to manage supplier information including name, contact details, and lead times.
- **FR-021**: System MUST support purchase orders with expected delivery dates, quantities, and unit costs.
- **FR-022**: System MUST track purchase order status from creation through receipt.
- **FR-023**: System MUST automatically update raw material inventory and costs when purchase orders are received.
- **FR-024**: System MUST support finished product creation from completed batches with defined pricing.
- **FR-025**: System MUST record sales transactions with products, quantities, prices, and customer associations.
- **FR-026**: System MUST automatically deduct finished product inventory when sales are completed.
- **FR-027**: System MUST apply loyalty point redemptions as discounts on sales.
- **FR-028**: System MUST calculate profit for each sale based on revenue minus product costs.
- **FR-029**: System MUST generate profit reports showing revenue, costs, and profit margins over time.
- **FR-030**: System MUST analyze profitability by product, showing margin percentages.
- **FR-031**: System MUST display sales trends in daily, weekly, and monthly views.

### Key Entities

- **Recipe**: E-liquid formulation with name, version, ingredients, target weights, and steeping requirements.
- **Ingredient**: Raw material used in recipes (PG, VG, nicotine, concentrates) with measurement units.
- **Batch**: Production run created from a recipe with actual weights, timestamps, status, and steeping info.
- **Raw Material**: Inventory item representing bulk ingredients with current stock level and reorder threshold.
- **Customer**: Retail customer with purchase history and loyalty program participation.
- **Compliance Record**: Generated documentation for a batch meeting regulatory requirements.
- **Loyalty Account**: Customer account tracking points balance and redemption history.
- **Supplier**: Company or individual providing raw materials with contact information and lead times.
- **Purchase Order**: Order to supplier for raw materials with expected delivery date, quantities, and costs.
- **Purchase Order Item**: Line item in a purchase order specifying raw material, quantity, and unit cost.
- **Product**: Finished e-liquid product derived from a completed batch, with defined price and SKU.
- **Sale**: Transaction recording products sold to a customer with revenue and profit calculations.
- **Sale Item**: Line item in a sale specifying product, quantity, unit price, and applied discount.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a complete recipe with at least 10 ingredients in under 5 minutes.
- **SC-002**: Inventory deductions match actual batch usage with 99% accuracy.
- **SC-003**: Low-stock alerts are generated within 1 hour of threshold breach during business hours.
- **SC-004**: Full batch traceability is retrievable in under 30 seconds for any completed batch.
- **SC-005**: Compliance documentation is auto-generated for 100% of completed batches.
- **SC-006**: Loyalty points are accurately calculated and reflected immediately after transactions.
- **SC-007**: 95% of steeping completion notifications are delivered within 5 minutes of scheduled time.
- **SC-008**: Purchase orders can be created and received with inventory correctly updated.
- **SC-009**: Sales transactions are recorded with accurate revenue and inventory deduction.
- **SC-010**: Profit calculations are accurate to within 1% of manually calculated values.
- **SC-011**: Profit reports load within 5 seconds for date ranges up to 12 months.
- **SC-012**: Product profitability analysis shows margin percentages for all sold products.
