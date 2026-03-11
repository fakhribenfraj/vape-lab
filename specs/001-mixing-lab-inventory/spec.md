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

### Edge Cases

- What happens when a recipe ingredient becomes unavailable in inventory?
- How does the system handle partial batches that don't complete mixing?
- What occurs when steeping timeline needs to be extended for quality reasons?
- How is data preserved if inventory recording is missed during busy periods?
- What happens when compliance requirements differ by jurisdiction?

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

### Key Entities

- **Recipe**: E-liquid formulation with name, version, ingredients, target weights, and steeping requirements.
- **Ingredient**: Raw material used in recipes (PG, VG, nicotine, concentrates) with measurement units.
- **Batch**: Production run created from a recipe with actual weights, timestamps, status, and steeping info.
- **Raw Material**: Inventory item representing bulk ingredients with current stock level and reorder threshold.
- **Customer**: Retail customer with purchase history and loyalty program participation.
- **Compliance Record**: Generated documentation for a batch meeting regulatory requirements.
- **Loyalty Account**: Customer account tracking points balance and redemption history.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a complete recipe with at least 10 ingredients in under 5 minutes.
- **SC-002**: Inventory deductions match actual batch usage with 99% accuracy.
- **SC-003**: Low-stock alerts are generated within 1 hour of threshold breach during business hours.
- **SC-004**: Full batch traceability is retrievable in under 30 seconds for any completed batch.
- **SC-005**: Compliance documentation is auto-generated for 100% of completed batches.
- **SC-006**: Loyalty points are accurately calculated and reflected immediately after transactions.
- **SC-007**: 95% of steeping completion notifications are delivered within 5 minutes of scheduled time.
